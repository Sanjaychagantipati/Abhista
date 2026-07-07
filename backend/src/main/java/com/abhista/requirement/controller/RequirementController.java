package com.abhista.requirement.controller;

import com.abhista.common.ApiResponse;
import com.abhista.requirement.dto.CreateRequirementRequest;
import com.abhista.requirement.dto.RequirementCreateResponse;
import com.abhista.requirement.dto.RequirementResponse;
import com.abhista.requirement.service.RequirementService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requirements")
@RequiredArgsConstructor
public class RequirementController {

	private final RequirementService requirementService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('CUSTOMER')")
	public RequirementCreateResponse createRequirement(@Valid @RequestBody CreateRequirementRequest request) {
		return requirementService.createRequirement(request);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ApiResponse<List<RequirementResponse>> getMyRequirements() {
		return ApiResponse.success("Requirements retrieved successfully", requirementService.getMyRequirements());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ApiResponse<RequirementResponse> getRequirementById(@PathVariable Long id) {
		return ApiResponse.success("Requirement retrieved successfully", requirementService.getRequirementById(id));
	}
}
