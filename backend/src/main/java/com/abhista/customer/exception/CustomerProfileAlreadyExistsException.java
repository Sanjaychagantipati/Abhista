package com.abhista.customer.exception;

import com.abhista.exception.ValidationException;

public class CustomerProfileAlreadyExistsException extends ValidationException {

	public CustomerProfileAlreadyExistsException(String message) {
		super(message);
	}
}
