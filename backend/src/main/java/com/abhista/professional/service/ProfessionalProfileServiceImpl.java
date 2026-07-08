package com.abhista.professional.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.professional.dto.ProfessionalProfileCreateRequest;
import com.abhista.professional.dto.ProfessionalProfileResponse;
import com.abhista.professional.dto.ProfessionalProfileUpdateRequest;
import com.abhista.professional.entity.ProfessionalProfile;
import com.abhista.professional.exception.ProfessionalProfileAlreadyExistsException;
import com.abhista.professional.exception.ProfessionalProfileNotFoundException;
import com.abhista.professional.mapper.ProfessionalProfileMapper;
import com.abhista.professional.repository.ProfessionalProfileRepository;
import com.abhista.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessionalProfileServiceImpl implements ProfessionalProfileService {

	private final ProfessionalProfileRepository professionalProfileRepository;
	private final ProfessionalProfileMapper professionalProfileMapper;

	@Override
	@Transactional
	@PreAuthorize("hasRole('PROFESSIONAL')")
	public ProfessionalProfileResponse createProfile(ProfessionalProfileCreateRequest request) {
		User currentUser = SecurityUtils.getCurrentUser();

		if (professionalProfileRepository.existsByUserId(currentUser.getId())) {
			throw new ProfessionalProfileAlreadyExistsException("Professional profile already exists");
		}

		ProfessionalProfile professionalProfile = professionalProfileMapper.toEntity(request);
		professionalProfile.setUser(currentUser);
		normalize(professionalProfile);

		ProfessionalProfile savedProfile = professionalProfileRepository.save(professionalProfile);
		return professionalProfileMapper.toResponse(savedProfile);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('PROFESSIONAL')")
	public ProfessionalProfileResponse getMyProfile() {
		ProfessionalProfile professionalProfile = findCurrentUserProfile();
		return professionalProfileMapper.toResponse(professionalProfile);
	}

	@Override
	@Transactional
	@PreAuthorize("hasRole('PROFESSIONAL')")
	public ProfessionalProfileResponse updateProfile(ProfessionalProfileUpdateRequest request) {
		ProfessionalProfile professionalProfile = findCurrentUserProfile();
		professionalProfileMapper.updateEntityFromRequest(request, professionalProfile);
		normalize(professionalProfile);

		ProfessionalProfile savedProfile = professionalProfileRepository.save(professionalProfile);
		return professionalProfileMapper.toResponse(savedProfile);
	}

	private ProfessionalProfile findCurrentUserProfile() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		return professionalProfileRepository.findByUserId(currentUserId)
				.orElseThrow(() -> new ProfessionalProfileNotFoundException("Professional profile not found"));
	}

	private void normalize(ProfessionalProfile professionalProfile) {
		professionalProfile.setCompanyName(trim(professionalProfile.getCompanyName()));
		professionalProfile.setOwnerName(trim(professionalProfile.getOwnerName()));
		professionalProfile.setPhoneNumber(trim(professionalProfile.getPhoneNumber()));
		professionalProfile.setSpecialization(trim(professionalProfile.getSpecialization()));
		professionalProfile.setServiceAreas(trimToNull(professionalProfile.getServiceAreas()));
		professionalProfile.setDescription(trimToNull(professionalProfile.getDescription()));
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
