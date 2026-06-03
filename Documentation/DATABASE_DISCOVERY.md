# DATABASE_DISCOVERY.md

# Abhista - Database Discovery

## Purpose

This document identifies all major business entities required by the Abhista platform before database table design begins.

The goal is to:

* Understand the business domain
* Identify data ownership
* Discover relationships
* Prepare for ER Diagram creation
* Prepare for PostgreSQL schema design

Note:

This document intentionally avoids defining:

* Table structures
* Columns
* Data types
* Primary Keys
* Foreign Keys

Those will be defined later during database design.

---

# 1. Entity Overview

| Entity              | Purpose                                    |
| ------------------- | ------------------------------------------ |
| User                | Common account for all platform users      |
| Role                | Defines user permissions and access levels |
| Customer            | Customer-specific profile information      |
| Contractor          | Contractor business profile                |
| Worker              | Skilled worker profile                     |
| Architect           | Architect or designer profile              |
| Requirement         | Customer service request                   |
| Project             | Accepted construction/service project      |
| Milestone           | Project progress tracking                  |
| Assignment          | Worker assignment to projects              |
| Message             | User communication                         |
| Conversation        | Chat session between users                 |
| Review              | Customer feedback and ratings              |
| Notification        | System-generated alerts                    |
| Booking             | Service booking records                    |
| File                | Uploaded files and images                  |
| DesignSubmission    | Architect design uploads                   |
| VerificationRequest | Professional verification workflow         |

---

# 2. User Entity

## Purpose

Represents every authenticated account in the platform.

All users share:

* Login credentials
* Authentication information
* Basic profile information

---

## Relationships

User
│
├── Customer
├── Contractor
├── Worker
├── Architect
└── Admin

One user belongs to one role.

---

# 3. Role Entity

## Purpose

Controls authorization and access permissions.

---

## Example Roles

* CUSTOMER
* CONTRACTOR
* WORKER
* ARCHITECT
* ADMIN

---

## Relationships

Role
↓
Assigned To
↓
User

One role can belong to many users.

---

# 4. Customer Entity

## Purpose

Stores customer-specific information.

Customers initiate projects and submit requirements.

---

## Relationships

Customer
│
├── Creates Requirements
├── Creates Bookings
├── Receives Notifications
├── Sends Messages
└── Writes Reviews

---

# 5. Contractor Entity

## Purpose

Stores contractor profile and business information.

Contractors receive leads and execute projects.

---

## Relationships

Contractor
│
├── Accepts Requirements
├── Manages Projects
├── Assigns Workers
├── Updates Milestones
├── Sends Messages
└── Receives Reviews

---

# 6. Worker Entity

## Purpose

Represents skilled professionals working under contractors.

Examples:

* Electrician
* Plumber
* Painter
* Carpenter
* CCTV Technician

---

## Relationships

Worker
│
├── Assigned To Projects
├── Updates Work Status
├── Uploads Progress Photos
└── Receives Notifications

---

# 7. Architect Entity

## Purpose

Represents architects and interior designers.

Provides designs and consultations.

---

## Relationships

Architect
│
├── Assigned To Projects
├── Uploads Designs
├── Communicates With Contractors
└── Communicates With Customers

---

# 8. Requirement Entity

## Purpose

Represents a customer's construction or service request.

Acts as the lead generation source for contractors.

---

## Relationships

Requirement
│
├── Created By Customer
├── Viewed By Contractors
└── May Become Project

One requirement may become one project.

---

# 9. Project Entity

## Purpose

Represents an active accepted project.

Core business entity of the platform.

---

## Relationships

Project
│
├── Belongs To Customer
├── Managed By Contractor
├── Has Workers
├── Has Architect (Optional)
├── Has Milestones
├── Has Files
├── Has Messages
└── Has Reviews

---

# 10. Milestone Entity

## Purpose

Tracks project progress.

Supports transparency and customer visibility.

---

## Example Milestones

* Project Started
* Foundation Complete
* Plumbing Complete
* Painting Complete
* Final Handover

---

## Relationships

Milestone
↓
Belongs To
↓
Project

A project can have many milestones.

---

# 11. Assignment Entity

## Purpose

Connects workers to projects.

Supports workforce management.

---

## Relationships

Assignment
│
├── References Worker
└── References Project

One project can have many workers.

One worker can work on multiple projects.

---

# 12. Booking Entity

## Purpose

Stores service bookings between customers and professionals.

---

## Relationships

Booking
│
├── Customer
├── Contractor
└── Project (Optional)

---

# 13. Conversation Entity

## Purpose

Represents a chat channel between users.

Provides organized messaging.

---

## Relationships

Conversation
│
├── Customer
├── Contractor
├── Worker
└── Architect

Contains multiple messages.

---

# 14. Message Entity

## Purpose

Stores communication between users.

Supports platform chat functionality.

---

## Relationships

Message
│
├── Belongs To Conversation
├── Sent By User
└── Received By User

---

# 15. Review Entity

## Purpose

Stores ratings and feedback.

Builds trust across the platform.

---

## Relationships

Review
│
├── Written By Customer
└── Associated With Contractor

A contractor can receive many reviews.

---

# 16. Notification Entity

## Purpose

Stores alerts and updates generated by the system.

---

## Example Notifications

* New Lead Received
* Project Accepted
* Milestone Updated
* New Message
* Review Submitted

---

## Relationships

Notification
↓
Belongs To
↓
User

---

# 17. File Entity

## Purpose

Represents uploaded media and documents.

Stored externally using Cloudinary.

---

## Examples

* Progress Photos
* Profile Images
* Completion Photos
* Design Images

---

## Relationships

File
│
├── Linked To User
├── Linked To Project
└── Linked To Milestone

---

# 18. DesignSubmission Entity

## Purpose

Stores architectural designs and revisions.

---

## Relationships

DesignSubmission
│
├── Uploaded By Architect
└── Associated With Project

---

# 19. VerificationRequest Entity

## Purpose

Manages professional verification process.

Used for:

* Contractors
* Architects

---

## Relationships

VerificationRequest
│
├── Submitted By User
└── Reviewed By Admin

---

# 20. Entity Relationship Summary

User
│
├── Role
├── Customer
├── Contractor
├── Worker
└── Architect

Customer
↓
Requirement
↓
Project
↓
Milestone

Project
│
├── Assignment
├── Worker
├── Architect
├── Message
├── File
├── Review
└── Notification

Conversation
↓
Message

Architect
↓
DesignSubmission

Admin
↓
VerificationRequest

---

# MVP Core Entities

The following entities are mandatory for Version 1:

✅ User

✅ Role

✅ Customer

✅ Contractor

✅ Worker

✅ Architect

✅ Requirement

✅ Project

✅ Milestone

✅ Assignment

✅ Conversation

✅ Message

✅ Review

✅ Notification

✅ File

---

# Future Entities

The following entities are reserved for future phases:

* Payment
* Subscription
* Invoice
* Material Supplier
* Material Order
* Project Estimate
* Loan Application
* Insurance Policy

These are outside the MVP scope.