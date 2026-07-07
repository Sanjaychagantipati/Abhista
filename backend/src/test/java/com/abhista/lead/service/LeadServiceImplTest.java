package com.abhista.lead.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.abhista.lead.dto.LeadResponse;
import com.abhista.requirement.entity.Requirement;
import com.abhista.requirement.enums.RequirementStatus;
import com.abhista.requirement.repository.RequirementRepository;
import com.abhista.user.User;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeadServiceImplTest {

	@Mock
	private RequirementRepository requirementRepository;

	@InjectMocks
	private LeadServiceImpl leadService;

	@Test
	void getOpenLeads_Success() {
		// Arrange
		User customer = User.builder()
				.id(1L)
				.firstName("Jane")
				.lastName("Doe")
				.email("jane.doe@example.com")
				.phone("+1234567890")
				.build();

		Requirement req1 = Requirement.builder()
				.id(10L)
				.customer(customer)
				.title("2BHK Interior")
				.description("Need modular kitchen and wardrobes")
				.serviceCategory("Interior")
				.location("Hyderabad")
				.budgetMin(new BigDecimal("400000.00"))
				.budgetMax(new BigDecimal("600000.00"))
				.preferredStartDate(LocalDate.of(2026, 7, 1))
				.status(RequirementStatus.OPEN)
				.createdAt(Instant.now())
				.build();

		Requirement req2 = Requirement.builder()
				.id(11L)
				.customer(customer)
				.title("Bathroom Renovation")
				.description("Full bathroom remodeling")
				.serviceCategory("Renovation")
				.location("Bangalore")
				.budgetMin(new BigDecimal("100000.00"))
				.budgetMax(new BigDecimal("150000.00"))
				.preferredStartDate(LocalDate.of(2026, 7, 15))
				.status(RequirementStatus.OPEN)
				.createdAt(Instant.now().minusSeconds(3600))
				.build();

		when(requirementRepository.findByStatusOrderByCreatedAtDesc(RequirementStatus.OPEN))
				.thenReturn(List.of(req1, req2));

		// Act
		List<LeadResponse> leads = leadService.getOpenLeads();

		// Assert
		assertNotNull(leads);
		assertEquals(2, leads.size());

		LeadResponse firstLead = leads.get(0);
		assertEquals(10L, firstLead.id());
		assertEquals("2BHK Interior", firstLead.title());
		assertEquals("Need modular kitchen and wardrobes", firstLead.description());
		assertEquals("Interior", firstLead.serviceCategory());
		assertEquals("Hyderabad", firstLead.location());
		assertEquals(new BigDecimal("400000.00"), firstLead.budgetMin());
		assertEquals(new BigDecimal("600000.00"), firstLead.budgetMax());
		assertEquals(LocalDate.of(2026, 7, 1), firstLead.preferredStartDate());
		assertNotNull(firstLead.createdAt());

		LeadResponse secondLead = leads.get(1);
		assertEquals(11L, secondLead.id());
		assertEquals("Bathroom Renovation", secondLead.title());
		assertEquals("Full bathroom remodeling", secondLead.description());
		assertEquals("Renovation", secondLead.serviceCategory());
		assertEquals(LocalDate.of(2026, 7, 15), secondLead.preferredStartDate());

		verify(requirementRepository).findByStatusOrderByCreatedAtDesc(RequirementStatus.OPEN);
	}
}
