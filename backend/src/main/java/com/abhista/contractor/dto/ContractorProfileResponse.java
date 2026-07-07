package com.abhista.contractor.dto;

import com.abhista.contractor.enums.VerificationStatus;
import java.time.Instant;

public record ContractorProfileResponse(
		Long id,
		Long userId,
		String companyName,
		String ownerName,
		String phoneNumber,
		Integer experienceYears,
		String specialization,
		String serviceAreas,
		String description,
		VerificationStatus verificationStatus,
		Instant createdAt,
		Instant updatedAt
) {
}
