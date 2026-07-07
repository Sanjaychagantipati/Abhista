package com.abhista.authorization;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("ownershipService")
@RequiredArgsConstructor
public class OwnershipService {

	private final JdbcTemplate jdbcTemplate;

	@Transactional(readOnly = true)
	public boolean isRequirementOwner(Long requirementId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from requirement
							where id = ? and customer_id = ?
						)
						""", requirementId, SecurityUtils.getCurrentUserId());
	}

	@Transactional(readOnly = true)
	public boolean isProjectCustomer(Long projectId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from project
							where id = ? and customer_id = ?
						)
						""", projectId, SecurityUtils.getCurrentUserId());
	}

	@Transactional(readOnly = true)
	public boolean isAssignedContractor(Long projectId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from project
							where id = ? and contractor_id = ?
						)
						""", projectId, SecurityUtils.getCurrentUserId());
	}

	@Transactional(readOnly = true)
	public boolean isAssignedArchitect(Long projectId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from project
							where id = ? and architect_id = ?
						)
						""", projectId, SecurityUtils.getCurrentUserId());
	}

	@Transactional(readOnly = true)
	public boolean isAssignedWorker(Long taskId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from task
							where id = ? and assigned_worker_id = ?
						)
						""", taskId, SecurityUtils.getCurrentUserId());
	}

	@Transactional(readOnly = true)
	public boolean isReviewOwner(Long reviewId) {
		return SecurityUtils.isAdmin()
				|| exists("""
						select exists(
							select 1 from review
							where id = ? and customer_id = ?
						)
						""", reviewId, SecurityUtils.getCurrentUserId());
	}

	/**
	 * Checks project access using a single SQL query instead of 3 serial round-trips.
	 * Previously: isProjectCustomer() || isAssignedContractor() || isAssignedArchitect()
	 * = up to 3 DB calls. Now: 1 DB call with an OR condition.
	 */
	@Transactional(readOnly = true)
	public boolean canAccessProject(Long projectId) {
		if (SecurityUtils.isAdmin()) {
			return true;
		}
		Long currentUserId = SecurityUtils.getCurrentUserId();
		if (projectId == null || currentUserId == null) {
			return false;
		}
		Boolean result = jdbcTemplate.queryForObject("""
				select exists(
					select 1 from project
					where id = ?
					  and (customer_id = ? or contractor_id = ? or architect_id = ?)
				)
				""", Boolean.class, projectId, currentUserId, currentUserId, currentUserId);
		return Objects.equals(result, Boolean.TRUE);
	}

	private boolean exists(String sql, Long resourceId, Long userId) {
		if (resourceId == null || userId == null) {
			return false;
		}
		Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class, resourceId, userId);
		return Objects.equals(result, Boolean.TRUE);
	}
}
