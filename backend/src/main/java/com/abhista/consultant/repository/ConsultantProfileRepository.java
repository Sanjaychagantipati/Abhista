package com.abhista.consultant.repository;

import com.abhista.consultant.entity.ConsultantProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultantProfileRepository extends JpaRepository<ConsultantProfile, Long> {

	Optional<ConsultantProfile> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}
