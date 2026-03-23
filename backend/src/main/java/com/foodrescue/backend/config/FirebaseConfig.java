package com.foodrescue.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import java.io.IOException;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.config-path:#{null}}")
    private Resource firebaseConfigPath;

    @PostConstruct
    public void initFirebase() {
        try {
            if (firebaseConfigPath == null || !firebaseConfigPath.exists()) {
                log.warn("Firebase config file not found. Firebase features will be disabled.");
                return;
            }
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(firebaseConfigPath.getInputStream()))
                        .build();
                FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully");
            }
        } catch (IOException e) {
            log.warn("Failed to initialize Firebase: {}. Firebase features will be disabled.", e.getMessage());
        } catch (Exception e) {
            log.warn("Error initializing Firebase: {}. Firebase features will be disabled.", e.getMessage());
        }
    }
}
