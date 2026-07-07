package com.abhista.requirement.mapper;

import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;
import com.abhista.requirement.dto.RequirementResponse;
import com.abhista.requirement.entity.Requirement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RequirementMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "customer", ignore = true)
	@Mapping(target = "status", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	Requirement toEntity(CreateRequirementRequest request);

	@Mapping(target = "message", constant = "Requirement Created Successfully")
	RequirementCreateResponse toCreateResponse(Requirement requirement);

	@Mapping(target = "customerId", source = "customer.id")
	RequirementResponse toResponse(Requirement requirement);
}
