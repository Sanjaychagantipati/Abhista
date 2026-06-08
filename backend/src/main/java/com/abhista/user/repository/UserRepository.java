package com.abhista.user.repository;

import com.abhista.user.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	@EntityGraph(attributePaths = "role")
	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);
}
