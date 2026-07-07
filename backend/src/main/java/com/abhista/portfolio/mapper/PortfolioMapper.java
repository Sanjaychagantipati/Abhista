package com.abhista.portfolio.mapper;

import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import com.abhista.portfolio.entity.Portfolio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PortfolioMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "contractor", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	Portfolio toEntity(CreatePortfolioRequest request);

	@Mapping(target = "contractorId", source = "contractor.id")
	PortfolioResponse toResponse(Portfolio portfolio);
}
