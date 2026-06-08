# Requirement Module Domain Design

## 1. Entity

`Requirement` represents a customer-created construction or home service lead.

Package:

```text
com.abhista.requirement.entity
```

Fields:

```text
id
customer
title
description
serviceCategory
location
budgetMin
budgetMax
preferredStartDate
status
createdAt
updatedAt
```

Relationship:

```text
User(ROLE_CUSTOMER) 1 -> many Requirement
```

The JPA table is named `requirement` to align with the existing database documentation and ownership SQL already present in `OwnershipService`.

## 2. Enum

`RequirementStatus` defines the requirement lifecycle:

```text
OPEN
UNDER_REVIEW
ACCEPTED
PROJECT_CREATED
REJECTED
```

Status flow:

```text
OPEN -> UNDER_REVIEW -> ACCEPTED -> PROJECT_CREATED
```

`REJECTED` is a terminal side path.

## 3. Repository

`RequirementRepository` supports these query methods:

```java
List<Requirement> findByCustomerId(Long customerId)
List<Requirement> findByStatus(RequirementStatus status)
List<Requirement> findByCustomerIdAndStatus(Long customerId, RequirementStatus status)
long countByStatus(RequirementStatus status)
```

`@EntityGraph(attributePaths = "customer")` is used for read paths that need customer context without lazy-loading surprises.

## 4. DTOs

DTOs:

```text
CreateRequirementRequest
UpdateRequirementRequest
RequirementResponse
```

Validation:

```text
title required
description required
serviceCategory required
location required
budgetMin >= 0
budgetMax >= budgetMin
preferredStartDate optional
```

`RequirementResponse` exposes `customerId`, not the internal `User` entity.

## 5. Security Design

Customer:

```text
Can create requirements
Can view own requirements
Can view own requirement details
Can update own requirements
Can delete own requirements
Cannot view other customers' requirements
```

Contractor:

```text
Can view OPEN requirements
Can view OPEN requirement details
Cannot create requirements
Cannot update requirements
Cannot delete requirements
```

Admin:

```text
Can view all requirements
Can manage requirement status
```

Security expression constants are defined in:

```text
com.abhista.requirement.security.RequirementSecurityRules
```

Controller/service examples for future implementation:

```java
@PreAuthorize(RequirementSecurityRules.CREATE_REQUIREMENT)
```

```java
@PreAuthorize("hasRole('CUSTOMER') and @ownershipService.isRequirementOwner(#requirementId)")
```

```java
@PreAuthorize("hasRole('CONTRACTOR') and @requirementAccessPolicy.isOpenRequirement(#requirementId)")
```

```java
@PreAuthorize("hasRole('ADMIN')")
```

## 6. Ownership Design

Customer ownership is based on:

```sql
requirement.customer_id = current_user.id
```

The existing `OwnershipService.isRequirementOwner(Long requirementId)` is the canonical ownership check for customer-owned requirement access.

Contractor visibility is status-based:

```sql
requirement.status = 'OPEN'
```

`RequirementAccessPolicy.isOpenRequirement(Long requirementId)` supports this future method-security check.

## 7. Database Notes

Table:

```text
requirement
```

Columns:

```text
id bigint primary key
customer_id bigint not null references users(id)
title varchar(150) not null
description varchar(2000) not null
service_category varchar(120) not null
location varchar(255) not null
budget_min numeric(14,2) not null
budget_max numeric(14,2) not null
preferred_start_date date null
status varchar(40) not null
created_at timestamp with time zone not null
updated_at timestamp with time zone null
```

Indexes:

```text
customer_id
status
customer_id,status
```

Budget amounts use `BigDecimal` and `numeric(14,2)` for PostgreSQL compatibility.

## 8. Future Expansion Notes

When the Project Module is introduced, accepted requirements should become projects through an explicit conversion workflow.

Recommended future flow:

```text
Requirement ACCEPTED
-> validate customer, contractor, optional architect
-> create Project from requirement snapshot
-> set Requirement status to PROJECT_CREATED
```

Avoid deleting converted requirements. Keep them as the immutable lead source for audit and traceability.

Future fields can include:

```text
acceptedContractorId
reviewedAt
acceptedAt
convertedProjectId
rejectionReason
attachments
```
