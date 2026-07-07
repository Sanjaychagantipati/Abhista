package com.abhista.lead.service;

import com.abhista.lead.dto.LeadResponse;
import com.abhista.requirement.enums.RequirementStatus;
import com.abhista.requirement.repository.RequirementRepository;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeadServiceImpl implements LeadService {

	private final RequirementRepository requirementRepository;

	public LeadServiceImpl(RequirementRepository requirementRepository) {
		this.requirementRepository = requirementRepository;
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CONTRACTOR')")
	public List<LeadResponse> getOpenLeads() {
		return requirementRepository.findByStatusOrderByCreatedAtDesc(RequirementStatus.OPEN)
				.stream()
				.map(requirement -> new LeadResponse(
						requirement.getId(),
						requirement.getTitle(),
						requirement.getDescription(),
						requirement.getServiceCategory(),
						requirement.getLocation(),
						requirement.getBudgetMin(),
						requirement.getBudgetMax(),
						requirement.getPreferredStartDate(),
						requirement.getCreatedAt()
				))
				.toList();
	}
}
