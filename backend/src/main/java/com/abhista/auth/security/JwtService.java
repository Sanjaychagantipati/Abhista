package com.abhista.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Value("${app.jwt.expiration-ms}")
	private long jwtExpirationMs;

	// Cached after first use — avoids re-deriving the HMAC key on every request
	private volatile SecretKey signingKey;

	public String generateToken(UserDetails userDetails) {
		Date now = new Date();
		Date expiresAt = new Date(now.getTime() + jwtExpirationMs);

		return Jwts.builder()
				.subject(userDetails.getUsername())
				.claim("authorities", extractAuthorities(userDetails))
				.issuedAt(now)
				.expiration(expiresAt)
				.signWith(getSigningKey())
				.compact();
	}

	/**
	 * Validates token in a single parse — previously this parsed the JWT twice
	 * (once for extractUsername, once for isTokenExpired), paying for two HMAC
	 * signature verifications per request.
	 */
	public boolean validateToken(String token, UserDetails userDetails) {
		Claims claims = extractAllClaims(token);
		String username = claims.getSubject();
		boolean notExpired = !claims.getExpiration().before(new Date());
		return username != null && username.equals(userDetails.getUsername()) && notExpired;
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey getSigningKey() {
		if (signingKey == null) {
			synchronized (this) {
				if (signingKey == null) {
					signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
				}
			}
		}
		return signingKey;
	}

	private List<String> extractAuthorities(UserDetails userDetails) {
		return userDetails.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.toList();
	}
}
