package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.Claim;
import com.foodrescue.backend.model.FoodPost;
import com.foodrescue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByFoodPost(FoodPost post);
    List<Claim> findByVolunteerOrderByClaimedAtDesc(User volunteer);
    List<Claim> findByNgoOrderByClaimedAtDesc(User ngo);
    long countByVolunteer(User volunteer);

    @Query("SELECT c FROM Claim c WHERE c.volunteer = :v AND c.deliveredAt IS NULL AND c.pickedUpAt IS NOT NULL")
    List<Claim> findActivePickupsByVolunteer(@Param("v") User volunteer);

    @Query("SELECT SUM(c.quantityRescuedKg) FROM Claim c WHERE c.volunteer = :v AND c.deliveredAt IS NOT NULL")
    Double sumRescuedKgByVolunteer(@Param("v") User v);
}
