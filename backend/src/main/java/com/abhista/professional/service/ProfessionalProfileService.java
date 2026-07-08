package com.abhista.professional.service;

import com.abhista.professional.dto.ProfessionalProfileCreateRequest;
import com.abhista.professional.dto.ProfessionalProfileResponse;
import com.abhista.professional.dto.ProfessionalProfileUpdateRequest;

public interface ProfessionalProfileService {

	ProfessionalProfileResponse createProfile(ProfessionalProfileCreateRequest request);

	ProfessionalProfileResponse getMyProfile();

	ProfessionalProfileResponse updateProfile(ProfessionalProfileUpdateRequest request);
}
