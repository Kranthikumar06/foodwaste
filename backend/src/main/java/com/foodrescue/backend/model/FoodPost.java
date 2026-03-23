package com.foodrescue.backend.model;

import com.foodrescue.backend.enums.PostStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_posts")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FoodPost {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Column(nullable = false)
    private String foodType;

    @Column(nullable = false)
    private Double quantityKg;

    private String description;

    @Column(nullable = false)
    private LocalDateTime cookedAt;

    @Column(nullable = false)
    private LocalDateTime safeUntil;

    @Column(nullable = false)
    private LocalDateTime pickupWindowStart;

    @Column(nullable = false)
    private LocalDateTime pickupWindowEnd;

    private String photoUrl;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PostStatus status = PostStatus.LIVE;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isEmergency = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRecurring = false;

    private String recurringDays;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
