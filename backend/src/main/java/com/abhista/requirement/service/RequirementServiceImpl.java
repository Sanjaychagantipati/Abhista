package com.abhista.requirement.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.exception.AuthorizationException;
import com.abhista.exception.ResourceNotFoundException;
import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;
import com.abhista.requirement.dto.RequirementResponse;
import com.abhista.requirement.entity.Requirement;
import com.abhista.requirement.enums.RequirementStatus;
import com.abhista.requirement.mapper.RequirementMapper;
import com.abhista.requirement.repository.RequirementRepository;
import com.abhista.user.User;
import java.util.List;
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

		Requirement requirement = requirementMapper.toEntity(request);
		requirement.setCustomer(currentUser);
		requirement.setStatus(RequirementStatus.OPEN);
		normalize(requirement);

		Requirement savedRequirement = requirementRepository.save(requirement);
		return requirementMapper.toCreateResponse(savedRequirement);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CUSTOMER')")
	public List<RequirementResponse> getMyRequirements() {
		Long customerId = SecurityUtils.getCurrentUserId();
		List<Requirement> requirements = requirementRepository.findByCustomerId(customerId);
		return requirements.stream()
				.map(requirementMapper::toResponse)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CUSTOMER')")
	public RequirementResponse getRequirementById(Long id) {
		Requirement requirement = requirementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));

		Long currentUserId = SecurityUtils.getCurrentUserId();
		if (!requirement.getCustomer().getId().equals(currentUserId)) {
			throw new AuthorizationException("You do not have permission to view this requirement");
		}

		return requirementMapper.toResponse(requirement);
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
