package com.foodrescue.backend.dto.request;

import com.foodrescue.backend.enums.Language;
import com.foodrescue.backend.enums.Role;
import com.foodrescue.backend.enums.TransportType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank @Size(min=10, max=10) private String phone;
    @NotBlank @Size(min=6) private String password;
    @NotNull private Role role;
    private String city;
    private String organisationName;
    private String ngoRegistrationNumber;
    private TransportType transportType;
    private Language language;
    private Double latitude;
    private Double longitude;
}
