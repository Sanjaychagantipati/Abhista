package com.abhista.professional.dto;

import com.abhista.professional.enums.VerificationStatus;
import java.time.Instant;

public record ProfessionalProfileResponse(
		Long id,
		String companyName,
		String ownerName,
		String phoneNumber,
		Integer experienceYears,
		String specialization,
		String serviceAreas,
		String description,
		VerificationStatus verificationStatus,
		Boolean isFeatured,
		Instant createdAt,
		Instant updatedAt
) {
}
