package com.foodrescue.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_routes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BatchRoute {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @Column(nullable = false)
    private Double totalCapacityKg;

    @Column(nullable = false)
    private Double collectedKg;

    private String routeGeoJson;

    @Column(nullable = false)
    @Builder.Default
    private Boolean completed = false;

    @CreationTimestamp
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}
