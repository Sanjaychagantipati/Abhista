package com.abhista.customer.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.customer.dto.CustomerProfileCreateRequest;
import com.abhista.customer.dto.CustomerProfileResponse;
import com.abhista.customer.dto.CustomerProfileUpdateRequest;
import com.abhista.customer.entity.CustomerProfile;
import com.abhista.customer.exception.CustomerProfileAlreadyExistsException;
import com.abhista.customer.exception.CustomerProfileNotFoundException;
import com.abhista.customer.mapper.CustomerProfileMapper;
import com.abhista.customer.repository.CustomerProfileRepository;
import com.abhista.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerProfileServiceImpl implements CustomerProfileService {

	private final CustomerProfileRepository customerProfileRepository;
	private final CustomerProfileMapper customerProfileMapper;

	@Override
	@Transactional
	@PreAuthorize("hasRole('CUSTOMER')")
	public CustomerProfileResponse createProfile(CustomerProfileCreateRequest request) {
		User currentUser = SecurityUtils.getCurrentUser();

		if (customerProfileRepository.existsByUserId(currentUser.getId())) {
			throw new CustomerProfileAlreadyExistsException("Customer profile already exists");
		}

		CustomerProfile customerProfile = customerProfileMapper.toEntity(request);
		customerProfile.setUser(currentUser);
		normalize(customerProfile);

		CustomerProfile savedProfile = customerProfileRepository.save(customerProfile);
		return customerProfileMapper.toResponse(savedProfile);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CUSTOMER')")
	public CustomerProfileResponse getMyProfile() {
		CustomerProfile customerProfile = findCurrentUserProfile();
		return customerProfileMapper.toResponse(customerProfile);
	}

	@Override
	@Transactional
	@PreAuthorize("hasRole('CUSTOMER')")
	public CustomerProfileResponse updateProfile(CustomerProfileUpdateRequest request) {
		CustomerProfile customerProfile = findCurrentUserProfile();
		customerProfileMapper.updateEntity(request, customerProfile);
		normalize(customerProfile);

		CustomerProfile savedProfile = customerProfileRepository.save(customerProfile);
		return customerProfileMapper.toResponse(savedProfile);
	}

	private CustomerProfile findCurrentUserProfile() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		return customerProfileRepository.findByUserId(currentUserId)
				.orElseThrow(() -> new CustomerProfileNotFoundException("Customer profile not found"));
	}

	private void normalize(CustomerProfile customerProfile) {
		customerProfile.setFullName(trim(customerProfile.getFullName()));
		customerProfile.setPhoneNumber(trim(customerProfile.getPhoneNumber()));
		customerProfile.setAddress(trimToNull(customerProfile.getAddress()));
		customerProfile.setCity(trim(customerProfile.getCity()));
		customerProfile.setState(trim(customerProfile.getState()));
		customerProfile.setPincode(trim(customerProfile.getPincode()));
		customerProfile.setProfileImageUrl(trimToNull(customerProfile.getProfileImageUrl()));
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
