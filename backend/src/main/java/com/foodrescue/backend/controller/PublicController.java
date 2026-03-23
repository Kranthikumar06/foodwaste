package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.response.ApiResponse;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.ImpactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ImpactService impactService;
    private final UserRepository userRepository;

    @GetMapping("/stats/live")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLiveStats() {
        long meals = impactService.getTotalMealsSince(LocalDate.now().minusDays(30));
        double kg  = impactService.getTotalKgSince(LocalDate.now().minusDays(30));
        long vols  = userRepository.findByRoleAndOnlineTrueAndVerifiedTrue(
                com.foodrescue.backend.enums.Role.VOLUNTEER).size();

        return ResponseEntity.ok(ApiResponse.ok("Live stats", Map.of(
                "mealsRescued", meals,
                "kgSaved",      kg,
                "activeVolunteers", vols
        )));
    }
}
