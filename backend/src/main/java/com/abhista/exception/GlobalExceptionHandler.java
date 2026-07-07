package com.abhista.exception;

import com.abhista.common.ApiResponse;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException exception) {
		return error(HttpStatus.NOT_FOUND, exception.getMessage());
	}

	@ExceptionHandler({UnauthorizedException.class, BadCredentialsException.class})
	public ResponseEntity<ApiResponse<Void>> handleUnauthorized(RuntimeException exception) {
		return error(HttpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidation(ValidationException exception) {
		return error(HttpStatus.BAD_REQUEST, exception.getMessage());
	}

	@ExceptionHandler(AuthorizationException.class)
	public ResponseEntity<ApiResponse<Void>> handleAuthorization(AuthorizationException exception) {
		return error(HttpStatus.FORBIDDEN, exception.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Map<String, String>>> handleMethodArgumentNotValid(
			MethodArgumentNotValidException exception
	) {
		Map<String, String> errors = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

		return ResponseEntity.badRequest()
				.body(ApiResponse.failure("Validation failed", errors));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
		return error(HttpStatus.CONFLICT, "Request conflicts with existing data");
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException exception) {
		return error(HttpStatus.FORBIDDEN, "Access denied");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception exception) {
		exception.printStackTrace();
		return error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}

	private ResponseEntity<ApiResponse<Void>> error(HttpStatus status, String message) {
		return ResponseEntity.status(status)
				.body(ApiResponse.failure(message, null));
	}
}
