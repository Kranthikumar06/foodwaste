package com.foodrescue.backend.service;

import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;

    public static final int POINTS_PER_PICKUP   = 50;
    public static final int POINTS_PER_KG       = 5;
    public static final int POINTS_PER_POST      = 20;
    public static final int POINTS_FAST_CLAIM    = 30;

    public void awardPickupPoints(User volunteer, double kgRescued) {
        int points = POINTS_PER_PICKUP + (int)(kgRescued * POINTS_PER_KG);
        volunteer.setPoints(volunteer.getPoints() + points);
        userRepository.save(volunteer);
    }

    public void awardDonationPoints(User donor) {
        donor.setPoints(donor.getPoints() + POINTS_PER_POST);
        userRepository.save(donor);
    }

    public String getTier(int points) {
        if (points >= 5000) return "Champion";
        if (points >= 2000) return "Guardian";
        if (points >= 750)  return "Rescuer";
        if (points >= 200)  return "Helper";
        return "Newcomer";
    }

    public int getPointsToNextTier(int points) {
        if (points < 200)  return 200  - points;
        if (points < 750)  return 750  - points;
        if (points < 2000) return 2000 - points;
        if (points < 5000) return 5000 - points;
        return 0;
    }
}
