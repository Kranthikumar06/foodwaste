package com.foodrescue.backend.dto.request;

import com.foodrescue.backend.enums.BeneficiaryType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeliveryConfirmRequest {
    @NotNull private Long claimId;
    @NotNull private Double quantityRescuedKg;
    private BeneficiaryType beneficiaryType;
    private Integer mealsCount;
}
