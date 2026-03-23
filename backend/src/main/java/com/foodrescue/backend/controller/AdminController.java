package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.request.EmergencyRequest;
import com.foodrescue.backend.dto.response.ApiResponse;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping("/users/pending")
    public ResponseEntity<ApiResponse<List<User>>> getPendingVerifications() {
        var pending = userRepository.findAll().stream()
                .filter(u -> !u.getVerified()).toList();
        return ResponseEntity.ok(ApiResponse.ok("Pending users", pending));
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<ApiResponse<?>> verifyUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.foodrescue.backend.exception.ResourceNotFoundException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User verified"));
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<?>> suspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.foodrescue.backend.exception.ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User suspended"));
    }

    @PostMapping("/emergency/activate")
    public ResponseEntity<ApiResponse<?>> activateEmergency(@Valid @RequestBody EmergencyRequest req) {
        notificationService.broadcastEmergency(
                req.getLatitude(), req.getLongitude(), req.getRadiusKm(), req.getMessage());
        return ResponseEntity.ok(ApiResponse.ok("Emergency mode activated. All nearby users notified."));
    }
}
