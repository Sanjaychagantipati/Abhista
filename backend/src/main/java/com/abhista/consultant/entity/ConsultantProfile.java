package com.abhista.consultant.entity;

import com.abhista.professional.enums.VerificationStatus;
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
		name = "consultant_profiles",
		uniqueConstraints = @UniqueConstraint(name = "uk_consultant_profiles_user_id", columnNames = "user_id")
)
@EntityListeners(AuditingEntityListener.class)
public class ConsultantProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "specialization", nullable = false, length = 150)
	private String specialization;

	@Column(name = "experience_years", nullable = false)
	private Integer experienceYears;

	@Column(name = "bio", length = 2000)
	private String bio;

	@Column(name = "consultation_fee", nullable = false)
	private Double consultationFee;

	@Builder.Default
	@Column(name = "rating_average", nullable = false)
	private Double ratingAverage = 0.0;

	@Builder.Default
	@Column(name = "total_consultations", nullable = false)
	private Integer totalConsultations = 0;

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
