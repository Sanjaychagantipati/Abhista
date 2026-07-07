package com.abhista.contractor.repository;

import com.abhista.contractor.entity.ContractorProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractorProfileRepository extends JpaRepository<ContractorProfile, Long> {

	@EntityGraph(attributePaths = "user")
	Optional<ContractorProfile> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}
