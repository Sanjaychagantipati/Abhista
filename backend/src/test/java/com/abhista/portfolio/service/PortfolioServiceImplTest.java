package com.abhista.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

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
import com.abhista.user.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceImplTest {

	@Mock
	private PortfolioRepository portfolioRepository;

	@Mock
	private ContractorProfileRepository contractorProfileRepository;

	@Mock
	private PortfolioMapper portfolioMapper;

	@InjectMocks
	private PortfolioServiceImpl portfolioService;

	private MockedStatic<SecurityUtils> securityUtilsMock;

	@BeforeEach
	void setUp() {
		securityUtilsMock = mockStatic(SecurityUtils.class);
	}

	@AfterEach
	void tearDown() {
		securityUtilsMock.close();
	}

	@Test
	void addPortfolio_Success() {
		// Arrange
		Long userId = 1L;
		Long contractorId = 2L;
		User user = User.builder().id(userId).email("contractor@example.com").build();
		ContractorProfile profile = ContractorProfile.builder().id(contractorId).user(user).build();

		CreatePortfolioRequest request = new CreatePortfolioRequest("Title", "Desc", "Type", "http://image.url");
		Portfolio portfolio = Portfolio.builder().title("Title").description("Desc").projectType("Type").imageUrl("http://image.url").build();
		Portfolio savedPortfolio = Portfolio.builder().id(10L).contractor(profile).title("Title").description("Desc").projectType("Type").imageUrl("http://image.url").createdAt(Instant.now()).build();
		PortfolioResponse expectedResponse = new PortfolioResponse(10L, contractorId, "Title", "Desc", "Type", "http://image.url", Instant.now(), null);

		securityUtilsMock.when(SecurityUtils::getCurrentUserId).thenReturn(userId);
		when(contractorProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
		when(portfolioMapper.toEntity(request)).thenReturn(portfolio);
		when(portfolioRepository.save(portfolio)).thenReturn(savedPortfolio);
		when(portfolioMapper.toResponse(savedPortfolio)).thenReturn(expectedResponse);

		// Act
		PortfolioResponse actualResponse = portfolioService.addPortfolio(request);

		// Assert
		assertNotNull(actualResponse);
		assertEquals(expectedResponse, actualResponse);
		verify(portfolioRepository).save(portfolio);
	}

	@Test
	void addPortfolio_ProfileNotFound() {
		// Arrange
		Long userId = 1L;
		CreatePortfolioRequest request = new CreatePortfolioRequest("Title", "Desc", "Type", "http://image.url");

		securityUtilsMock.when(SecurityUtils::getCurrentUserId).thenReturn(userId);
		when(contractorProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(ContractorProfileNotFoundException.class, () -> portfolioService.addPortfolio(request));
		verifyNoInteractions(portfolioMapper, portfolioRepository);
	}

	@Test
	void getMyPortfolio_Success() {
		// Arrange
		Long userId = 1L;
		Long contractorId = 2L;
		ContractorProfile profile = ContractorProfile.builder().id(contractorId).build();
		Portfolio portfolio = Portfolio.builder().id(10L).contractor(profile).title("Title").build();
		PortfolioResponse response = new PortfolioResponse(10L, contractorId, "Title", "Desc", "Type", "http://image.url", Instant.now(), null);

		securityUtilsMock.when(SecurityUtils::getCurrentUserId).thenReturn(userId);
		when(contractorProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
		when(portfolioRepository.findByContractorId(contractorId)).thenReturn(List.of(portfolio));
		when(portfolioMapper.toResponse(portfolio)).thenReturn(response);

		// Act
		List<PortfolioResponse> result = portfolioService.getMyPortfolio();

		// Assert
		assertEquals(1, result.size());
		assertEquals(response, result.get(0));
	}

	@Test
	void deletePortfolio_Success() {
		// Arrange
		Long userId = 1L;
		Long contractorId = 2L;
		Long portfolioId = 10L;
		ContractorProfile profile = ContractorProfile.builder().id(contractorId).build();
		Portfolio portfolio = Portfolio.builder().id(portfolioId).contractor(profile).build();

		securityUtilsMock.when(SecurityUtils::getCurrentUserId).thenReturn(userId);
		when(contractorProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
		when(portfolioRepository.findByIdAndContractorId(portfolioId, contractorId)).thenReturn(Optional.of(portfolio));

		// Act
		portfolioService.deletePortfolio(portfolioId);

		// Assert
		verify(portfolioRepository).delete(portfolio);
	}

	@Test
	void deletePortfolio_NotFound() {
		// Arrange
		Long userId = 1L;
		Long contractorId = 2L;
		Long portfolioId = 10L;
		ContractorProfile profile = ContractorProfile.builder().id(contractorId).build();

		securityUtilsMock.when(SecurityUtils::getCurrentUserId).thenReturn(userId);
		when(contractorProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
		when(portfolioRepository.findByIdAndContractorId(portfolioId, contractorId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(PortfolioNotFoundException.class, () -> portfolioService.deletePortfolio(portfolioId));
		verify(portfolioRepository, never()).delete(any());
	}
}
