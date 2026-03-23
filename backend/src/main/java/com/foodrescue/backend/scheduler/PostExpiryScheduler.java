package com.foodrescue.backend.scheduler;

import com.foodrescue.backend.enums.PostStatus;
import com.foodrescue.backend.model.UnclaimedLog;
import com.foodrescue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class PostExpiryScheduler {

    private final FoodPostRepository foodPostRepository;
    private final UnclaimedLogRepository unclaimedLogRepository;

    // Run every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void expireOldPosts() {
        var expired = foodPostRepository.findByStatusAndPickupWindowEndBefore(
                PostStatus.LIVE, LocalDateTime.now());

        for (var post : expired) {
            post.setStatus(PostStatus.EXPIRED);
            foodPostRepository.save(post);

            // Log as inferred waste
            UnclaimedLog log = UnclaimedLog.builder()
                    .foodPost(post)
                    .donor(post.getDonor())
                    .foodType(post.getFoodType())
                    .quantityKg(post.getQuantityKg())
                    .city(post.getDonor().getCity())
                    .expiredAt(LocalDateTime.now())
                    .build();
            unclaimedLogRepository.save(log);
        }
        if (!expired.isEmpty())
            log.info("Expired {} posts and logged as inferred waste", expired.size());
    }
}
