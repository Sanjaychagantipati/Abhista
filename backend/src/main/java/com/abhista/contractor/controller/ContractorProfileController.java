package com.abhista.contractor.controller;

import com.abhista.common.ApiResponse;
import com.abhista.contractor.dto.ContractorProfileCreateRequest;
import com.abhista.contractor.dto.ContractorProfileResponse;
import com.abhista.contractor.dto.ContractorProfileUpdateRequest;
import com.abhista.contractor.service.ContractorProfileService;
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
@RequestMapping("/api/contractor/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CONTRACTOR')")
public class ContractorProfileController {

	private final ContractorProfileService contractorProfileService;

	@PostMapping
	public ApiResponse<ContractorProfileResponse> createProfile(
			@Valid @RequestBody ContractorProfileCreateRequest request
	) {
		return ApiResponse.success("Profile created successfully", contractorProfileService.createProfile(request));
	}

	@GetMapping
	public ApiResponse<ContractorProfileResponse> getMyProfile() {
		return ApiResponse.success("Profile retrieved successfully", contractorProfileService.getMyProfile());
	}

	@PutMapping
	public ApiResponse<ContractorProfileResponse> updateProfile(
			@Valid @RequestBody ContractorProfileUpdateRequest request
	) {
		return ApiResponse.success("Profile updated successfully", contractorProfileService.updateProfile(request));
	}
}
