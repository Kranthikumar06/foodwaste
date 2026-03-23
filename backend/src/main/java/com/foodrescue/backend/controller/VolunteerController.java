package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.request.*;
import com.foodrescue.backend.dto.response.*;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/volunteer")
@PreAuthorize("hasRole('VOLUNTEER')")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final ImpactService impactService;
    private final FoodPostService foodPostService;
    private final UserRepository userRepository;

    @PostMapping("/claims/{postId}")
    public ResponseEntity<ApiResponse<?>> claimPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails user) {
        var claim = volunteerService.claimPost(postId, user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Post claimed successfully", claim.getId()));
    }

    @PutMapping("/claims/{claimId}/pickup")
    public ResponseEntity<ApiResponse<?>> markPickedUp(
            @PathVariable Long claimId,
            @AuthenticationPrincipal UserDetails user) {
        volunteerService.markPickedUp(claimId, user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Pickup confirmed"));
    }

    @PutMapping("/claims/deliver")
    public ResponseEntity<ApiResponse<?>> confirmDelivery(
            @Valid @RequestBody DeliveryConfirmRequest req,
            @AuthenticationPrincipal UserDetails user) {
        volunteerService.confirmDelivery(req, user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Delivery confirmed. Impact updated!"));
    }

    @PutMapping("/status")
    public ResponseEntity<ApiResponse<?>> updateStatus(
            @RequestParam Boolean online,
            @AuthenticationPrincipal UserDetails user) {
        volunteerService.toggleOnlineStatus(user.getUsername(), online);
        return ResponseEntity.ok(ApiResponse.ok("Status updated"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<VolunteerDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails user) {
        var volunteer = userRepository.findByEmail(user.getUsername()).orElseThrow();
        int nearby = foodPostService.getNearbyPosts(
                volunteer.getLatitude(), volunteer.getLongitude(), 5.0).size();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard", impactService.getVolunteerDashboard(volunteer, nearby)));
    }
}
