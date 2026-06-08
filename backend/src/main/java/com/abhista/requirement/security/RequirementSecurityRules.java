package com.abhista.requirement.security;

public final class RequirementSecurityRules {

	public static final String CREATE_REQUIREMENT =
			"hasRole('CUSTOMER')";

	public static final String VIEW_OWN_REQUIREMENTS =
			"hasRole('CUSTOMER')";

	public static final String VIEW_REQUIREMENT_DETAIL =
			"hasRole('ADMIN')"
					+ " or (hasRole('CUSTOMER') and @ownershipService.isRequirementOwner(#requirementId))"
					+ " or (hasRole('CONTRACTOR') and @requirementAccessPolicy.isOpenRequirement(#requirementId))";

	public static final String UPDATE_REQUIREMENT =
			"hasRole('CUSTOMER') and @ownershipService.isRequirementOwner(#requirementId)";

	public static final String DELETE_REQUIREMENT =
			"hasRole('CUSTOMER') and @ownershipService.isRequirementOwner(#requirementId)";

	public static final String VIEW_OPEN_REQUIREMENTS =
			"hasRole('CONTRACTOR') or hasRole('ADMIN')";

	public static final String MANAGE_REQUIREMENT_STATUS =
			"hasRole('ADMIN')";

	private RequirementSecurityRules() {
	}
}
