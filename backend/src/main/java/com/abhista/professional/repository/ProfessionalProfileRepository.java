package com.abhista.professional.repository;

import com.abhista.professional.entity.ProfessionalProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessionalProfileRepository extends JpaRepository<ProfessionalProfile, Long> {

	Optional<ProfessionalProfile> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}
