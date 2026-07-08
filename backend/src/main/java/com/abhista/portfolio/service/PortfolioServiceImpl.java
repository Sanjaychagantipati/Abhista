package com.abhista.portfolio.service;

import com.abhista.authorization.SecurityUtils;
import com.abhista.professional.entity.ProfessionalProfile;
import com.abhista.professional.exception.ProfessionalProfileNotFoundException;
import com.abhista.professional.repository.ProfessionalProfileRepository;
import com.abhista.consultant.entity.ConsultantProfile;
import com.abhista.consultant.exception.ConsultantProfileNotFoundException;
import com.abhista.consultant.repository.ConsultantProfileRepository;
import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import com.abhista.portfolio.entity.Portfolio;
import com.abhista.portfolio.exception.PortfolioNotFoundException;
import com.abhista.portfolio.mapper.PortfolioMapper;
import com.abhista.portfolio.repository.PortfolioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

	private final PortfolioRepository portfolioRepository;
	private final ProfessionalProfileRepository professionalProfileRepository;
	private final ConsultantProfileRepository consultantProfileRepository;
	private final PortfolioMapper portfolioMapper;

	@Override
	@Transactional
	@PreAuthorize("hasAnyRole('PROFESSIONAL', 'CONSULTANT')")
	public PortfolioResponse addPortfolio(CreatePortfolioRequest request) {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		Portfolio portfolio = portfolioMapper.toEntity(request);

		if (SecurityUtils.hasRole("PROFESSIONAL")) {
			ProfessionalProfile professionalProfile = professionalProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ProfessionalProfileNotFoundException("Professional profile not found"));
			portfolio.setProfessional(professionalProfile);
		} else if (SecurityUtils.hasRole("CONSULTANT")) {
			ConsultantProfile consultantProfile = consultantProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ConsultantProfileNotFoundException("Consultant profile not found"));
			portfolio.setConsultant(consultantProfile);
		}

		Portfolio savedPortfolio = portfolioRepository.save(portfolio);
		return portfolioMapper.toResponse(savedPortfolio);
	}

	@Override
	@Transactional(readOnly = true)
	@PreAuthorize("hasAnyRole('PROFESSIONAL', 'CONSULTANT')")
	public List<PortfolioResponse> getMyPortfolio() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		List<Portfolio> portfolios;

		if (SecurityUtils.hasRole("PROFESSIONAL")) {
			ProfessionalProfile professionalProfile = professionalProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ProfessionalProfileNotFoundException("Professional profile not found"));
			portfolios = portfolioRepository.findByProfessionalId(professionalProfile.getId());
		} else {
			ConsultantProfile consultantProfile = consultantProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ConsultantProfileNotFoundException("Consultant profile not found"));
			portfolios = portfolioRepository.findByConsultantId(consultantProfile.getId());
		}

		return portfolios.stream()
				.map(portfolioMapper::toResponse)
				.toList();
	}

	@Override
	@Transactional
	@PreAuthorize("hasAnyRole('PROFESSIONAL', 'CONSULTANT')")
	public void deletePortfolio(Long id) {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		Portfolio portfolio;

		if (SecurityUtils.hasRole("PROFESSIONAL")) {
			ProfessionalProfile professionalProfile = professionalProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ProfessionalProfileNotFoundException("Professional profile not found"));
			portfolio = portfolioRepository.findByIdAndProfessionalId(id, professionalProfile.getId())
					.orElseThrow(() -> new PortfolioNotFoundException("Portfolio item not found or does not belong to you"));
		} else {
			ConsultantProfile consultantProfile = consultantProfileRepository.findByUserId(currentUserId)
					.orElseThrow(() -> new ConsultantProfileNotFoundException("Consultant profile not found"));
			portfolio = portfolioRepository.findByIdAndConsultantId(id, consultantProfile.getId())
					.orElseThrow(() -> new PortfolioNotFoundException("Portfolio item not found or does not belong to you"));
		}

		portfolioRepository.delete(portfolio);
	}
}
