package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodPost;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import com.google.firebase.messaging.*;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${twilio.account-sid}")  private String twilioSid;
    @Value("${twilio.auth-token}")   private String twilioToken;
    @Value("${twilio.phone-number}") private String twilioPhone;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(twilioSid, twilioToken);
    }

    public void notifyNearbyVolunteers(FoodPost post, double radiusKm) {
        List<User> volunteers = userRepository.findNearbyByRole(
                post.getLatitude(), post.getLongitude(), radiusKm, "VOLUNTEER");
        for (User volunteer : volunteers) {
            sendPushNotification(volunteer, "🍱 New Food Available!",
                    post.getQuantityKg() + " kg of " + post.getFoodType() +
                    " — " + "pickup by " + post.getPickupWindowEnd());
        }
    }

    public void notifyNearbyNGOs(FoodPost post, double radiusKm) {
        List<User> ngos = userRepository.findNearbyByRole(
                post.getLatitude(), post.getLongitude(), radiusKm, "NGO");
        for (User ngo : ngos) {
            sendPushNotification(ngo, "📦 Incoming Food",
                    post.getQuantityKg() + " kg of " + post.getFoodType() + " needs delivery");
        }
    }

    public void sendPushNotification(User user, String title, String body) {
        if (user.getFcmToken() == null) {
            sendSms(user.getPhone(), title + ": " + body);
            return;
        }
        try {
            var message = com.google.firebase.messaging.Message.builder()
                    .setToken(user.getFcmToken())
                    .setNotification(Notification.builder().setTitle(title).setBody(body).build())
                    .build();
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            log.error("FCM send failed for user {}: {}", user.getId(), e.getMessage());
            sendSms(user.getPhone(), title + ": " + body);
        }
    }

    public void sendSms(String phone, String message) {
        try {
            Message.creator(new PhoneNumber("+91" + phone),
                            new PhoneNumber(twilioPhone), message).create();
        } catch (Exception e) {
            log.error("SMS failed to {}: {}", phone, e.getMessage());
        }
    }

    public void broadcastEmergency(double lat, double lng, double radiusKm, String alertMessage) {
        List<User> all = userRepository.findNearbyByRole(lat, lng, radiusKm, "VOLUNTEER");
        all.addAll(userRepository.findNearbyByRole(lat, lng, radiusKm, "DONOR"));
        all.addAll(userRepository.findNearbyByRole(lat, lng, radiusKm, "NGO"));
        for (User user : all) {
            sendPushNotification(user, "🚨 EMERGENCY MODE ACTIVATED", alertMessage);
        }
        messagingTemplate.convertAndSend("/topic/emergency", alertMessage);
    }

    public void sendWebSocketUpdate(String topic, Object payload) {
        messagingTemplate.convertAndSend(topic, payload);
    }
}
