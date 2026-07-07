package com.abhista.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePortfolioRequest(

		@NotBlank(message = "Title is required")
		@Size(max = 150, message = "Title must not exceed 150 characters")
		String title,

		@NotBlank(message = "Description is required")
		@Size(max = 1000, message = "Description must not exceed 1000 characters")
		String description,

		@NotBlank(message = "Project type is required")
		@Size(max = 100, message = "Project type must not exceed 100 characters")
		String projectType,

		@Size(max = 500, message = "Image URL must not exceed 500 characters")
		String imageUrl
) {
}
