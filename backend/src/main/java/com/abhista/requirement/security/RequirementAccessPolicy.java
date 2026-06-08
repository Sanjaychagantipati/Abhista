package com.abhista.requirement.security;

import com.abhista.authorization.SecurityUtils;
import com.abhista.requirement.enums.RequirementStatus;
import com.abhista.requirement.repository.RequirementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("requirementAccessPolicy")
@RequiredArgsConstructor
public class RequirementAccessPolicy {

	private final RequirementRepository requirementRepository;

	@Transactional(readOnly = true)
	public boolean isOpenRequirement(Long requirementId) {
		if (requirementId == null) {
			return false;
		}

		return SecurityUtils.isAdmin()
				|| requirementRepository.findById(requirementId)
				.map(requirement -> requirement.getStatus() == RequirementStatus.OPEN)
				.orElse(false);
	}
}
