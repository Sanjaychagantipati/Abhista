package com.abhista.requirement.service;

import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;
import com.abhista.requirement.dto.RequirementResponse;
import java.util.List;

public interface RequirementService {

	RequirementCreateResponse createRequirement(CreateRequirementRequest request);

	List<RequirementResponse> getMyRequirements();

	RequirementResponse getRequirementById(Long id);
}
