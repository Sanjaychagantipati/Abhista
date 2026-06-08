package com.abhista.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerProfileUpdateRequest(
		@NotBlank(message = "Full name is required")
		@Size(max = 150, message = "Full name must not exceed 150 characters")
		String fullName,

		@NotBlank(message = "Phone number is required")
		@Size(max = 30, message = "Phone number must not exceed 30 characters")
		String phoneNumber,

		@Size(max = 500, message = "Address must not exceed 500 characters")
		String address,

		@NotBlank(message = "City is required")
		@Size(max = 100, message = "City must not exceed 100 characters")
		String city,

		@NotBlank(message = "State is required")
		@Size(max = 100, message = "State must not exceed 100 characters")
		String state,

		@NotBlank(message = "Pincode is required")
		@Size(max = 20, message = "Pincode must not exceed 20 characters")
		String pincode,

		@Size(max = 500, message = "Profile image URL must not exceed 500 characters")
		String profileImageUrl
) {
}
