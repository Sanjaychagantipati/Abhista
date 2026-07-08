package com.abhista.portfolio.mapper;

import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import com.abhista.portfolio.entity.Portfolio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PortfolioMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "professional", ignore = true)
	@Mapping(target = "consultant", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	Portfolio toEntity(CreatePortfolioRequest request);

	@Mapping(target = "professionalId", source = "professional.id")
	@Mapping(target = "consultantId", source = "consultant.id")
	PortfolioResponse toResponse(Portfolio portfolio);
}
