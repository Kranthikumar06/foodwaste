package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.ImpactLog;
import com.foodrescue.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ImpactLogRepository extends JpaRepository<ImpactLog, Long> {
    List<ImpactLog> findByDonor(User donor);
    List<ImpactLog> findByNgo(User ngo);

    @Query("SELECT SUM(il.mealsCount) FROM ImpactLog il WHERE il.donor = :donor")
    Long sumMealsByDonor(@Param("donor") User donor);

    @Query("SELECT SUM(il.kgRescued) FROM ImpactLog il WHERE il.donor = :donor")
    Double sumKgByDonor(@Param("donor") User donor);

    @Query("SELECT SUM(il.mealsCount) FROM ImpactLog il WHERE il.date >= :from")
    Long sumMealsSince(@Param("from") LocalDate from);

    @Query("SELECT SUM(il.kgRescued) FROM ImpactLog il WHERE il.date >= :from")
    Double sumKgSince(@Param("from") LocalDate from);
}
