package com.abhista.contractor.entity;

import com.abhista.contractor.enums.VerificationStatus;
import com.abhista.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
		name = "contractor_profiles",
		uniqueConstraints = @UniqueConstraint(name = "uk_contractor_profiles_user_id", columnNames = "user_id")
)
@EntityListeners(AuditingEntityListener.class)
public class ContractorProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "company_name", nullable = false, length = 150)
	private String companyName;

	@Column(name = "owner_name", nullable = false, length = 150)
	private String ownerName;

	@Column(name = "phone_number", nullable = false, length = 30)
	private String phoneNumber;

	@Column(name = "experience_years", nullable = false)
	private Integer experienceYears;

	@Column(name = "specialization", nullable = false, length = 150)
	private String specialization;

	@Column(name = "service_areas", length = 500)
	private String serviceAreas;

	@Column(name = "description", length = 2000)
	private String description;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false, length = 30)
	private VerificationStatus verificationStatus = VerificationStatus.PENDING;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private Instant updatedAt;
}
