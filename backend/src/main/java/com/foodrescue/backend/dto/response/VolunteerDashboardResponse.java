package com.foodrescue.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class VolunteerDashboardResponse {
    private Long totalPickups;
    private Double totalKgRescued;
    private Integer reliabilityScore;
    private Integer points;
    private String tier;
    private Integer nearbyPostsCount;
    private Boolean isOnline;
}
