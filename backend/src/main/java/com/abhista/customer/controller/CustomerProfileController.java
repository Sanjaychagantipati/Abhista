package com.abhista.customer.controller;

import com.abhista.common.ApiResponse;
import com.abhista.customer.dto.CustomerProfileCreateRequest;
import com.abhista.customer.dto.CustomerProfileResponse;
import com.abhista.customer.dto.CustomerProfileUpdateRequest;
import com.abhista.customer.service.CustomerProfileService;
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
@RequestMapping("/api/customer/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerProfileController {

	private final CustomerProfileService customerProfileService;

	@PostMapping
	public ApiResponse<CustomerProfileResponse> createProfile(
			@Valid @RequestBody CustomerProfileCreateRequest request
	) {
		return ApiResponse.success("Profile created successfully", customerProfileService.createProfile(request));
	}

	@GetMapping
	public ApiResponse<CustomerProfileResponse> getMyProfile() {
		return ApiResponse.success("Profile retrieved successfully", customerProfileService.getMyProfile());
	}

	@PutMapping
	public ApiResponse<CustomerProfileResponse> updateProfile(
			@Valid @RequestBody CustomerProfileUpdateRequest request
	) {
		return ApiResponse.success("Profile updated successfully", customerProfileService.updateProfile(request));
	}
}
