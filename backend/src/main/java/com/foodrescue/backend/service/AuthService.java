package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.request.LoginRequest;
import com.foodrescue.backend.dto.request.RegisterRequest;
import com.foodrescue.backend.dto.response.AuthResponse;
import com.foodrescue.backend.enums.Language;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already registered");
        if (userRepository.existsByPhone(req.getPhone()))
            throw new IllegalStateException("Phone already registered");

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .city(req.getCity())
                .organisationName(req.getOrganisationName())
                .ngoRegistrationNumber(req.getNgoRegistrationNumber())
                .transportType(req.getTransportType())
                .language(req.getLanguage() != null ? req.getLanguage() : Language.ENGLISH)
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .verified(false)
                .build();

        if (req.getTransportType() != null)
            user.setCapacityKg(req.getTransportType().getCapacityKg());

        userRepository.save(user);
        var ud = userDetailsService.loadUserByUsername(user.getEmail());
        var token = jwtService.generateToken(ud);

        return AuthResponse.builder()
                .token(token).userId(user.getId())
                .name(user.getName()).email(user.getEmail())
                .role(user.getRole()).verified(user.getVerified())
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.getEmailOrPhone(), req.getPassword()));
        var user = userRepository.findByEmailOrPhone(req.getEmailOrPhone(), req.getEmailOrPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var ud = userDetailsService.loadUserByUsername(user.getEmail());
        var token = jwtService.generateToken(ud);

        return AuthResponse.builder()
                .token(token).userId(user.getId())
                .name(user.getName()).email(user.getEmail())
                .role(user.getRole()).verified(user.getVerified())
                .build();
    }
}
