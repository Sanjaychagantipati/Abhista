# Abhista - Completed Features & Project Status

This document provides a comprehensive summary of the architecture, database design, and features implemented in the **Abhista** platform.

---

## 1. System Architecture & Tech Stack

Abhista is built as a three-tier web application using modern, standard technologies:

* **Backend**: Java 21, Spring Boot (3.5.x), Spring Security, Spring Data JPA, MapStruct, and Lombok.
* **Frontend**: React 19, TypeScript, Redux Toolkit (state management), React Router 7, and Tailwind CSS.
* **Database**: Supabase PostgreSQL database instance accessed via connection pooling.
* **Build Tools**: Maven (`mvnw`) for the backend, Vite for the frontend.

---

## 2. Database Schema Status

The database schemas have been fully mapped using JPA Entities and are automatically managed via Hibernate (`ddl-auto: update`). The following core tables have been verified and set up on Supabase:

| Table Name | Entity Class | Purpose |
| :--- | :--- | :--- |
| `roles` | `Role` | Roles management (`ROLE_CUSTOMER`, `ROLE_CONTRACTOR`, `ROLE_WORKER`, `ROLE_ARCHITECT`, `ROLE_ADMIN`). |
| `users` | `User` | Base credentials, login details, and role linking. |
| `customer_profiles` | `CustomerProfile` | Customer contact details, location (city, state, pincode), and profile image. |
| `contractor_profiles` | `ContractorProfile` | Contractor business details, specialization, experience, and verification status. |
| `requirement` | `Requirement` | Job/project requests posted by Customers containing budget, location, and details. |
| `portfolios` | `Portfolio` | Showcase items uploaded by Contractors (images, descriptions) to display completed work. |

---

## 3. Implemented Modules & Features

### 🔑 Authentication & Authorization (RBAC)
* **Backend**:
  * Stateless JWT authentication (`/api/auth/register`, `/api/auth/login`).
  * Password encryption using `BCryptPasswordEncoder` (isolated into a separate configuration to prevent circular dependencies).
  * JWT verification parsed once per request (custom optimization) with key caching to reduce CPU signature verification overhead.
* **Frontend**:
  * Persistent authentication state in Redux.
  * Auto-redirects to dashboards based on roles (Customer/Contractor).
  * Protected route wrappers (`<ProtectedRoute>`) checking for authentication tokens and specific roles.

### 👤 Customer Portal
* **Dashboard**: Displays active status and profiles completion checks. Prohibits customers from posting requirements until their profile details are complete.
* **Profile Management**: Profile creation and editing page (`/customer/profile`) collecting Full Name, Address, City, State, Pincode, and Phone.
* **Requirement Posting**: Page (`/customer/requirements/create`) containing forms with valid input validations (positive budgets, start date in the future, budget max $\ge$ budget min).
* **Requirement List**: Tabular view of all posted requirements with status badges (`OPEN`, `UNDER_REVIEW`, `ACCEPTED`, `PROJECT_CREATED`, `REJECTED`).
* **Requirement Details**: Detail page (`/customer/requirements/:id`) displaying description, location, budget range, and preferred start date, secured by ownership checks.

### 🔨 Contractor Portal
* **Dashboard**: Highlights company specialization, experience years, service areas, and profile completeness status.
* **Profile Management**: Setup page (`/contractor/profile`) collecting Company Name, Owner Name, Contact Number, Specialization, Experience, and Service Areas.
* **Lead Discovery Engine**: Page (`/contractor/leads`) letting contractors browse and search all `OPEN` customer requirements:
  * Full-text search on title and description.
  * Filters for specific service categories and locations.
  * Detail Modal pop-up showing complete requirement description and budget details (hiding customer contact info to preserve privacy).
* **Portfolio Showcase**: Page (`/contractor/portfolio`) allowing contractors to manage their completed projects:
  * List view showing images, project types, and descriptions.
  * Form (`/contractor/portfolio/create`) to add new items (validates title, description, and image URL).
  * Delete functionality allowing item removal from the grid.

---

## 4. Configuration & Environment Integration

* **Supabase Connection Pooler**:
  * Configured connection defaults in `application.yaml` to connect via the Supabase connection pooler (`aws-0-ap-northeast-1.pooler.supabase.com:5432`).
  * Resolves IPv6 resolution bugs (e.g., `UnknownHostException` on IPv4-only networks) when connecting to direct Supabase database hostnames.
* **Credential Safety**:
  * Configured `.gitignore` to ignore `.env` files.
  * Added `.env.example` configuration template.
* **Local Run Helpers**:
  * Added `run-backend.ps1` script that parses `.env` parameters and injects them into the JVM environment scope before booting Spring Boot.
* **Port Conflict Resolution**:
  * Changed the default backend port to `8085` to prevent conflicts on the default port `8080`.

---

## 5. Summary of Future Features (Roadmap)

To reach full MVP launch, the following items remain to be developed:

1. **Lead Acceptance & Project Conversion**: Allowing contractors to bid on/accept an open requirement, spawning a `Project` with milestones.
2. **Workforce Management**: Dashboards and pages for assigning workers to tasks under a project.
3. **In-App Chat**: Live messaging channels between Customers and Contractors.
4. **Ratings & Reviews**: Allowing customers to write reviews on contractors' profiles after project completion.
5. **Architect Portal**: Supporting architect roles, blueprint uploads, and design approvals.
