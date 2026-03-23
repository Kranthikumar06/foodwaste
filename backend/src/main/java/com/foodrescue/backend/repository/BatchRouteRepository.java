package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.BatchRoute;
import com.foodrescue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BatchRouteRepository extends JpaRepository<BatchRoute, Long> {
    Optional<BatchRoute> findByVolunteerAndCompletedFalse(User volunteer);
    List<BatchRoute> findByVolunteerOrderByStartedAtDesc(User volunteer);
}
