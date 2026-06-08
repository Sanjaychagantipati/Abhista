package com.abhista.customer.repository;

import com.abhista.customer.entity.CustomerProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {

	@EntityGraph(attributePaths = "user")
	Optional<CustomerProfile> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}
