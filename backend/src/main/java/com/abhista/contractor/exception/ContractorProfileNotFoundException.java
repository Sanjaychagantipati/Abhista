package com.abhista.contractor.exception;

import com.abhista.exception.ResourceNotFoundException;

public class ContractorProfileNotFoundException extends ResourceNotFoundException {

	public ContractorProfileNotFoundException(String message) {
		super(message);
	}
}
