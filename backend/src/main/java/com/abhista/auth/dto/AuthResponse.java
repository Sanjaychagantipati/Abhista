package com.abhista.auth.dto;

import com.abhista.user.dto.UserResponse;

public record AuthResponse(
		String accessToken,
		UserResponse user
) {
}
