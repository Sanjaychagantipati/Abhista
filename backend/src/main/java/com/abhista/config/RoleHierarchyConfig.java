package com.abhista.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;

@Configuration
public class RoleHierarchyConfig {

	@Bean
	public RoleHierarchy roleHierarchy() {
		return RoleHierarchyImpl.fromHierarchy("""
				ROLE_ADMIN > ROLE_CUSTOMER
				ROLE_ADMIN > ROLE_CONTRACTOR
				ROLE_ADMIN > ROLE_ARCHITECT
				ROLE_CONTRACTOR > ROLE_WORKER
				""");
	}
}
