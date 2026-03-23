package com.foodrescue.backend.model;

import com.foodrescue.backend.enums.Language;
import com.foodrescue.backend.enums.Role;
import com.foodrescue.backend.enums.TransportType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String city;
    private String organisationName;
    private String ngoRegistrationNumber;

    @Enumerated(EnumType.STRING)
    private TransportType transportType;

    private Integer capacityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Language language = Language.ENGLISH;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean online = false;

    private String fcmToken;

    @Column(nullable = false)
    @Builder.Default
    private Integer points = 0;

    @Builder.Default
    private Integer reliabilityScore = 100;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
