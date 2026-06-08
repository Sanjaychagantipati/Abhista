package com.abhista.requirement.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateRequirementRequest(
		@NotBlank(message = "Title is required")
		@Size(max = 150, message = "Title must not exceed 150 characters")
		String title,

		@NotBlank(message = "Description is required")
		@Size(max = 2000, message = "Description must not exceed 2000 characters")
		String description,

		@NotBlank(message = "Service category is required")
		@Size(max = 120, message = "Service category must not exceed 120 characters")
		String serviceCategory,

		@NotBlank(message = "Location is required")
		@Size(max = 255, message = "Location must not exceed 255 characters")
		String location,

		@NotNull(message = "Minimum budget is required")
		@DecimalMin(value = "0.00", message = "Minimum budget must be greater than or equal to 0")
		BigDecimal budgetMin,

		@NotNull(message = "Maximum budget is required")
		@DecimalMin(value = "0.00", message = "Maximum budget must be greater than or equal to 0")
		BigDecimal budgetMax,

		LocalDate preferredStartDate
) {

	@AssertTrue(message = "Maximum budget must be greater than or equal to minimum budget")
	public boolean isBudgetRangeValid() {
		if (budgetMin == null || budgetMax == null) {
			return true;
		}
		return budgetMax.compareTo(budgetMin) >= 0;
	}
}
