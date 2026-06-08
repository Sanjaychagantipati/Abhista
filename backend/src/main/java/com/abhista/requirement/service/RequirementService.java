package com.abhista.requirement.service;

import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;

public interface RequirementService {

	RequirementCreateResponse createRequirement(CreateRequirementRequest request);
}
