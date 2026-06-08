package com.abhista.auth.service;

import com.abhista.auth.Role;
import com.abhista.auth.dto.AuthResponse;
import com.abhista.auth.dto.LoginRequest;
import com.abhista.auth.dto.RegisterRequest;
import com.abhista.auth.repository.RoleRepository;
import com.abhista.auth.security.JwtService;
import com.abhista.exception.ResourceNotFoundException;
import com.abhista.exception.ValidationException;
import com.abhista.user.User;
import com.abhista.user.UserStatus;
import com.abhista.user.repository.UserRepository;
import com.abhista.user.service.UserService;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

	private static final Set<String> PUBLIC_REGISTRATION_ROLES = Set.of(
			"ROLE_CUSTOMER",
			"ROLE_CONTRACTOR",
			"ROLE_ARCHITECT"
	);

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final UserService userService;

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = normalizeEmail(request.email());

		if (userRepository.existsByEmail(email)) {
			throw new ValidationException("Email is already registered");
		}

		String roleName = normalizeRoleName(request.roleName());
		if (!PUBLIC_REGISTRATION_ROLES.contains(roleName)) {
			throw new ValidationException("Registration is allowed only for CUSTOMER, CONTRACTOR, and ARCHITECT roles");
		}

		Role role = roleRepository.findByRoleName(roleName)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		User user = User.builder()
				.firstName(request.firstName().trim())
				.lastName(request.lastName().trim())
				.email(email)
				.password(passwordEncoder.encode(request.password()))
				.phone(trimToNull(request.phone()))
				.role(role)
				.profileImageUrl(trimToNull(request.profileImageUrl()))
				.address(trimToNull(request.address()))
				.city(trimToNull(request.city()))
				.state(trimToNull(request.state()))
				.status(UserStatus.ACTIVE)
				.build();

		User savedUser = userRepository.save(user);
		String accessToken = jwtService.generateToken(savedUser);

		return new AuthResponse(accessToken, userService.toResponse(savedUser));
	}

	@Transactional(readOnly = true)
	public AuthResponse login(LoginRequest request) {
		String email = normalizeEmail(request.email());

		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(email, request.password())
		);

		User user = userService.findByEmail(email);
		String accessToken = jwtService.generateToken(user);

		return new AuthResponse(accessToken, userService.toResponse(user));
	}

	private String normalizeEmail(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private String normalizeRoleName(String roleName) {
		String normalized = roleName.trim().toUpperCase(Locale.ROOT);
		return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
	}

	private String trimToNull(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}
		return value.trim();
	}
}
