# SYSTEM_ARCHITECTURE.md

# Abhista - System Architecture

## Purpose

This document defines the technical architecture of the Abhista platform.

It serves as a blueprint for:

* Frontend Development
* Backend Development
* Database Design
* Authentication & Authorization
* Infrastructure Planning
* Deployment Strategy
* Scalability Planning

---

# 1. Architecture Overview

Abhista follows a modern three-tier architecture:

Client Layer (Frontend)
↓
Application Layer (Backend API)
↓
Data Layer (Database & Storage)

This architecture ensures:

* Scalability
* Security
* Maintainability
* High Performance
* Future Expansion

---

# 2. Technology Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| Frontend           | React + TypeScript               |
| Backend            | Spring Boot                      |
| Database           | PostgreSQL                       |
| Authentication     | JWT                              |
| Authorization      | RBAC (Role-Based Access Control) |
| File Storage       | Cloudinary                       |
| State Management   | Redux Toolkit                    |
| API Communication  | Axios                            |
| ORM                | Spring Data JPA                  |
| Build Tool         | Maven                            |
| Hosting (Frontend) | Vercel                           |
| Hosting (Backend)  | Render / Railway                 |
| Database Hosting   | Neon PostgreSQL                  |
| Version Control    | GitHub                           |
| CI/CD              | GitHub Actions                   |

---

# 3. High-Level Architecture

Frontend (React)
↓
REST API
↓
Spring Boot Backend
↓
PostgreSQL Database

Additional Services

Cloudinary
↓
Image & File Storage

JWT
↓
Authentication

GitHub Actions
↓
Deployment Pipeline

---

# 4. Frontend Architecture

## Technology

React + TypeScript

---

## Frontend Modules

### Public Pages

* Home Page
* About Us
* Services
* Contractor Listings
* Professional Listings
* Login
* Registration

---

### Customer Module

* Dashboard
* Requirement Posting
* Project Tracking
* Chat
* Reviews

---

### Contractor Module

* Dashboard
* Lead Management
* Worker Management
* Project Management
* Progress Updates

---

### Worker Module

* Assigned Tasks
* Progress Updates
* Photo Uploads

---

### Architect Module

* Project Access
* Design Uploads
* Collaboration Tools

---

### Admin Module

* User Management
* Verification System
* Analytics
* Reports

---

## Frontend Folder Structure

src/

├── components/

├── pages/

├── layouts/

├── services/

├── hooks/

├── store/

├── routes/

├── types/

├── utils/

├── assets/

└── App.tsx

---

# 5. Backend Architecture

## Technology

Spring Boot

---

## Architectural Pattern

Layered Architecture

Controller Layer
↓
Service Layer
↓
Repository Layer
↓
Database

---

## Backend Modules

### Authentication Module

Handles:

* Login
* Registration
* JWT Generation
* Password Security

---

### User Management Module

Handles:

* Customers
* Contractors
* Workers
* Architects
* Admins

---

### Requirement Module

Handles:

* Requirement Creation
* Requirement Updates
* Lead Distribution

---

### Project Module

Handles:

* Project Creation
* Milestone Tracking
* Budget Tracking
* Timeline Tracking

---

### Worker Management Module

Handles:

* Worker Assignment
* Worker Updates
* Task Tracking

---

### Chat Module

Handles:

* Messaging
* Notifications

---

### Review Module

Handles:

* Ratings
* Reviews

---

### File Upload Module

Handles:

* Project Photos
* Design Files
* Profile Images

---

## Backend Package Structure

com.abhista

├── controller

├── service

├── repository

├── entity

├── dto

├── security

├── config

├── exception

├── util

└── validation

---

# 6. Database Architecture

## Technology

PostgreSQL

---

## Core Entities

### Users

Stores:

* Customers
* Contractors
* Workers
* Architects
* Admins

---

### Roles

Stores:

* CUSTOMER
* CONTRACTOR
* WORKER
* ARCHITECT
* ADMIN

---

### Requirements

Stores customer project requests.

---

### Projects

Stores accepted projects.

---

### Milestones

Stores project progress checkpoints.

---

### Workers

Stores worker details.

---

### Assignments

Maps workers to projects.

---

### Messages

Stores chat conversations.

---

### Reviews

Stores ratings and reviews.

---

### Notifications

Stores user notifications.

---

### Files

Stores Cloudinary file references.

---

# 7. Authentication Architecture

## Technology

JWT (JSON Web Token)

---

## Authentication Flow

User Login
↓
Validate Credentials
↓
Generate JWT Token
↓
Return Token
↓
Frontend Stores Token
↓
API Requests Include Token
↓
Backend Validates Token

---

## Security Features

* BCrypt Password Encryption
* JWT Authentication
* Role-Based Authorization
* Route Protection
* API Protection
* Session Management

---

# 8. Authorization Architecture (RBAC)

## Roles

CUSTOMER

CONTRACTOR

WORKER

ARCHITECT

ADMIN

---

## Permission Flow

User Login
↓
Role Identified
↓
Permissions Loaded
↓
Access Granted

Examples:

Customer:

* Create Requirement
* Track Projects

Contractor:

* Accept Projects
* Manage Workers

Worker:

* Update Tasks

Architect:

* Upload Designs

Admin:

* Full Access

---

# 9. File Storage Architecture

## Technology

Cloudinary

---

## Files Stored

### Profile Images

* Customer Photos
* Contractor Logos

### Project Files

* Progress Photos
* Completion Photos

### Design Files

* Blueprints
* Design Images

---

## Storage Flow

User Uploads File
↓
Spring Boot Receives File
↓
Upload To Cloudinary
↓
Cloudinary URL Returned
↓
URL Stored In Database

---

# 10. Notification Architecture

## MVP

Database Notifications

Examples:

* New Lead Received
* Project Accepted
* Milestone Updated
* Review Submitted

---

## Future

* Email Notifications
* SMS Notifications
* Push Notifications
* WhatsApp Notifications

---

# 11. Hosting Architecture

## Frontend Hosting

Vercel

Benefits:

* Fast deployment
* Global CDN
* Free tier available

---

## Backend Hosting

Render

Alternative:

Railway

Benefits:

* Easy deployment
* Auto scaling support
* Spring Boot friendly

---

## Database Hosting

Neon PostgreSQL

Benefits:

* Managed PostgreSQL
* Automatic backups
* Free starter plan

---

# 12. DevOps & Version Control

## Version Control

GitHub

Repository Structure

frontend/

backend/

docs/

---

## CI/CD

GitHub Actions

Pipeline

Push Code
↓
Build Application
↓
Run Tests
↓
Deploy Automatically

---

# 13. Scalability Strategy

Phase 1 (MVP)

* Monolithic Spring Boot Application
* Single PostgreSQL Database

---

Phase 2

* Redis Caching
* Queue Processing
* Advanced Monitoring

---

Phase 3

* Microservices Architecture
* Event-Driven Communication
* Kubernetes Deployment

---

# 14. Non-Functional Requirements

## Performance

* API Response < 500ms
* Dashboard Load < 3 Seconds

---

## Security

* JWT Authentication
* Encrypted Passwords
* HTTPS Enabled
* Role-Based Access

---

## Reliability

* Daily Database Backups
* Error Logging
* Monitoring

---

## Scalability

* Support 10,000+ Users
* Multi-City Expansion
* Horizontal Scaling Ready

---

# Architecture Summary

Frontend:
React + TypeScript

Backend:
Spring Boot

Database:
PostgreSQL

Authentication:
JWT + Spring Security

Authorization:
RBAC

Storage:
Cloudinary

Hosting:
Vercel + Render + Neon

Version Control:
GitHub

CI/CD:
GitHub Actions

Architecture Style:
Layered Monolithic Architecture (MVP)

Future Evolution:
Microservices Architecture
s