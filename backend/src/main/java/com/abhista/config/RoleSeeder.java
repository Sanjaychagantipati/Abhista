package com.abhista.config;

import com.abhista.auth.Role;
import com.abhista.auth.repository.RoleRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class RoleSeeder implements CommandLineRunner {

	private final RoleRepository roleRepository;

	public RoleSeeder(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		Map<String, String> roles = Map.of(
				"ROLE_CUSTOMER", "Customer account for homeowners and service seekers",
				"ROLE_CONTRACTOR", "Contractor account for project execution and worker coordination",
				"ROLE_WORKER", "Worker account for assigned task execution",
				"ROLE_ARCHITECT", "Architect account for design and consultation workflows",
				"ROLE_ADMIN", "Administrator account for platform operations"
		);

		roles.forEach((roleName, description) -> {
			if (!roleRepository.existsByRoleName(roleName)) {
				roleRepository.save(Role.builder()
						.roleName(roleName)
						.description(description)
						.build());
			}
		});
	}
}
