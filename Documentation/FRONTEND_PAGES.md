# FRONTEND_PAGES.md

# Abhista - Frontend Pages & Screen Design

## Purpose

This document defines all frontend pages required for the Abhista platform.

It serves as the foundation for:

* UI/UX Design
* React Routing
* Navigation Structure
* Dashboard Development
* Role-Based Access Control (RBAC)

Technology Stack:

* React
* TypeScript
* React Router
* Redux Toolkit
* Tailwind CSS

---

# 1. Application Structure

The application consists of:

1. Public Pages
2. Customer Pages
3. Contractor Pages
4. Worker Pages
5. Architect Pages
6. Admin Pages

---

# 2. Public Pages

These pages are accessible without login.

---

## Home Page

### Route

/

### Purpose

Landing page of the platform.

### Features

* Hero Section
* Services Overview
* How It Works
* Contractor Highlights
* Professional Listings
* Testimonials
* Contact Section

---

## Login Page

### Route

/login

### Purpose

Authenticate users.

### Features

* Email
* Password
* Remember Me
* Forgot Password

---

## Register Page

### Route

/register

### Purpose

Create account.

### Roles Available

* Customer
* Contractor
* Architect

(Workers are created by Contractors)

### Features

* Registration Form
* Role Selection
* Validation

---

## About Us Page

### Route

/ about

### Purpose

Company information.

---

## Contact Us Page

### Route

/ contact

### Purpose

Customer inquiries.

---

# 3. Customer Pages

Accessible only by Customer role.

---

## Customer Dashboard

### Route

/customer/dashboard

### Purpose

Customer overview page.

### Features

* Active Projects
* Recent Requirements
* Notifications
* Budget Summary
* Quick Actions

---

## Create Requirement

### Route

/customer/requirements/create

### Purpose

Post new service requirement.

### Features

* Title
* Description
* Budget
* Location
* Start Date

---

## Requirements List

### Route

/ customer/requirements

### Purpose

View all customer requirements.

### Features

* Requirement Status
* Contractor Responses
* Filters

---

## Requirement Details

### Route

/ customer/requirements/:id

### Purpose

View specific requirement.

---

## Project Tracking

### Route

/ customer/projects/:id

### Purpose

Track project progress.

### Features

* Progress Percentage
* Milestones
* Budget Tracking
* Timeline Tracking
* Progress Photos

---

## Contractor Listings

### Route

/ contractors

### Purpose

Browse contractors.

### Features

* Search
* Filters
* Ratings
* Profiles

---

## Chat

### Route

/ customer/chat

### Purpose

Communicate with contractor.

---

## Notifications

### Route

/ customer/notifications

### Purpose

View updates.

---

## Profile

### Route

/ customer/profile

### Purpose

Manage profile.

---

# 4. Contractor Pages

Accessible only by Contractor role.

---

## Contractor Dashboard

### Route

/ contractor/dashboard

### Purpose

Contractor control center.

### Features

* Active Projects
* New Leads
* Worker Overview
* Revenue Summary

---

## Lead Management

### Route

/ contractor/leads

### Purpose

Manage customer requirements.

### Features

* Accept Lead
* Reject Lead
* View Details

---

## Projects

### Route

/ contractor/projects

### Purpose

Manage projects.

---

## Project Details

### Route

/ contractor/projects/:id

### Purpose

Update project information.

### Features

* Milestones
* Budget
* Workers
* Progress Updates

---

## Worker Management

### Route

/ contractor/workers

### Purpose

Manage workforce.

### Features

* Add Worker
* Assign Worker
* Remove Worker

---

## Progress Updates

### Route

/ contractor/projects/:id/progress

### Purpose

Upload project progress.

---

## Portfolio

### Route

/ contractor/portfolio

### Purpose

Showcase completed work.

---

## Chat

### Route

/ contractor/chat

### Purpose

Customer communication.

---

## Profile

### Route

/ contractor/profile

### Purpose

Manage contractor information.

---

# 5. Worker Pages

Accessible only by Worker role.

---

## Worker Dashboard

### Route

/ worker/dashboard

### Purpose

Worker overview.

### Features

* Assigned Projects
* Assigned Tasks
* Notifications

---

## Assigned Tasks

### Route

/ worker/tasks

### Purpose

View work assignments.

---

## Task Details

### Route

/ worker/tasks/:id

### Purpose

Update task progress.

### Features

* Status Updates
* Completion Percentage

---

## Progress Updates

### Route

/ worker/progress

### Purpose

Upload work photos and updates.

---

## Profile

### Route

/ worker/profile

### Purpose

Manage worker profile.

---

# 6. Architect Pages

Accessible only by Architect role.

---

## Architect Dashboard

### Route

/ architect/dashboard

### Purpose

Architect overview.

---

## Assigned Projects

### Route

/ architect/projects

### Purpose

View assigned projects.

---

## Project Details

### Route

/ architect/projects/:id

### Purpose

Review project information.

---

## Design Uploads

### Route

/ architect/designs

### Purpose

Upload blueprints and designs.

---

## Collaboration Center

### Route

/ architect/collaboration

### Purpose

Communicate with contractors and customers.

---

## Profile

### Route

/ architect/profile

### Purpose

Manage architect information.

---

# 7. Admin Pages

Accessible only by Admin role.

---

## Admin Dashboard

### Route

/ admin/dashboard

### Purpose

Platform overview.

### Features

* User Statistics
* Project Statistics
* Growth Metrics

---

## User Management

### Route

/ admin/users

### Purpose

Manage platform users.

---

## User Details

### Route

/ admin/users/:id

### Purpose

Review user information.

---

## Project Management

### Route

/ admin/projects

### Purpose

Monitor platform projects.

---

## Verification Requests

### Route

/ admin/verifications

### Purpose

Approve contractors and architects.

---

## Reports & Analytics

### Route

/ admin/reports

### Purpose

View platform analytics.

---

## Review Moderation

### Route

/ admin/reviews

### Purpose

Manage ratings and reviews.

---

## Settings

### Route

/ admin/settings

### Purpose

Platform configuration.

---

# Navigation Structure

Public
│
├── Home
├── Login
├── Register
├── About
└── Contact

Customer
│
├── Dashboard
├── Requirements
├── Projects
├── Chat
├── Notifications
└── Profile

Contractor
│
├── Dashboard
├── Leads
├── Projects
├── Workers
├── Portfolio
├── Chat
└── Profile

Worker
│
├── Dashboard
├── Tasks
├── Progress Updates
└── Profile

Architect
│
├── Dashboard
├── Projects
├── Designs
├── Collaboration
└── Profile

Admin
│
├── Dashboard
├── Users
├── Projects
├── Reports
├── Reviews
├── Verifications
└── Settings

---

# MVP Pages Count

Public Pages: 5

Customer Pages: 8

Contractor Pages: 8

Worker Pages: 4

Architect Pages: 5

Admin Pages: 7

Total Screens: 37

---

# MVP Priority Pages

Phase 1 (Must Build First)

✅ Home

✅ Login

✅ Register

✅ Customer Dashboard

✅ Create Requirement

✅ Contractor Dashboard

✅ Lead Management

✅ Project Tracking

✅ Worker Dashboard

✅ Admin Dashboard

---

# Future Pages (Phase 2)

* Payments
* Subscription Plans
* AI Recommendations
* Advanced Analytics
* Video Consultation
* Support Center

These pages are outside the MVP scope.
