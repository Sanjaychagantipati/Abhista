package com.abhista.requirement.repository;

import com.abhista.requirement.entity.Requirement;
import com.abhista.requirement.enums.RequirementStatus;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {

	@EntityGraph(attributePaths = "customer")
	List<Requirement> findByCustomerId(Long customerId);

	@EntityGraph(attributePaths = "customer")
	List<Requirement> findByStatus(RequirementStatus status);

	@EntityGraph(attributePaths = "customer")
	List<Requirement> findByCustomerIdAndStatus(Long customerId, RequirementStatus status);

	long countByStatus(RequirementStatus status);

	List<Requirement> findByStatusOrderByCreatedAtDesc(RequirementStatus status);
}
