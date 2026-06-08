package com.abhista.user.dto;

import com.abhista.user.UserStatus;
import java.time.Instant;

public record UserResponse(
		Long id,
		String firstName,
		String lastName,
		String email,
		String phone,
		String role,
		String profileImageUrl,
		String address,
		String city,
		String state,
		UserStatus status,
		Instant createdAt,
		Instant updatedAt
) {
}
