package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.request.FoodPostRequest;
import com.foodrescue.backend.dto.response.*;
import com.foodrescue.backend.service.FoodPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FoodPostController {

    private final FoodPostService foodPostService;

    @PostMapping("/donor/posts")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<FoodPostResponse>> createPost(
            @Valid @RequestBody FoodPostRequest req,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.ok("Post created", foodPostService.createPost(req, user.getUsername())));
    }

    @GetMapping("/donor/posts")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<List<FoodPostResponse>>> getMyPosts(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.ok("Posts fetched", foodPostService.getDonorPosts(user.getUsername())));
    }

    @DeleteMapping("/donor/posts/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<?>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        foodPostService.deletePost(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Post deleted"));
    }

    @GetMapping("/posts/nearby")
    public ResponseEntity<ApiResponse<List<FoodPostResponse>>> getNearbyPosts(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5.0") Double radius) {
        return ResponseEntity.ok(ApiResponse.ok("Nearby posts", foodPostService.getNearbyPosts(lat, lng, radius)));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<FoodPostResponse>> getPost(@PathVariable Long id) {
        var post = foodPostService.getDonorPosts("").stream()
                .filter(p -> p.getId().equals(id)).findFirst()
                .orElseThrow(() -> new com.foodrescue.backend.exception.ResourceNotFoundException("Post not found"));
        return ResponseEntity.ok(ApiResponse.ok("Post found", post));
    }
}
