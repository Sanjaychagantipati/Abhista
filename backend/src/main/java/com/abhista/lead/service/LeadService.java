package com.abhista.lead.service;

import com.abhista.lead.dto.LeadResponse;
import java.util.List;

public interface LeadService {

	List<LeadResponse> getOpenLeads();
}
