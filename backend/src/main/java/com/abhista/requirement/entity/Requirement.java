package com.abhista.requirement.entity;

import com.abhista.requirement.enums.RequirementStatus;
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
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
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
		name = "requirement",
		indexes = {
				@Index(name = "idx_requirement_customer_id", columnList = "customer_id"),
				@Index(name = "idx_requirement_status", columnList = "status"),
				@Index(name = "idx_requirement_customer_status", columnList = "customer_id,status")
		}
)
@EntityListeners(AuditingEntityListener.class)
public class Requirement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "customer_id", nullable = false)
	private User customer;

	@NotBlank(message = "Title is required")
	@Size(max = 150, message = "Title must not exceed 150 characters")
	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@NotBlank(message = "Description is required")
	@Size(max = 2000, message = "Description must not exceed 2000 characters")
	@Column(name = "description", nullable = false, length = 2000)
	private String description;

	@NotBlank(message = "Service category is required")
	@Size(max = 120, message = "Service category must not exceed 120 characters")
	@Column(name = "service_category", nullable = false, length = 120)
	private String serviceCategory;

	@NotBlank(message = "Location is required")
	@Size(max = 255, message = "Location must not exceed 255 characters")
	@Column(name = "location", nullable = false, length = 255)
	private String location;

	@NotNull(message = "Minimum budget is required")
	@DecimalMin(value = "0.00", message = "Minimum budget must be greater than or equal to 0")
	@Column(name = "budget_min", nullable = false, precision = 14, scale = 2)
	private BigDecimal budgetMin;

	@NotNull(message = "Maximum budget is required")
	@DecimalMin(value = "0.00", message = "Maximum budget must be greater than or equal to 0")
	@Column(name = "budget_max", nullable = false, precision = 14, scale = 2)
	private BigDecimal budgetMax;

	@Column(name = "preferred_start_date")
	private LocalDate preferredStartDate;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 40)
	private RequirementStatus status = RequirementStatus.OPEN;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private Instant updatedAt;

	@AssertTrue(message = "Maximum budget must be greater than or equal to minimum budget")
	public boolean isBudgetRangeValid() {
		if (budgetMin == null || budgetMax == null) {
			return true;
		}
		return budgetMax.compareTo(budgetMin) >= 0;
	}
}
