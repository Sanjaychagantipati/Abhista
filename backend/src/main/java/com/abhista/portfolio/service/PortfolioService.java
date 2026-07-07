package com.abhista.portfolio.service;

import com.abhista.portfolio.dto.CreatePortfolioRequest;
import com.abhista.portfolio.dto.PortfolioResponse;
import java.util.List;

public interface PortfolioService {

	PortfolioResponse addPortfolio(CreatePortfolioRequest request);

	List<PortfolioResponse> getMyPortfolio();

	void deletePortfolio(Long id);
}
