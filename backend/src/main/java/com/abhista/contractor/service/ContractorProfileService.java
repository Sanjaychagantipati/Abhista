package com.abhista.contractor.service;

import com.abhista.contractor.dto.ContractorProfileCreateRequest;
import com.abhista.contractor.dto.ContractorProfileResponse;
import com.abhista.contractor.dto.ContractorProfileUpdateRequest;

public interface ContractorProfileService {

	ContractorProfileResponse createProfile(ContractorProfileCreateRequest request);

	ContractorProfileResponse getMyProfile();

	ContractorProfileResponse updateProfile(ContractorProfileUpdateRequest request);
}
