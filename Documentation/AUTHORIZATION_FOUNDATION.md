# Abhista Authorization Foundation

## Folder Structure

```text
backend/src/main/java/com/abhista
├── authorization
│   ├── AbhistaPermissionEvaluator.java
│   ├── CustomSecurityExpressions.java
│   ├── OwnershipService.java
│   ├── RestAccessDeniedHandler.java
│   └── SecurityUtils.java
├── config
│   ├── AuthorizationConfig.java
│   ├── RoleHierarchyConfig.java
│   └── SecurityConfig.java
└── exception
    └── AuthorizationException.java
```

## Authorization Architecture

Authorization is split into two layers:

1. URL-level guards in `SecurityConfig` protect broad endpoint families.
2. Method-level guards with `@PreAuthorize`, `@PostAuthorize`, ownership checks, and `hasPermission(...)` protect resource-specific operations.

Authentication remains unchanged. JWT validation still establishes the authenticated `User` in the `SecurityContext`; authorization now consumes that authenticated principal.

## Configuration Classes

`AuthorizationConfig` enables Spring Security method authorization with:

```java
@EnableMethodSecurity(prePostEnabled = true)
```

`RoleHierarchyConfig` defines:

```text
ROLE_ADMIN > ROLE_CUSTOMER
ROLE_ADMIN > ROLE_CONTRACTOR
ROLE_ADMIN > ROLE_ARCHITECT
ROLE_CONTRACTOR > ROLE_WORKER
```

The method security expression handler receives both the role hierarchy and the custom `PermissionEvaluator`.

## Ownership Services

`OwnershipService` provides these reusable methods:

```java
boolean isRequirementOwner(Long requirementId)
boolean isProjectCustomer(Long projectId)
boolean isAssignedContractor(Long projectId)
boolean isAssignedArchitect(Long projectId)
boolean isAssignedWorker(Long taskId)
boolean isReviewOwner(Long reviewId)
```

Each method grants `ROLE_ADMIN` access automatically. Non-admin users are checked against the documented PostgreSQL ownership columns.

## Security Utilities

`SecurityUtils` centralizes access to:

```java
Authentication authentication
User currentUser
Long currentUserId
String currentUsername
boolean hasRole(String roleName)
boolean isAdmin()
```

Use this utility only inside security/authorization code. Business services should prefer `OwnershipService` or `@PreAuthorize`.

## Controller Examples

Requirement update:

```java
@PutMapping("/api/requirements/{id}")
@PreAuthorize("hasRole('CUSTOMER') and @ownershipService.isRequirementOwner(#id)")
public ApiResponse<RequirementResponse> updateRequirement(@PathVariable Long id, @RequestBody RequirementRequest request) {
    return ApiResponse.success("Requirement updated successfully", requirementService.update(id, request));
}
```

Project update:

```java
@PutMapping("/api/projects/{projectId}")
@PreAuthorize("hasRole('CONTRACTOR') and @ownershipService.isAssignedContractor(#projectId)")
public ApiResponse<ProjectResponse> updateProject(@PathVariable Long projectId, @RequestBody ProjectRequest request) {
    return ApiResponse.success("Project updated successfully", projectService.update(projectId, request));
}
```

Task update:

```java
@PatchMapping("/api/tasks/{taskId}/status")
@PreAuthorize("hasRole('WORKER') and @ownershipService.isAssignedWorker(#taskId)")
public ApiResponse<TaskResponse> updateTaskStatus(@PathVariable Long taskId, @RequestBody TaskStatusRequest request) {
    return ApiResponse.success("Task updated successfully", taskService.updateStatus(taskId, request));
}
```

Admin endpoint:

```java
@GetMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public ApiResponse<List<UserResponse>> listUsers() {
    return ApiResponse.success("Users retrieved successfully", adminUserService.findAll());
}
```

## Service Examples

Use service-layer checks for operations that can be invoked by multiple controllers or asynchronous workflows:

```java
@PreAuthorize("hasPermission(#requirementId, 'REQUIREMENT', 'UPDATE')")
public RequirementResponse update(Long requirementId, RequirementRequest request) {
    // update logic
}
```

```java
@PreAuthorize("@customSecurityExpressions.canReadProject(#projectId)")
public ProjectDashboardResponse getDashboard(Long projectId) {
    // dashboard logic
}
```

```java
@PreAuthorize("@customSecurityExpressions.canDeleteReview(#reviewId)")
public void deleteReview(Long reviewId) {
    // delete or moderation logic
}
```

## Endpoint Security Matrix

| Endpoint | Allowed Roles | Ownership Rule |
| --- | --- | --- |
| `POST /api/requirements` | `CUSTOMER`, `ADMIN` | Customer creates own requirement |
| `GET /api/requirements/{id}` | `CUSTOMER`, `ADMIN` | Customer owns requirement |
| `PUT /api/requirements/{id}` | `CUSTOMER`, `ADMIN` | Customer owns requirement |
| `DELETE /api/requirements/{id}` | `CUSTOMER`, `ADMIN` | Customer owns requirement |
| `GET /api/projects/**` | `CUSTOMER`, `CONTRACTOR`, `ARCHITECT`, `ADMIN` | User is customer, contractor, or architect on project |
| `PUT /api/projects/{projectId}` | `CONTRACTOR`, `ADMIN` | Contractor assigned to project |
| `POST /api/milestones/**` | `CONTRACTOR`, `ADMIN` | Contractor assigned to project |
| `GET /api/milestones/**` | `CUSTOMER`, `CONTRACTOR`, `ARCHITECT`, `ADMIN` | User can access project |
| `POST /api/workers/assign` | `CONTRACTOR`, `ADMIN` | Contractor assigned to project |
| `DELETE /api/workers/remove/**` | `CONTRACTOR`, `ADMIN` | Contractor assigned to project |
| `POST /api/reviews/**` | `CUSTOMER` | Customer creates review |
| `DELETE /api/reviews/{reviewId}` | `CUSTOMER`, `ADMIN` | Customer owns review or admin moderates |
| `/api/admin/**` | `ADMIN` | Admin only |

## Exception Handling

Authorization failures return:

```json
{
  "success": false,
  "message": "Access denied"
}
```

Method-level authorization failures are handled by `GlobalExceptionHandler`. Filter-chain authorization failures are handled by `RestAccessDeniedHandler`.

## Security Best Practices

Keep endpoint-level rules broad and method-level rules resource-aware.

Apply ownership checks in the service layer for write operations, even when the controller already checks access.

Prefer `@PreAuthorize` for write operations and `@PostAuthorize` only for simple returned-object ownership checks.

Keep `ROLE_ADMIN` overrides centralized in `OwnershipService` and `CustomSecurityExpressions`.

Never trust IDs from the frontend. Always resolve ownership from the database.

Do not expose budgets to workers. Worker task/project endpoints should use DTOs that omit financial fields.

Keep authentication and authorization separate. JWT code should authenticate identity only; RBAC and ownership belong in authorization services and annotations.
