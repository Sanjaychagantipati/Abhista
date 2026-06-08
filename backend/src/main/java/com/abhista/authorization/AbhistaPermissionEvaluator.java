package com.abhista.authorization;

import java.io.Serializable;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AbhistaPermissionEvaluator implements PermissionEvaluator {

	private final OwnershipService ownershipService;

	@Override
	public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
		if (targetDomainObject instanceof Long resourceId) {
			return hasPermission(authentication, resourceId, "PROJECT", permission);
		}
		return false;
	}

	@Override
	public boolean hasPermission(
			Authentication authentication,
			Serializable targetId,
			String targetType,
			Object permission
	) {
		if (authentication == null || !authentication.isAuthenticated() || !(targetId instanceof Long resourceId)) {
			return false;
		}

		if (SecurityUtils.isAdmin()) {
			return true;
		}

		String normalizedTargetType = normalize(targetType);
		String normalizedPermission = normalize(permission);

		return switch (normalizedTargetType) {
			case "REQUIREMENT" -> hasRequirementPermission(resourceId, normalizedPermission);
			case "PROJECT" -> hasProjectPermission(resourceId, normalizedPermission);
			case "TASK" -> hasTaskPermission(resourceId, normalizedPermission);
			case "REVIEW" -> hasReviewPermission(resourceId, normalizedPermission);
			default -> false;
		};
	}

	private boolean hasRequirementPermission(Long requirementId, String permission) {
		return switch (permission) {
			case "READ", "UPDATE", "DELETE", "MANAGE" -> ownershipService.isRequirementOwner(requirementId);
			case "CREATE" -> SecurityUtils.hasRole("CUSTOMER");
			default -> false;
		};
	}

	private boolean hasProjectPermission(Long projectId, String permission) {
		return switch (permission) {
			case "READ" -> ownershipService.canAccessProject(projectId);
			case "UPDATE", "MANAGE" -> ownershipService.isAssignedContractor(projectId);
			default -> false;
		};
	}

	private boolean hasTaskPermission(Long taskId, String permission) {
		return switch (permission) {
			case "READ", "UPDATE" -> ownershipService.isAssignedWorker(taskId);
			default -> false;
		};
	}

	private boolean hasReviewPermission(Long reviewId, String permission) {
		return switch (permission) {
			case "UPDATE", "DELETE", "MANAGE" -> ownershipService.isReviewOwner(reviewId);
			default -> false;
		};
	}

	private String normalize(Object value) {
		return String.valueOf(value).trim().toUpperCase(Locale.ROOT);
	}
}
