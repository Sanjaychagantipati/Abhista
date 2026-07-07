package com.abhista.portfolio.repository;

import com.abhista.portfolio.entity.Portfolio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

	List<Portfolio> findByContractorId(Long contractorId);

	Optional<Portfolio> findByIdAndContractorId(Long id, Long contractorId);
}
