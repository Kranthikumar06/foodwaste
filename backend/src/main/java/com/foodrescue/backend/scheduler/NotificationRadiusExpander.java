package com.foodrescue.backend.scheduler;

import com.foodrescue.backend.enums.PostStatus;
import com.foodrescue.backend.repository.FoodPostRepository;
import com.foodrescue.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRadiusExpander {

    private final FoodPostRepository foodPostRepository;
    private final NotificationService notificationService;

    // Every 15 minutes expand radius for unclaimed posts
    @Scheduled(fixedRate = 900000)
    public void expandRadiusForUnclaimedPosts() {
        var livePosts = foodPostRepository.findByStatus(PostStatus.LIVE);
        for (var post : livePosts) {
            long minutesOld = java.time.Duration.between(post.getCreatedAt(), LocalDateTime.now()).toMinutes();
            if (minutesOld >= 15 && minutesOld < 30) {
                // Expand to 7km after 15 min
                notificationService.notifyNearbyVolunteers(post, 7.0);
                log.info("Expanded notification radius to 7km for post {}", post.getId());
            }
        }
    }
}
