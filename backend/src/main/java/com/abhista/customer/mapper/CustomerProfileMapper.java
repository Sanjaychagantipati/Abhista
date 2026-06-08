package com.abhista.customer.mapper;

import com.abhista.customer.dto.CustomerProfileCreateRequest;
import com.abhista.customer.dto.CustomerProfileResponse;
import com.abhista.customer.dto.CustomerProfileUpdateRequest;
import com.abhista.customer.entity.CustomerProfile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CustomerProfileMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	CustomerProfile toEntity(CustomerProfileCreateRequest request);

	@Mapping(target = "userId", source = "user.id")
	CustomerProfileResponse toResponse(CustomerProfile customerProfile);

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateEntity(CustomerProfileUpdateRequest request, @MappingTarget CustomerProfile customerProfile);
}
