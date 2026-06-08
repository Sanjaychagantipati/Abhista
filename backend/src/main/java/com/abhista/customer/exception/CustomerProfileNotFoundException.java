package com.abhista.customer.exception;

import com.abhista.exception.ResourceNotFoundException;

public class CustomerProfileNotFoundException extends ResourceNotFoundException {

	public CustomerProfileNotFoundException(String message) {
		super(message);
	}
}
