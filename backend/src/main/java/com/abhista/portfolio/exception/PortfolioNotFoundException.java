package com.abhista.portfolio.exception;

import com.abhista.exception.ResourceNotFoundException;

public class PortfolioNotFoundException extends ResourceNotFoundException {

	public PortfolioNotFoundException(String message) {
		super(message);
	}
}
