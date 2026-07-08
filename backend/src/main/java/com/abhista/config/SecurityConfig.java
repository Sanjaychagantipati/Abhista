package com.abhista.config;

import com.abhista.auth.security.JwtAuthenticationFilter;
import com.abhista.authorization.RestAccessDeniedHandler;
import com.abhista.common.ApiResponse;
import com.abhista.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final RestAccessDeniedHandler restAccessDeniedHandler;
	private final UserService userService;
	private final ObjectMapper objectMapper;

	// Injected as a bean — avoids calling passwordEncoder() as a plain Java method
	private final PasswordEncoder passwordEncoder;

	public SecurityConfig(
			JwtAuthenticationFilter jwtAuthenticationFilter,
			RestAccessDeniedHandler restAccessDeniedHandler,
			UserService userService,
			ObjectMapper objectMapper,
			PasswordEncoder passwordEncoder
	) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.restAccessDeniedHandler = restAccessDeniedHandler;
		this.userService = userService;
		this.objectMapper = objectMapper;
		this.passwordEncoder = passwordEncoder;
	}

	@Value("${app.cors.allowed-origins:http://localhost:5173}")
	private String allowedOriginsConfig;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint((request, response, exception) -> {
					response.setStatus(401);
					response.setContentType(MediaType.APPLICATION_JSON_VALUE);
					objectMapper.writeValue(response.getWriter(), ApiResponse.failure("Unauthorized", null));
				}).accessDeniedHandler(restAccessDeniedHandler))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/categories", "/api/portfolio/**", "/api/search/**").permitAll()
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/customer/profile", "/api/customer/profile/**").hasRole("CUSTOMER")
						.requestMatchers("/api/professional/profile", "/api/professional/profile/**").hasRole("PROFESSIONAL")
						.requestMatchers("/api/consultant/profile", "/api/consultant/profile/**").hasRole("CONSULTANT")
						.requestMatchers(HttpMethod.POST, "/api/portfolio").hasAnyRole("PROFESSIONAL", "CONSULTANT")
						.requestMatchers(HttpMethod.DELETE, "/api/portfolio/**").hasAnyRole("PROFESSIONAL", "CONSULTANT")
						.requestMatchers(HttpMethod.POST, "/api/bookings").hasRole("CUSTOMER")
						.requestMatchers(HttpMethod.POST, "/api/consultations").hasRole("CUSTOMER")
						.requestMatchers(HttpMethod.POST, "/api/subscriptions/purchase").hasRole("CUSTOMER")
						.requestMatchers("/api/bookings", "/api/bookings/**").hasAnyRole("CUSTOMER", "PROFESSIONAL", "ADMIN")
						.requestMatchers("/api/consultations", "/api/consultations/**").hasAnyRole("CUSTOMER", "CONSULTANT", "ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/reviews/**").hasRole("CUSTOMER")
						.requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyRole("CUSTOMER", "ADMIN")
						.anyRequest().authenticated()
				)
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userService);
		// Use the injected singleton bean — not a direct method call that might bypass CGLIB
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// Externalized — override CORS_ALLOWED_ORIGINS env var in production
		List<String> origins = Arrays.asList(allowedOriginsConfig.split(","));
		configuration.setAllowedOrigins(origins);
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		// Explicitly restrict to required headers only — avoid wildcard "*"
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(false);
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}

