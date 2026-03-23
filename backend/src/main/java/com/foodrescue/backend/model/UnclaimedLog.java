package com.foodrescue.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "unclaimed_log")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UnclaimedLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private FoodPost foodPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private User donor;

    private String foodType;
    private Double quantityKg;
    private String zone;
    private String city;

    @Column(nullable = false)
    private LocalDateTime expiredAt;
}
