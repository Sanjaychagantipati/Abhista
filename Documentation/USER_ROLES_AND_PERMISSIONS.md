# USER_ROLES_AND_PERMISSIONS.md

# Abhista - User Roles & Permissions

## Purpose

This document defines the responsibilities and permissions of each user role within the Abhista platform.

It serves as the foundation for:

* Role-Based Access Control (RBAC)
* Backend Authorization
* Frontend Route Protection
* API Security Rules
* Dashboard Access Management

---

# 1. User Roles

The platform consists of five primary roles:

1. Customer
2. Contractor
3. Worker
4. Architect / Designer
5. Admin

---

# 2. Role Definitions

## Customer

A customer is a homeowner or property owner who requires construction or home services.

### Responsibilities

* Post project requirements
* Browse contractors and professionals
* Book services
* Track project progress
* Communicate with contractors
* Submit reviews and ratings

---

## Contractor

A contractor manages construction projects and coordinates workers and customers.

### Responsibilities

* Accept customer projects
* Manage project execution
* Update milestones
* Manage workers
* Communicate with customers
* Upload progress updates

---

## Worker

A worker is a skilled professional working under a contractor.

Examples:

* Electrician
* Plumber
* Painter
* Carpenter
* CCTV Technician
* Brickworker
* tiles
* fall ceiling
* water proofing ,etc.

### Responsibilities

* View assigned projects
* Update assigned task status
* Upload work progress
* Communicate with contractor

---

## Architect / Designer

A professional responsible for planning, designing, and consulting.

### Responsibilities

* View assigned projects
* Upload design documents
* Provide recommendations
* Collaborate with contractors

---

## Admin

Platform administrator responsible for platform operations.

### Responsibilities

* Manage users
* Verify professionals
* Resolve disputes
* Moderate reviews
* Manage platform settings
* Access analytics

---

# 3. Permission Matrix

| Feature                    | Customer | Contractor | Worker  | Architect | Admin |
| -------------------------- | -------- | ---------- | ------- | --------- | ----- |
| Register Account           | Yes      | Yes        | Yes     | Yes       | Yes   |
| Login                      | Yes      | Yes        | Yes     | Yes       | Yes   |
| Update Profile             | Yes      | Yes        | Yes     | Yes       | Yes   |
| View Dashboard             | Yes      | Yes        | Yes     | Yes       | Yes   |
| Create Project Request     | Yes      | No         | No      | No        | Yes   |
| Edit Own Project Request   | Yes      | No         | No      | No        | Yes   |
| Delete Own Project Request | Yes      | No         | No      | No        | Yes   |
| View Contractor Profiles   | Yes      | Yes        | Yes     | Yes       | Yes   |
| View Professional Listings | Yes      | Yes        | Yes     | Yes       | Yes   |
| Book Services              | Yes      | No         | No      | No        | Yes   |
| Accept Project             | No       | Yes        | No      | No        | Yes   |
| Reject Project             | No       | Yes        | No      | No        | Yes   |
| View Assigned Projects     | Limited  | Yes        | Yes     | Yes       | Yes   |
| Manage Own Projects        | No       | Yes        | No      | No        | Yes   |
| Create Milestones          | No       | Yes        | No      | No        | Yes   |
| Update Milestones          | No       | Yes        | Limited | Limited   | Yes   |
| Upload Progress Photos     | No       | Yes        | Yes     | No        | Yes   |
| Upload Design Documents    | No       | No         | No      | Yes       | Yes   |
| Assign Workers             | No       | Yes        | No      | No        | Yes   |
| Remove Workers             | No       | Yes        | No      | No        | Yes   |
| View Budget Tracking       | Yes      | Yes        | No      | Limited   | Yes   |
| View Timeline Tracking     | Yes      | Yes        | Yes     | Yes       | Yes   |
| Chat with Customer         | No       | Yes        | No      | No        | Yes   |
| Chat with Contractor       | Yes      | No         | Yes     | Yes       | Yes   |
| Submit Reviews             | Yes      | No         | No      | No        | Yes   |
| View Reviews               | Yes      | Yes        | Yes     | Yes       | Yes   |
| Receive Notifications      | Yes      | Yes        | Yes     | Yes       | Yes   |
| Verify Professionals       | No       | No         | No      | No        | Yes   |
| Approve Contractors        | No       | No         | No      | No        | Yes   |
| Suspend Users              | No       | No         | No      | No        | Yes   |
| Manage Platform Settings   | No       | No         | No      | No        | Yes   |
| Access Analytics           | No       | Limited    | No      | No        | Yes   |
| Resolve Disputes           | No       | No         | No      | No        | Yes   |

---

# 4. Dashboard Access

## Customer Dashboard

Accessible Features:

* Project Requests
* Contractor Search
* Bookings
* Project Tracking
* Budget Monitoring
* Reviews
* Notifications
* Chat

---

## Contractor Dashboard

Accessible Features:

* Lead Management
* Project Management
* Worker Management
* Project Progress Updates
* Customer Communication
* Ratings & Reviews

---

## Worker Dashboard

Accessible Features:

* Assigned Tasks
* Assigned Projects
* Progress Updates
* Notifications

---

## Architect Dashboard

Accessible Features:

* Assigned Projects
* Design Uploads
* Project Collaboration
* Communication Tools

---

## Admin Dashboard

Accessible Features:

* User Management
* Verification System
* Review Moderation
* Reports & Analytics
* Dispute Resolution
* Platform Configuration

---

# 5. Data Ownership Rules

## Customer

Can access:

* Own profile
* Own projects
* Own bookings
* Own chats
* Own reviews

Cannot access:

* Other customer projects
* Contractor internal data
* Platform analytics

---

## Contractor

Can access:

* Own profile
* Assigned projects
* Assigned workers
* Customer communication

Cannot access:

* Other contractor projects
* Admin controls

---

## Worker

Can access:

* Assigned projects only
* Assigned tasks only

Cannot access:

* Project budgets
* Contractor management functions
* Platform administration

---

## Architect

Can access:

* Assigned projects
* Design-related information

Cannot access:

* User management
* Platform analytics

---

## Admin

Has full platform access and management privileges.

---

# 6. Recommended RBAC Implementation

## System Roles

ROLE_CUSTOMER

ROLE_CONTRACTOR

ROLE_WORKER

ROLE_ARCHITECT

ROLE_ADMIN

---

## Authorization Strategy

### Backend

* Spring Security Role-Based Authorization
* JWT Authentication
* Route-Level Protection
* API-Level Authorization

### Frontend

* Protected Routes
* Role-Based Navigation Menus
* Dashboard Access Control
* Feature Visibility Control

---

# 7. Future Role Expansion

Additional roles that may be introduced later:

* Project Manager
* Interior Consultant
* Material Supplier
* Quality Inspector
* Finance Manager
* Regional Admin

These roles are outside the MVP scope.

---

# Role Hierarchy

ADMIN
│
├── CONTRACTOR
│ └── WORKER
│
├── ARCHITECT
│
└── CUSTOMER

The Admin oversees the entire platform while Contractors manage Workers and Customers manage projects.
