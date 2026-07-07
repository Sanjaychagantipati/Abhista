package com.abhista.lead.controller;

import com.abhista.common.ApiResponse;
import com.abhista.lead.dto.LeadResponse;
import com.abhista.lead.service.LeadService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leads")
@PreAuthorize("hasRole('CONTRACTOR')")
public class LeadController {

	private final LeadService leadService;

	public LeadController(LeadService leadService) {
		this.leadService = leadService;
	}

	@GetMapping
	public ApiResponse<List<LeadResponse>> getOpenLeads() {
		List<LeadResponse> response = leadService.getOpenLeads();
		return ApiResponse.success("Open leads retrieved successfully", response);
	}
}
