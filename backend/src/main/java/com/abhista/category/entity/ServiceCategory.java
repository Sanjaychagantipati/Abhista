package com.abhista.category.entity;

import com.abhista.category.enums.CategoryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
		name = "service_categories",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_service_categories_name", columnNames = "name"),
				@UniqueConstraint(name = "uk_service_categories_slug", columnNames = "slug")
		}
)
public class ServiceCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@Column(name = "slug", nullable = false, length = 100)
	private String slug;

	@Enumerated(EnumType.STRING)
	@Column(name = "category_type", nullable = false, length = 30)
	private CategoryType categoryType;

	@Column(name = "description", length = 500)
	private String description;

	@Column(name = "image_url", length = 500)
	private String imageUrl;

	@Column(name = "parent_id")
	private Long parentId;
}
