package com.abhista.portfolio.controller;

import com.abhista.common.ApiResponse;
import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import com.abhista.portfolio.service.PortfolioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@PreAuthorize("hasRole('CONTRACTOR')")
public class PortfolioController {

	private final PortfolioService portfolioService;

	public PortfolioController(PortfolioService portfolioService) {
		this.portfolioService = portfolioService;
	}

	@PostMapping
	public ApiResponse<PortfolioResponse> addPortfolio(
			@Valid @RequestBody CreatePortfolioRequest request
	) {
		PortfolioResponse response = portfolioService.addPortfolio(request);
		return ApiResponse.success("Portfolio item added successfully", response);
	}

	@GetMapping
	public ApiResponse<List<PortfolioResponse>> getMyPortfolio() {
		List<PortfolioResponse> response = portfolioService.getMyPortfolio();
		return ApiResponse.success("Portfolio retrieved successfully", response);
	}

	@DeleteMapping("/{id}")
	public ApiResponse<Void> deletePortfolio(@PathVariable Long id) {
		portfolioService.deletePortfolio(id);
		return ApiResponse.success("Portfolio item deleted successfully", null);
	}
}
