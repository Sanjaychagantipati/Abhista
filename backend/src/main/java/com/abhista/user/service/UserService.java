package com.abhista.user.service;

import com.abhista.exception.ResourceNotFoundException;
import com.abhista.user.User;
import com.abhista.user.dto.UserResponse;
import com.abhista.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String username) {
		return userRepository.findByEmail(username.trim().toLowerCase())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	@Transactional(readOnly = true)
	public User findByEmail(String email) {
		return userRepository.findByEmail(email.trim().toLowerCase())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	@Transactional(readOnly = true)
	public UserResponse getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return toResponse(user);
	}

	@Transactional(readOnly = true)
	public UserResponse getCurrentUser(Authentication authentication) {
		User user = resolveAuthenticatedUser(authentication);
		return toResponse(user);
	}

	public UserResponse toResponse(User user) {
		return new UserResponse(
				user.getId(),
				user.getFirstName(),
				user.getLastName(),
				user.getEmail(),
				user.getPhone(),
				user.getRole().getRoleName(),
				user.getProfileImageUrl(),
				user.getAddress(),
				user.getCity(),
				user.getState(),
				user.getStatus(),
				user.getCreatedAt(),
				user.getUpdatedAt()
		);
	}

	private User resolveAuthenticatedUser(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ResourceNotFoundException("Authenticated user not found");
		}

		Object principal = authentication.getPrincipal();
		if (principal instanceof User user) {
			return user;
		}

		if (principal instanceof UserDetails userDetails) {
			return findByEmail(userDetails.getUsername());
		}

		return findByEmail(authentication.getName());
	}
}
