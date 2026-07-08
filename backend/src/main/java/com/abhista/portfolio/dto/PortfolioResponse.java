package com.abhista.portfolio.dto;

import java.time.Instant;

public record PortfolioResponse(
		Long id,
		Long professionalId,
		Long consultantId,
		String title,
		String description,
		String projectType,
		String imageUrl,
		Instant createdAt,
		Instant updatedAt
) {
}
