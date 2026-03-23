package com.foodrescue.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmergencyRequest {
    @NotNull private Double latitude;
    @NotNull private Double longitude;
    @NotNull private Double radiusKm;
    @NotBlank private String message;
}
