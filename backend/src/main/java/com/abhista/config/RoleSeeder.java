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
				"ROLE_CUSTOMER", "Customer account for service seekers and subscription purchasers",
				"ROLE_PROFESSIONAL", "Professional account for blue-collar and white-collar service providers",
				"ROLE_CONSULTANT", "Consultant account for experts offering guidance sessions",
				"ROLE_ADMIN", "Administrator account for platform operations and moderation"
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
