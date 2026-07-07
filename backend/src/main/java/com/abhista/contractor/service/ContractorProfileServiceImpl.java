package com.abhista.contractor.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.contractor.dto.ContractorProfileCreateRequest;
import com.abhista.contractor.dto.ContractorProfileResponse;
import com.abhista.contractor.dto.ContractorProfileUpdateRequest;
import com.abhista.contractor.entity.ContractorProfile;
import com.abhista.contractor.exception.ContractorProfileAlreadyExistsException;
import com.abhista.contractor.exception.ContractorProfileNotFoundException;
import com.abhista.contractor.mapper.ContractorProfileMapper;
import com.abhista.contractor.repository.ContractorProfileRepository;
import com.abhista.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContractorProfileServiceImpl implements ContractorProfileService {

	private final ContractorProfileRepository contractorProfileRepository;
	private final ContractorProfileMapper contractorProfileMapper;

	@Override
	@Transactional
	@PreAuthorize("hasRole('CONTRACTOR')")
	public ContractorProfileResponse createProfile(ContractorProfileCreateRequest request) {
		User currentUser = SecurityUtils.getCurrentUser();

		if (contractorProfileRepository.existsByUserId(currentUser.getId())) {
			throw new ContractorProfileAlreadyExistsException("Contractor profile already exists");
		}

		ContractorProfile contractorProfile = contractorProfileMapper.toEntity(request);
		contractorProfile.setUser(currentUser);
		normalize(contractorProfile);

		ContractorProfile savedProfile = contractorProfileRepository.save(contractorProfile);
		return contractorProfileMapper.toResponse(savedProfile);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CONTRACTOR')")
	public ContractorProfileResponse getMyProfile() {
		ContractorProfile contractorProfile = findCurrentUserProfile();
		return contractorProfileMapper.toResponse(contractorProfile);
	}

	@Override
	@Transactional
	@PreAuthorize("hasRole('CONTRACTOR')")
	public ContractorProfileResponse updateProfile(ContractorProfileUpdateRequest request) {
		ContractorProfile contractorProfile = findCurrentUserProfile();
		contractorProfileMapper.updateEntity(request, contractorProfile);
		normalize(contractorProfile);

		ContractorProfile savedProfile = contractorProfileRepository.save(contractorProfile);
		return contractorProfileMapper.toResponse(savedProfile);
	}

	private ContractorProfile findCurrentUserProfile() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		return contractorProfileRepository.findByUserId(currentUserId)
				.orElseThrow(() -> new ContractorProfileNotFoundException("Contractor profile not found"));
	}

	private void normalize(ContractorProfile contractorProfile) {
		contractorProfile.setCompanyName(trim(contractorProfile.getCompanyName()));
		contractorProfile.setOwnerName(trim(contractorProfile.getOwnerName()));
		contractorProfile.setPhoneNumber(trim(contractorProfile.getPhoneNumber()));
		contractorProfile.setSpecialization(trim(contractorProfile.getSpecialization()));
		contractorProfile.setServiceAreas(trimToNull(contractorProfile.getServiceAreas()));
		contractorProfile.setDescription(trimToNull(contractorProfile.getDescription()));
	}

	private String trim(String value) {
		return value == null ? null : value.trim();
	}

	private String trimToNull(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}
		return value.trim();
	}
}
