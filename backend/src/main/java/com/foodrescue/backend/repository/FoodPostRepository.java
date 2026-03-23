package com.foodrescue.backend.repository;

import com.foodrescue.backend.enums.PostStatus;
import com.foodrescue.backend.model.FoodPost;
import com.foodrescue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface FoodPostRepository extends JpaRepository<FoodPost, Long> {
    List<FoodPost> findByDonorOrderByCreatedAtDesc(User donor);
    List<FoodPost> findByStatus(PostStatus status);
    List<FoodPost> findByStatusAndPickupWindowEndBefore(PostStatus status, LocalDateTime time);

    @Query(value = """
        SELECT *, (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(fp.latitude)) *
              cos(radians(fp.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(fp.latitude))
            )
        ) AS distance_km
        FROM food_posts fp
        WHERE fp.status = 'LIVE'
          AND fp.safe_until > NOW()
          AND fp.pickup_window_end > NOW()
          AND (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(fp.latitude)) *
              cos(radians(fp.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(fp.latitude))
            )
          ) <= :radiusKm
        ORDER BY (DATEDIFF('SECOND', NOW(), fp.safe_until) / 60) /
                 GREATEST(0.1, (
                    6371 * acos(
                      cos(radians(:lat)) * cos(radians(fp.latitude)) *
                      cos(radians(fp.longitude) - radians(:lng)) +
                      sin(radians(:lat)) * sin(radians(fp.latitude))
                    )
                 )) ASC
        """, nativeQuery = true)
    List<FoodPost> findNearbyLivePostsSortedByPriority(@Param("lat") Double lat,
                                                        @Param("lng") Double lng,
                                                        @Param("radiusKm") Double radiusKm);

    @Query("SELECT fp FROM FoodPost fp WHERE fp.donor = :donor AND fp.status = 'LIVE'")
    List<FoodPost> findActiveByDonor(@Param("donor") User donor);

    @Query("SELECT COUNT(fp) FROM FoodPost fp WHERE fp.donor = :donor AND fp.status = 'DELIVERED'")
    Long countDeliveredByDonor(@Param("donor") User donor);

    @Query("SELECT SUM(fp.quantityKg) FROM FoodPost fp WHERE fp.donor = :donor AND fp.status = 'DELIVERED'")
    Double sumDeliveredKgByDonor(@Param("donor") User donor);
}
