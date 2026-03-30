package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.request.FoodPostRequest;
import com.foodrescue.backend.dto.response.FoodPostResponse;
import com.foodrescue.backend.enums.PostStatus;
import com.foodrescue.backend.exception.*;
import com.foodrescue.backend.model.FoodPost;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodPostService {

    private final FoodPostRepository foodPostRepository;
    private final UserRepository userRepository;
    private final SafetyCheckService safetyCheckService;
    private final NotificationService notificationService;
    private final GamificationService gamificationService;

    public FoodPostResponse createPost(FoodPostRequest req, String userEmail) {
        User donor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!safetyCheckService.isSafe(req.getFoodType(), req.getCookedAt()))
            throw new FoodSafetyException("Food has exceeded safe redistribution window per FSSAI guidelines");

        LocalDateTime safeUntil = safetyCheckService.calculateSafeUntil(req.getFoodType(), req.getCookedAt());

        FoodPost post = FoodPost.builder()
                .donor(donor)
                .foodType(req.getFoodType())
                .quantityKg(req.getQuantityKg())
                .description(req.getDescription())
                .cookedAt(req.getCookedAt())
                .safeUntil(safeUntil)
                .pickupWindowStart(req.getPickupWindowStart())
                .pickupWindowEnd(req.getPickupWindowEnd())
                .photoUrl(req.getPhotoUrl())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .address(req.getAddress())
                .isRecurring(req.getIsRecurring())
                .recurringDays(req.getRecurringDays())
                .status(PostStatus.LIVE)
                .build();

        foodPostRepository.save(post);
        gamificationService.awardDonationPoints(donor);
        notificationService.notifyNearbyVolunteers(post, 3.0);

        return toResponse(post, null);
    }

    public List<FoodPostResponse> getNearbyPosts(Double lat, Double lng, Double radiusKm) {
        return foodPostRepository.findNearbyLivePostsSortedByPriority(lat, lng, radiusKm)
                .stream().map(p -> toResponse(p, null)).toList();
    }

    public List<FoodPostResponse> getAllAvailablePosts() {
        return foodPostRepository.findByStatusOrderByCreatedAtDesc(PostStatus.LIVE)
                .stream().map(p -> toResponse(p, null)).toList();
    }

    public List<FoodPostResponse> getDonorPosts(String userEmail) {
        User donor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return foodPostRepository.findByDonorOrderByCreatedAtDesc(donor)
                .stream().map(p -> toResponse(p, null)).toList();
    }

    public void deletePost(Long postId, String userEmail) {
        FoodPost post = foodPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!post.getDonor().getEmail().equals(userEmail))
            throw new UnauthorizedException("Not your post");
        if (post.getStatus() != PostStatus.LIVE)
            throw new IllegalStateException("Cannot delete a post that is already " + post.getStatus());
        foodPostRepository.delete(post);
    }

    public FoodPostResponse toResponse(FoodPost p, Double distanceKm) {
        long minutesLeft = Duration.between(LocalDateTime.now(), p.getSafeUntil()).toMinutes();
        return FoodPostResponse.builder()
                .id(p.getId())
                .foodType(p.getFoodType())
                .quantityKg(p.getQuantityKg())
                .description(p.getDescription())
                .cookedAt(p.getCookedAt())
                .safeUntil(p.getSafeUntil())
                .pickupWindowStart(p.getPickupWindowStart())
                .pickupWindowEnd(p.getPickupWindowEnd())
                .photoUrl(p.getPhotoUrl())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .address(p.getAddress())
                .status(p.getStatus())
                .isEmergency(p.getIsEmergency())
                .donorName(p.getDonor().getName())
                .donorId(p.getDonor().getId())
                .createdAt(p.getCreatedAt())
                .distanceKm(distanceKm)
                .minutesUntilExpiry(minutesLeft)
                .priorityLevel(safetyCheckService.getPriorityLevel(p.getSafeUntil()))
                .build();
    }
}
