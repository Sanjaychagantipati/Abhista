# BACKEND_MODULES.md

# Abhista - Backend Module Design

## Purpose

This document defines the backend modules of the Abhista platform.

It serves as the foundation for:

* Spring Boot Package Structure
* API Design
* Service Layer Design
* Repository Layer Design
* Security Implementation
* Future Scalability

Architecture Style:

Layered Monolithic Architecture

Technology:

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* PostgreSQL
* Spring Data JPA

---

# Backend Architecture Overview

Frontend (React)
↓
REST APIs
↓
Spring Boot Backend
↓
Business Modules
↓
Database

---

# 1. AUTH MODULE

## Purpose

Handles authentication and authorization.

---

## Responsibilities

* User Registration
* Login
* JWT Token Generation
* JWT Validation
* Password Encryption
* Logout
* Refresh Tokens

---

## APIs

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/refresh-token

GET /api/auth/me

---

## Components

AuthController

AuthService

AuthRepository

JwtService

JwtFilter

SecurityConfig

---

# 2. USER MODULE

## Purpose

Manages all user accounts.

---

## Responsibilities

* User Management
* Profile Management
* User Search
* Role Assignment
* Account Status Management

---

## APIs

GET /api/users

GET /api/users/{id}

PUT /api/users/{id}

DELETE /api/users/{id}

GET /api/users/profile

PUT /api/users/profile

---

## Components

UserController

UserService

UserRepository

UserMapper

---

# 3. REQUIREMENT MODULE

## Purpose

Manages customer requirements.

---

## Responsibilities

* Create Requirement
* Update Requirement
* Delete Requirement
* View Requirement
* Requirement Status Tracking

---

## APIs

POST /api/requirements

GET /api/requirements

GET /api/requirements/{id}

PUT /api/requirements/{id}

DELETE /api/requirements/{id}

---

## Components

RequirementController

RequirementService

RequirementRepository

RequirementMapper

---

# 4. CONTRACTOR MODULE

## Purpose

Manages contractor operations.

---

## Responsibilities

* Contractor Profile Management
* Lead Management
* Project Acceptance
* Portfolio Management
* Contractor Verification

---

## APIs

GET /api/contractors

GET /api/contractors/{id}

PUT /api/contractors/{id}

POST /api/contractors/{id}/accept-project

GET /api/contractors/leads

---

## Components

ContractorController

ContractorService

ContractorRepository

ContractorMapper

---

# 5. WORKER MODULE

## Purpose

Manages workers and assignments.

---

## Responsibilities

* Worker Management
* Worker Assignment
* Task Tracking
* Worker Availability

---

## APIs

POST /api/workers

GET /api/workers

GET /api/workers/{id}

PUT /api/workers/{id}

POST /api/workers/assign

---

## Components

WorkerController

WorkerService

WorkerRepository

AssignmentRepository

---

# 6. PROJECT MODULE

## Purpose

Core business module.

Manages active projects.

---

## Responsibilities

* Project Creation
* Project Tracking
* Budget Monitoring
* Timeline Tracking
* Project Status Management

---

## APIs

POST /api/projects

GET /api/projects

GET /api/projects/{id}

PUT /api/projects/{id}

DELETE /api/projects/{id}

GET /api/projects/dashboard/{id}

---

## Components

ProjectController

ProjectService

ProjectRepository

ProjectMapper

---

# 7. MILESTONE MODULE

## Purpose

Tracks project progress.

---

## Responsibilities

* Create Milestones
* Update Milestones
* Progress Tracking
* Completion Tracking

---

## APIs

POST /api/milestones

GET /api/milestones/{id}

PUT /api/milestones/{id}

DELETE /api/milestones/{id}

---

## Components

MilestoneController

MilestoneService

MilestoneRepository

---

# 8. CHAT MODULE

## Purpose

Provides communication between users.

---

## Responsibilities

* Conversations
* Messaging
* File Sharing
* Chat History

---

## APIs

POST /api/chats/conversations

GET /api/chats/conversations

POST /api/chats/messages

GET /api/chats/messages/{conversationId}

---

## Components

ChatController

ConversationRepository

MessageRepository

ChatService

---

# 9. REVIEW MODULE

## Purpose

Builds trust within the platform.

---

## Responsibilities

* Submit Reviews
* Submit Ratings
* View Reviews
* Calculate Average Ratings

---

## APIs

POST /api/reviews

GET /api/reviews

GET /api/reviews/{id}

DELETE /api/reviews/{id}

---

## Components

ReviewController

ReviewService

ReviewRepository

---

# 10. NOTIFICATION MODULE

## Purpose

Handles system notifications.

---

## Responsibilities

* Create Notifications
* Send Alerts
* Read Notifications
* Notification History

---

## APIs

GET /api/notifications

PUT /api/notifications/read/{id}

DELETE /api/notifications/{id}

---

## Components

NotificationController

NotificationService

NotificationRepository

---

# Recommended Spring Boot Package Structure

com.abhista

├── auth
│ ├── controller
│ ├── service
│ ├── security
│ └── dto
│
├── user
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── requirement
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── contractor
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── worker
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── project
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── milestone
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── chat
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── review
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── notification
│ ├── controller
│ ├── service
│ ├── repository
│ └── dto
│
├── common
├── exception
├── config
└── util

---

# Module Dependency Flow

Auth Module
↓
User Module
↓
Requirement Module
↓
Contractor Module
↓
Project Module
↓
Milestone Module
↓
Worker Module
↓
Chat Module
↓
Review Module
↓
Notification Module

---

# MVP Modules

Mandatory for Version 1

✅ Auth Module

✅ User Module

✅ Requirement Module

✅ Contractor Module

✅ Worker Module

✅ Project Module

✅ Milestone Module

✅ Chat Module

✅ Review Module

✅ Notification Module

---

# Future Modules (Phase 2+)

* Payment Module
* Subscription Module
* Analytics Module
* Reporting Module
* Email Module
* SMS Module
* File Management Module
* AI Recommendation Module
* Audit Log Module

These modules are outside MVP scope.
