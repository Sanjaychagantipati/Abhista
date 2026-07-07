package com.abhista.contractor.exception;

import com.abhista.exception.ValidationException;

public class ContractorProfileAlreadyExistsException extends ValidationException {

	public ContractorProfileAlreadyExistsException(String message) {
		super(message);
	}
}
