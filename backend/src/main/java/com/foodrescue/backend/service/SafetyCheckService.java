package com.foodrescue.backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class SafetyCheckService {

    // FSSAI safe hours by food category
    private static final Map<String, Integer> SAFE_HOURS = Map.of(
        "rice",        6,  "dal",         6,
        "curry",       4,  "biryani",     5,
        "bread",       8,  "salad",       3,
        "fried",       4,  "sweets",      12,
        "fruits",      8,  "default",     4
    );

    public LocalDateTime calculateSafeUntil(String foodType, LocalDateTime cookedAt) {
        int hours = SAFE_HOURS.getOrDefault(foodType.toLowerCase(), SAFE_HOURS.get("default"));
        return cookedAt.plusHours(hours);
    }

    public boolean isSafe(String foodType, LocalDateTime cookedAt) {
        return LocalDateTime.now().isBefore(calculateSafeUntil(foodType, cookedAt));
    }

    public String getPriorityLevel(LocalDateTime safeUntil) {
        long minutesLeft = java.time.Duration.between(LocalDateTime.now(), safeUntil).toMinutes();
        if (minutesLeft <= 20)  return "CRITICAL";
        if (minutesLeft <= 60)  return "URGENT";
        return "NORMAL";
    }
}
