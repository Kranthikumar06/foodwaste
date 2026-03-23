package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.response.DonorDashboardResponse;
import com.foodrescue.backend.dto.response.VolunteerDashboardResponse;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ImpactService {

    private final FoodPostRepository foodPostRepository;
    private final ClaimRepository claimRepository;
    private final ImpactLogRepository impactLogRepository;
    private final GamificationService gamificationService;

    public DonorDashboardResponse getDonorDashboard(User donor) {
        Double totalKg   = foodPostRepository.sumDeliveredKgByDonor(donor);
        Long delivered   = foodPostRepository.countDeliveredByDonor(donor);
        Long totalMeals  = impactLogRepository.sumMealsByDonor(donor);
        var  posts       = foodPostRepository.findByDonorOrderByCreatedAtDesc(donor);
        long active      = posts.stream().filter(p -> p.getStatus().name().equals("LIVE")).count();
        long expired     = posts.stream().filter(p -> p.getStatus().name().equals("EXPIRED")).count();
        double rate      = posts.isEmpty() ? 0 : (double) delivered / posts.size() * 100;
        double co2       = totalKg != null ? totalKg * 2.5 : 0;

        return DonorDashboardResponse.builder()
                .totalKgDonated(totalKg != null ? totalKg : 0.0)
                .totalMealsProvided(totalMeals != null ? totalMeals : 0L)
                .totalCo2Saved(co2)
                .totalPostsCount((long) posts.size())
                .activePostsCount(active)
                .deliveredPostsCount(delivered)
                .expiredPostsCount(expired)
                .points(donor.getPoints())
                .tier(gamificationService.getTier(donor.getPoints()))
                .rescueSuccessRate(rate)
                .build();
    }

    public VolunteerDashboardResponse getVolunteerDashboard(User volunteer, int nearbyCount) {
        long pickups    = claimRepository.countByVolunteer(volunteer);
        Double totalKg  = claimRepository.sumRescuedKgByVolunteer(volunteer);

        return VolunteerDashboardResponse.builder()
                .totalPickups(pickups)
                .totalKgRescued(totalKg != null ? totalKg : 0.0)
                .reliabilityScore(volunteer.getReliabilityScore())
                .points(volunteer.getPoints())
                .tier(gamificationService.getTier(volunteer.getPoints()))
                .nearbyPostsCount(nearbyCount)
                .isOnline(volunteer.getOnline())
                .build();
    }

    public long getTotalMealsSince(LocalDate from) {
        Long v = impactLogRepository.sumMealsSince(from);
        return v != null ? v : 0;
    }

    public double getTotalKgSince(LocalDate from) {
        Double v = impactLogRepository.sumKgSince(from);
        return v != null ? v : 0.0;
    }
}
