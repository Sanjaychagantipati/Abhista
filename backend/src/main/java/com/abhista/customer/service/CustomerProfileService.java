package com.abhista.customer.service;

import com.abhista.customer.dto.CustomerProfileCreateRequest;
import com.abhista.customer.dto.CustomerProfileResponse;
import com.abhista.customer.dto.CustomerProfileUpdateRequest;

public interface CustomerProfileService {

	CustomerProfileResponse createProfile(CustomerProfileCreateRequest request);

	CustomerProfileResponse getMyProfile();

	CustomerProfileResponse updateProfile(CustomerProfileUpdateRequest request);
}
