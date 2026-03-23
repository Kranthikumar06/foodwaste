package com.foodrescue.backend.dto.response;

import com.foodrescue.backend.enums.PostStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class FoodPostResponse {
    private Long id;
    private String foodType;
    private Double quantityKg;
    private String description;
    private LocalDateTime cookedAt;
    private LocalDateTime safeUntil;
    private LocalDateTime pickupWindowStart;
    private LocalDateTime pickupWindowEnd;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private String address;
    private PostStatus status;
    private Boolean isEmergency;
    private String donorName;
    private Long donorId;
    private LocalDateTime createdAt;
    private Double distanceKm;
    private Long minutesUntilExpiry;
    private String priorityLevel;
}
