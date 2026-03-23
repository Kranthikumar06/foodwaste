package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.response.*;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.ImpactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donor")
@PreAuthorize("hasRole('DONOR')")
@RequiredArgsConstructor
public class DonorController {

    private final ImpactService impactService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DonorDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails user) {
        var donor = userRepository.findByEmail(user.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard", impactService.getDonorDashboard(donor)));
    }
}
