package com.abhista.requirement.dto;

import com.abhista.requirement.enums.RequirementStatus;

public record RequirementCreateResponse(
		Long id,
		RequirementStatus status,
		String message
) {
}
