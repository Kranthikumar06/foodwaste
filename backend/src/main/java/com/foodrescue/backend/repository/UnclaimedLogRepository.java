package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.UnclaimedLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface UnclaimedLogRepository extends JpaRepository<UnclaimedLog, Long> {
    @Query("SELECT ul.zone, COUNT(ul), SUM(ul.quantityKg) FROM UnclaimedLog ul WHERE ul.expiredAt >= :from GROUP BY ul.zone ORDER BY COUNT(ul) DESC")
    List<Object[]> findZoneWasteStats(@Param("from") LocalDateTime from);

    List<UnclaimedLog> findByExpiredAtAfter(LocalDateTime from);
}
