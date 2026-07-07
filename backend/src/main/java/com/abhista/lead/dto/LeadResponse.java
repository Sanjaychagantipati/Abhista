package com.abhista.lead.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record LeadResponse(
		Long id,
		String title,
		String description,
		String serviceCategory,
		String location,
		BigDecimal budgetMin,
		BigDecimal budgetMax,
		LocalDate preferredStartDate,
		Instant createdAt
) {
}
