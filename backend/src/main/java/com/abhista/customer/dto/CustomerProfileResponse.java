package com.abhista.customer.dto;

import java.time.Instant;

public record CustomerProfileResponse(
		Long id,
		Long userId,
		String fullName,
		String phoneNumber,
		String address,
		String city,
		String state,
		String pincode,
		String profileImageUrl,
		Instant createdAt,
		Instant updatedAt
) {
}
