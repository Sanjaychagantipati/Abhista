package com.abhista.requirement.dto;

import com.abhista.requirement.enums.RequirementStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record RequirementResponse(
		Long id,
		Long customerId,
		String title,
		String description,
		String serviceCategory,
		String location,
		BigDecimal budgetMin,
		BigDecimal budgetMax,
		LocalDate preferredStartDate,
		RequirementStatus status,
		Instant createdAt,
		Instant updatedAt
) {
}
