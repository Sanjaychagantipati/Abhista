package com.abhista.professional.controller;

import com.abhista.common.ApiResponse;
import com.abhista.professional.dto.ProfessionalProfileCreateRequest;
import com.abhista.professional.dto.ProfessionalProfileResponse;
import com.abhista.professional.dto.ProfessionalProfileUpdateRequest;
import com.abhista.professional.service.ProfessionalProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/professional/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROFESSIONAL')")
public class ProfessionalProfileController {

	private final ProfessionalProfileService professionalProfileService;

	@PostMapping
	public ApiResponse<ProfessionalProfileResponse> createProfile(
			@Valid @RequestBody ProfessionalProfileCreateRequest request
	) {
		return ApiResponse.success("Profile created successfully", professionalProfileService.createProfile(request));
	}

	@GetMapping
	public ApiResponse<ProfessionalProfileResponse> getMyProfile() {
		return ApiResponse.success("Profile retrieved successfully", professionalProfileService.getMyProfile());
	}

	@PutMapping
	public ApiResponse<ProfessionalProfileResponse> updateProfile(
			@Valid @RequestBody ProfessionalProfileUpdateRequest request
	) {
		return ApiResponse.success("Profile updated successfully", professionalProfileService.updateProfile(request));
	}
}
