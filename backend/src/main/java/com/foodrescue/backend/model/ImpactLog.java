package com.foodrescue.backend.model;

import com.foodrescue.backend.enums.BeneficiaryType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "impact_log")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ImpactLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id")
    private User ngo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    private Integer mealsCount;
    private Double kgRescued;
    private Double co2SavedKg;

    @Enumerated(EnumType.STRING)
    private BeneficiaryType beneficiaryType;

    @Column(nullable = false)
    private LocalDate date;

    private String zone;
}
