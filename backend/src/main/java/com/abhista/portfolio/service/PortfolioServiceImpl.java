package com.abhista.portfolio.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.contractor.entity.ContractorProfile;
import com.abhista.contractor.exception.ContractorProfileNotFoundException;
import com.abhista.contractor.repository.ContractorProfileRepository;
import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import com.abhista.portfolio.entity.Portfolio;
import com.abhista.portfolio.exception.PortfolioNotFoundException;
import com.abhista.portfolio.mapper.PortfolioMapper;
import com.abhista.portfolio.repository.PortfolioRepository;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortfolioServiceImpl implements PortfolioService {

	private final PortfolioRepository portfolioRepository;
	private final ContractorProfileRepository contractorProfileRepository;
	private final PortfolioMapper portfolioMapper;

	public PortfolioServiceImpl(
			PortfolioRepository portfolioRepository,
			ContractorProfileRepository contractorProfileRepository,
			PortfolioMapper portfolioMapper
	) {
		this.portfolioRepository = portfolioRepository;
		this.contractorProfileRepository = contractorProfileRepository;
		this.portfolioMapper = portfolioMapper;
	}

	@Override
	@Transactional
	@PreAuthorize("hasRole('CONTRACTOR')")
	public PortfolioResponse addPortfolio(CreatePortfolioRequest request) {
		ContractorProfile contractorProfile = findCurrentUserProfile();

		Portfolio portfolio = portfolioMapper.toEntity(request);
		portfolio.setContractor(contractorProfile);

		Portfolio savedPortfolio = portfolioRepository.save(portfolio);
		return portfolioMapper.toResponse(savedPortfolio);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasRole('CONTRACTOR')")
	public List<PortfolioResponse> getMyPortfolio() {
		ContractorProfile contractorProfile = findCurrentUserProfile();

		return portfolioRepository.findByContractorId(contractorProfile.getId())
				.stream()
				.map(portfolioMapper::toResponse)
				.toList();
	}

	@Override
	@Transactional
	@PreAuthorize("hasRole('CONTRACTOR')")
	public void deletePortfolio(Long id) {
		ContractorProfile contractorProfile = findCurrentUserProfile();

		Portfolio portfolio = portfolioRepository.findByIdAndContractorId(id, contractorProfile.getId())
				.orElseThrow(() -> new PortfolioNotFoundException("Portfolio item not found or does not belong to this contractor"));

		portfolioRepository.delete(portfolio);
	}

	private ContractorProfile findCurrentUserProfile() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		return contractorProfileRepository.findByUserId(currentUserId)
				.orElseThrow(() -> new ContractorProfileNotFoundException("Contractor profile not found"));
	}
}
