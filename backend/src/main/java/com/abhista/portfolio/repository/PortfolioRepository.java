package com.abhista.portfolio.repository;

import com.abhista.portfolio.entity.Portfolio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

	List<Portfolio> findByProfessionalId(Long professionalId);

	List<Portfolio> findByConsultantId(Long consultantId);

	Optional<Portfolio> findByIdAndProfessionalId(Long id, Long professionalId);

	Optional<Portfolio> findByIdAndConsultantId(Long id, Long consultantId);
}
