package com.abhista.requirement.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.exception.AuthorizationException;
import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;
import com.abhista.requirement.entity.Requirement;
import com.abhista.requirement.enums.RequirementStatus;
import com.abhista.requirement.mapper.RequirementMapper;
import com.abhista.requirement.repository.RequirementRepository;
import com.abhista.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RequirementServiceImpl implements RequirementService {

	private final RequirementRepository requirementRepository;
	private final RequirementMapper requirementMapper;

	@Override
	@Transactional
	@PreAuthorize("hasRole('CUSTOMER')")
	public RequirementCreateResponse createRequirement(CreateRequirementRequest request) {
		User currentUser = SecurityUtils.getCurrentUser();

		if (!SecurityUtils.hasRole("CUSTOMER")) {
			throw new AuthorizationException("Only customers can create requirements");
		}

		Requirement requirement = requirementMapper.toEntity(request);
		requirement.setCustomer(currentUser);
		requirement.setStatus(RequirementStatus.OPEN);
		normalize(requirement);

		Requirement savedRequirement = requirementRepository.save(requirement);
		return requirementMapper.toCreateResponse(savedRequirement);
	}

	private void normalize(Requirement requirement) {
		requirement.setTitle(trim(requirement.getTitle()));
		requirement.setDescription(trim(requirement.getDescription()));
		requirement.setServiceCategory(trim(requirement.getServiceCategory()));
		requirement.setLocation(trim(requirement.getLocation()));
	}

	private String trim(String value) {
		return value == null ? null : value.trim();
	}
}
