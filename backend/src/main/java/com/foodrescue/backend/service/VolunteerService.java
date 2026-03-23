package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.request.DeliveryConfirmRequest;
import com.foodrescue.backend.enums.PostStatus;
import com.foodrescue.backend.exception.*;
import com.foodrescue.backend.model.*;
import com.foodrescue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final FoodPostRepository foodPostRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final ImpactLogRepository impactLogRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final GamificationService gamificationService;
    private final NotificationService notificationService;

    private static final String LOCK_PREFIX = "post_lock:";
    private static final long   LOCK_TTL_MIN = 20;

    @Transactional
    public Claim claimPost(Long postId, String volunteerEmail) {
        FoodPost post = foodPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() != PostStatus.LIVE)
            throw new IllegalStateException("Post is no longer available");

        String lockKey = LOCK_PREFIX + postId;
        Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, volunteerEmail, LOCK_TTL_MIN, TimeUnit.MINUTES);

        if (Boolean.FALSE.equals(locked))
            throw new IllegalStateException("Post is already being claimed by another volunteer");

        User volunteer = userRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        post.setStatus(PostStatus.CLAIMED);
        foodPostRepository.save(post);

        Claim claim = Claim.builder()
                .foodPost(post)
                .volunteer(volunteer)
                .claimedAt(LocalDateTime.now())
                .build();
        claimRepository.save(claim);

        notificationService.sendPushNotification(
                post.getDonor(),
                "✅ Your food has been claimed!",
                volunteer.getName() + " is on the way to pick up your food."
        );
        return claim;
    }

    @Transactional
    public Claim markPickedUp(Long claimId, String volunteerEmail) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (!claim.getVolunteer().getEmail().equals(volunteerEmail))
            throw new UnauthorizedException("Not your claim");

        claim.setPickedUpAt(LocalDateTime.now());
        claim.getFoodPost().setStatus(PostStatus.PICKED_UP);
        foodPostRepository.save(claim.getFoodPost());
        return claimRepository.save(claim);
    }

    @Transactional
    public Claim confirmDelivery(DeliveryConfirmRequest req, String volunteerEmail) {
        Claim claim = claimRepository.findById(req.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (!claim.getVolunteer().getEmail().equals(volunteerEmail))
            throw new UnauthorizedException("Not your claim");

        claim.setDeliveredAt(LocalDateTime.now());
        claim.setQuantityRescuedKg(req.getQuantityRescuedKg());
        claim.getFoodPost().setStatus(PostStatus.DELIVERED);
        foodPostRepository.save(claim.getFoodPost());
        claimRepository.save(claim);

        gamificationService.awardPickupPoints(claim.getVolunteer(), req.getQuantityRescuedKg());

        ImpactLog log = ImpactLog.builder()
                .donor(claim.getFoodPost().getDonor())
                .ngo(claim.getNgo())
                .claim(claim)
                .kgRescued(req.getQuantityRescuedKg())
                .mealsCount(req.getMealsCount() != null ? req.getMealsCount()
                        : (int)(req.getQuantityRescuedKg() * 4))
                .co2SavedKg(req.getQuantityRescuedKg() * 2.5)
                .beneficiaryType(req.getBeneficiaryType())
                .date(java.time.LocalDate.now())
                .build();
        impactLogRepository.save(log);

        notificationService.sendPushNotification(
                claim.getFoodPost().getDonor(),
                "🎉 Your food reached people in need!",
                req.getQuantityRescuedKg() + " kg delivered. Thank you for donating!"
        );
        return claim;
    }

    public void toggleOnlineStatus(String volunteerEmail, boolean online) {
        User volunteer = userRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));
        volunteer.setOnline(online);
        userRepository.save(volunteer);
    }
}
