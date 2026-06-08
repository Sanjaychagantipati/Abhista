package com.abhista.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("customSecurityExpressions")
@RequiredArgsConstructor
public class CustomSecurityExpressions {

	private final OwnershipService ownershipService;

	public boolean canCreateRequirement() {
		return SecurityUtils.isAdmin() || SecurityUtils.hasRole("CUSTOMER");
	}

	public boolean canReadRequirement(Long requirementId) {
		return ownershipService.isRequirementOwner(requirementId);
	}

	public boolean canManageRequirement(Long requirementId) {
		return ownershipService.isRequirementOwner(requirementId);
	}

	public boolean canReadProject(Long projectId) {
		return ownershipService.canAccessProject(projectId);
	}

	public boolean canManageProject(Long projectId) {
		return ownershipService.isAssignedContractor(projectId);
	}

	public boolean canCreateMilestone(Long projectId) {
		return ownershipService.isAssignedContractor(projectId);
	}

	public boolean canUpdateMilestone(Long projectId) {
		return ownershipService.isAssignedContractor(projectId);
	}

	public boolean canAssignWorkers(Long projectId) {
		return ownershipService.isAssignedContractor(projectId);
	}

	public boolean canUpdateTask(Long taskId) {
		return ownershipService.isAssignedWorker(taskId);
	}

	public boolean canDeleteReview(Long reviewId) {
		return SecurityUtils.isAdmin() || ownershipService.isReviewOwner(reviewId);
	}
}
