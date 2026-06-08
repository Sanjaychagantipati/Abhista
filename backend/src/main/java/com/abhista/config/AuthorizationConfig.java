package com.abhista.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class AuthorizationConfig {

	@Bean
	static MethodSecurityExpressionHandler methodSecurityExpressionHandler(
			RoleHierarchy roleHierarchy,
			PermissionEvaluator permissionEvaluator
	) {
		DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler();
		handler.setRoleHierarchy(roleHierarchy);
		handler.setPermissionEvaluator(permissionEvaluator);
		return handler;
	}
}
