package com.abhista.user.controller;

import com.abhista.common.ApiResponse;
import com.abhista.user.dto.UserResponse;
import com.abhista.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
		return ApiResponse.success("User retrieved successfully", userService.getUserById(id));
	}

	@GetMapping("/profile")
	public ApiResponse<UserResponse> profile(Authentication authentication) {
		return ApiResponse.success("Profile retrieved successfully", userService.getCurrentUser(authentication));
	}
}
