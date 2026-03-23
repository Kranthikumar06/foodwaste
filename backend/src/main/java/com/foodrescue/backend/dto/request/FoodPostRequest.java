package com.foodrescue.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FoodPostRequest {
    @NotBlank private String foodType;
    @NotNull @Positive private Double quantityKg;
    private String description;
    @NotNull private LocalDateTime cookedAt;
    @NotNull private LocalDateTime pickupWindowStart;
    @NotNull private LocalDateTime pickupWindowEnd;
    private String photoUrl;
    @NotNull private Double latitude;
    @NotNull private Double longitude;
    private String address;
    private Boolean isRecurring = false;
    private String recurringDays;
}
