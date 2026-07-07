Create REQUIREMENT_MODULE.md for the Abhista platform.

Project Context:

Abhista is a Construction & Home Service Management Platform.

The Requirement Module is the first core business module after Customer Profile.

Purpose:

Allow customers to post construction and home service requirements.

Requirements act as leads for contractors.

A requirement may later become a project.

====================================================

Document Sections

1. Module Purpose

2. Business Goals

3. Requirement Lifecycle

4. Status Flow

5. User Roles

6. Permissions

7. Data Ownership Rules

8. Future Project Conversion Flow

9. API Planning (Design Only)

10. MVP Scope

====================================================

Requirement Lifecycle

OPEN
↓
UNDER_REVIEW
↓
ACCEPTED
↓
PROJECT_CREATED

REJECTED

(separate branch)

================================================

Business Rules

Only customers create requirements.

Only owners can view requirements.

Contractors can view OPEN requirements only.

Admin can access all requirements.

================================================

Permissions

Customer

Contractor

Admin

================================================

API List

POST /api/requirements

GET /api/requirements/my

GET /api/requirements/{id}


====================================================

Status Flow

OPEN
↓
UNDER_REVIEW
↓
ACCEPTED
↓
PROJECT_CREATED

Separate Status:

REJECTED

====================================================

Permissions

Customer:

* Create Requirement
* View Own Requirements
* View Own Requirement Details

Contractor:

* View OPEN Requirements
* View Requirement Details

Admin:

* View All Requirements
* Manage Requirement Status

====================================================

Data Ownership

Customer:

Can access only own requirements.

Contractor:

Can view only published/open requirements.

Admin:

Can access all requirements.

====================================================

Output:

Generate complete REQUIREMENT_MODULE.md documentation.
