package com.foodrescue.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DonorDashboardResponse {
    private Double totalKgDonated;
    private Long totalMealsProvided;
    private Double totalCo2Saved;
    private Long totalPostsCount;
    private Long activePostsCount;
    private Long deliveredPostsCount;
    private Long expiredPostsCount;
    private Integer points;
    private String tier;
    private Double rescueSuccessRate;
}
