package com.foodrescue.backend.repository;

import com.foodrescue.backend.enums.Role;
import com.foodrescue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByRoleAndVerifiedTrue(Role role);
    List<User> findByRoleAndOnlineTrueAndVerifiedTrue(Role role);

    @Query(value = """
        SELECT * FROM users u
        WHERE u.role = :role
          AND u.verified = true
          AND u.active = true
          AND (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(u.latitude)) *
              cos(radians(u.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(u.latitude))
            )
          ) <= :radiusKm
        ORDER BY (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(u.latitude)) *
              cos(radians(u.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(u.latitude))
            )
        ) ASC
        """, nativeQuery = true)
    List<User> findNearbyByRole(@Param("lat") Double lat,
                                @Param("lng") Double lng,
                                @Param("radiusKm") Double radiusKm,
                                @Param("role") String role);
}
