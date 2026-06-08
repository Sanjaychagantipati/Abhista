package com.abhista.authorization;

import com.abhista.exception.AuthorizationException;
import com.abhista.user.User;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityUtils {

	private static final String ROLE_ADMIN = "ROLE_ADMIN";

	private SecurityUtils() {
	}

	public static Optional<Authentication> getAuthentication() {
		return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
				.filter(Authentication::isAuthenticated);
	}

	public static User getCurrentUser() {
		return getAuthentication()
				.map(Authentication::getPrincipal)
				.filter(User.class::isInstance)
				.map(User.class::cast)
				.orElseThrow(() -> new AuthorizationException("Authenticated user is required"));
	}

	public static Long getCurrentUserId() {
		return getCurrentUser().getId();
	}

	public static String getCurrentUsername() {
		return getAuthentication()
				.map(authentication -> {
					Object principal = authentication.getPrincipal();
					if (principal instanceof UserDetails userDetails) {
						return userDetails.getUsername();
					}
					return authentication.getName();
				})
				.orElseThrow(() -> new AuthorizationException("Authenticated user is required"));
	}

	public static boolean hasRole(String roleName) {
		String normalizedRoleName = normalizeRoleName(roleName);
		return getAuthentication()
				.map(Authentication::getAuthorities)
				.stream()
				.flatMap(authorities -> authorities.stream().map(GrantedAuthority::getAuthority))
				.anyMatch(normalizedRoleName::equals);
	}

	public static boolean isAdmin() {
		return hasRole(ROLE_ADMIN);
	}

	private static String normalizeRoleName(String roleName) {
		return roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
	}
}
