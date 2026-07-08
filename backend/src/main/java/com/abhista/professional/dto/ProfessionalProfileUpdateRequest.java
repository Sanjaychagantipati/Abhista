package com.abhista.professional.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfessionalProfileUpdateRequest(

		@NotBlank(message = "Company name is required")
		@Size(max = 150, message = "Company name must not exceed 150 characters")
		String companyName,

		@NotBlank(message = "Owner name is required")
		@Size(max = 150, message = "Owner name must not exceed 150 characters")
		String ownerName,

		@NotBlank(message = "Phone number is required")
		@Size(max = 30, message = "Phone number must not exceed 30 characters")
		@Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,30}$", message = "Phone number is not valid")
		String phoneNumber,

		@NotNull(message = "Experience years is required")
		@Min(value = 0, message = "Experience years must be 0 or greater")
		Integer experienceYears,

		@NotBlank(message = "Specialization is required")
		@Size(max = 150, message = "Specialization must not exceed 150 characters")
		String specialization,

		@Size(max = 500, message = "Service areas must not exceed 500 characters")
		String serviceAreas,

		@Size(max = 2000, message = "Description must not exceed 2000 characters")
		String description
) {
}
