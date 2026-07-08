package com.abhista.portfolio.entity;

import com.abhista.professional.entity.ProfessionalProfile;
import com.abhista.consultant.entity.ConsultantProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "portfolios")
@EntityListeners(AuditingEntityListener.class)
public class Portfolio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "professional_id")
	private ProfessionalProfile professional;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "consultant_id")
	private ConsultantProfile consultant;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "description", nullable = false, length = 1000)
	private String description;

	@Column(name = "project_type", nullable = false, length = 100)
	private String projectType;

	@Column(name = "image_url", length = 500)
	private String imageUrl;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private Instant updatedAt;
}
