package com.abhista.professional.mapper;

import com.abhista.professional.dto.ProfessionalProfileCreateRequest;
import com.abhista.professional.dto.ProfessionalProfileResponse;
import com.abhista.professional.dto.ProfessionalProfileUpdateRequest;
import com.abhista.professional.entity.ProfessionalProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfessionalProfileMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "verificationStatus", ignore = true)
	@Mapping(target = "isFeatured", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	ProfessionalProfile toEntity(ProfessionalProfileCreateRequest request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "verificationStatus", ignore = true)
	@Mapping(target = "isFeatured", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateEntityFromRequest(ProfessionalProfileUpdateRequest request, @MappingTarget ProfessionalProfile entity);

	ProfessionalProfileResponse toResponse(ProfessionalProfile entity);
}
