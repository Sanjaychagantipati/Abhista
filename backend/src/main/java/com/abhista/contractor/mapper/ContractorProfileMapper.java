package com.abhista.contractor.mapper;

import com.abhista.contractor.dto.ContractorProfileCreateRequest;
import com.abhista.contractor.dto.ContractorProfileResponse;
import com.abhista.contractor.dto.ContractorProfileUpdateRequest;
import com.abhista.contractor.entity.ContractorProfile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ContractorProfileMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "verificationStatus", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	ContractorProfile toEntity(ContractorProfileCreateRequest request);

	@Mapping(target = "userId", source = "user.id")
	ContractorProfileResponse toResponse(ContractorProfile contractorProfile);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "verificationStatus", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateEntity(ContractorProfileUpdateRequest request, @MappingTarget ContractorProfile contractorProfile);
}
