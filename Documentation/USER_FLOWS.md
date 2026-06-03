# USER_FLOWS.md

# Abhista - User Flow Documentation

## Purpose

This document defines how each user interacts with the Abhista platform from start to finish.

It helps in:

* Understanding user journeys
* Designing UI/UX screens
* Planning backend APIs
* Creating navigation flows
* Identifying business processes

---

# 1. System Overview

The platform connects:

Customer
↓
Contractor
↓
Worker

and

Customer
↓
Architect / Designer

through a centralized project management system.

---

# 2. Customer Flow

## Primary Customer Journey

Register
↓
Login
↓
Complete Profile
↓
Create Project Requirement
↓
Submit Requirement
↓
Contractor Reviews Requirement
↓
Contractor Accepts Project
↓
Booking Confirmation
↓
Track Project Progress
↓
Receive Milestone Updates
↓
Chat with Contractor
↓
Project Completion
↓
Submit Rating & Review

---

## Detailed Customer Flow

### Step 1: Registration

Customer enters:

* Name
* Email
* Phone Number
* Password

System creates customer account.

---

### Step 2: Login

Customer logs into platform.

Redirect to Customer Dashboard.

---

### Step 3: Create Requirement

Customer provides:

* Project Title
* Service Category
* Project Description
* Location
* Budget Range
* Expected Start Date

Submit Requirement.

---

### Step 4: Contractor Selection

Customer:

* Views interested contractors
* Reviews profiles
* Reviews ratings
* Chooses contractor

---

### Step 5: Project Monitoring

Customer accesses:

Project Dashboard

Can view:

* Progress Percentage
* Milestones
* Budget Status
* Timeline Updates
* Progress Photos
* Notifications

---

### Step 6: Communication

Customer can:

* Chat with Contractor
* Receive Updates
* Ask Questions

---

### Step 7: Completion & Review

Project completed.

Customer:

* Confirms completion
* Rates contractor
* Writes review

Flow Ends.

---

# 3. Contractor Flow

## Primary Contractor Journey

Register
↓
Login
↓
Complete Contractor Profile
↓
Receive Project Lead
↓
Review Requirement
↓
Accept Project
↓
Assign Workers
↓
Create Project Milestones
↓
Update Progress
↓
Upload Photos
↓
Communicate with Customer
↓
Complete Project
↓
Receive Review

---

## Detailed Contractor Flow

### Step 1: Registration

Contractor provides:

* Business Name
* Contact Details
* Experience
* Service Categories
* Portfolio Information

Admin verifies profile.

---

### Step 2: Receive Lead

Contractor receives notification when:

Customer posts requirement.

---

### Step 3: Project Evaluation

Contractor reviews:

* Project Scope
* Budget
* Location
* Timeline

Decision:

Accept
or
Reject

---

### Step 4: Project Setup

After acceptance:

Contractor:

* Creates project
* Defines milestones
* Estimates timeline
* Assigns workers

---

### Step 5: Project Execution

Contractor updates:

* Progress percentage
* Milestone status
* Budget usage
* Timeline changes

---

### Step 6: Upload Updates

Contractor uploads:

* Site photos
* Progress photos
* Completion evidence

Customer receives notifications.

---

### Step 7: Completion

Contractor marks project complete.

Customer reviews work.

Flow Ends.

---

# 4. Worker Flow

## Primary Worker Journey

Login
↓
View Assigned Projects
↓
View Assigned Tasks
↓
Perform Work
↓
Update Task Status
↓
Upload Work Photos
↓
Task Completed

---

## Detailed Worker Flow

### Step 1: Login

Worker logs in using credentials provided by contractor.

Redirect to Worker Dashboard.

---

### Step 2: View Assignments

Worker views:

* Assigned Project
* Assigned Tasks
* Deadlines
* Instructions

---

### Step 3: Execute Tasks

Worker performs assigned work.

Examples:

* Plumbing
* Electrical
* Painting
* Carpentry

---

### Step 4: Update Progress

Worker updates:

* Task Status
* Work Completion Percentage

---

### Step 5: Upload Photos

Worker uploads:

* Before Photos
* Progress Photos
* Completed Work Photos

Contractor receives updates.

---

### Step 6: Task Completion

Worker marks task completed.

Contractor reviews submission.

Flow Ends.

---

# 5. Architect / Designer Flow

## Primary Architect Journey

Register
↓
Login
↓
Create Professional Profile
↓
Get Assigned To Project
↓
Review Requirements
↓
Upload Designs
↓
Collaborate With Contractor
↓
Provide Revisions
↓
Project Completion

---

## Detailed Architect Flow

### Step 1: Registration

Architect creates profile.

Includes:

* Experience
* Portfolio
* Specializations

Admin verifies profile.

---

### Step 2: Project Assignment

Architect receives project invitation.

---

### Step 3: Design Phase

Architect:

* Reviews requirements
* Creates design plans
* Uploads blueprints
* Shares concepts

---

### Step 4: Collaboration

Architect communicates with:

* Customer
* Contractor

Provides revisions and recommendations.

---

### Step 5: Completion

Design approved.

Project moves into execution phase.

Flow Ends.

---

# 6. Admin Flow

## Primary Admin Journey

Login
↓
View Dashboard
↓
Manage Users
↓
Verify Professionals
↓
Monitor Projects
↓
Handle Disputes
↓
Moderate Reviews
↓
Generate Reports

---

## Detailed Admin Flow

### User Management

Admin can:

* Approve Contractors
* Approve Architects
* Suspend Users
* Reactivate Accounts

---

### Platform Monitoring

Admin monitors:

* Active Projects
* User Activity
* Project Status
* Platform Health

---

### Dispute Management

Admin resolves:

* Customer Complaints
* Contractor Complaints
* Review Issues

---

### Analytics

Admin views:

* Total Users
* Total Projects
* Active Projects
* Revenue Metrics
* Growth Reports

---

# 7. End-to-End Project Flow

Customer Creates Requirement
↓
Contractor Receives Lead
↓
Contractor Accepts Project
↓
Workers Assigned
↓
Architect Assigned (Optional)
↓
Project Starts
↓
Milestones Created
↓
Progress Updates Added
↓
Photos Uploaded
↓
Customer Tracks Progress
↓
Project Completed
↓
Customer Reviews Contractor
↓
Project Closed

---

# 8. MVP User Flows

The following flows must be implemented in Version 1 (MVP):

✅ Customer Registration

✅ Customer Login

✅ Requirement Posting

✅ Contractor Registration

✅ Contractor Dashboard

✅ Project Acceptance

✅ Worker Assignment

✅ Project Tracking Dashboard

✅ Progress Updates

✅ Photo Uploads

✅ Chat System

✅ Reviews & Ratings

❌ Material Ordering

❌ Delivery Tracking

❌ Inventory Management

❌ Marketplace Features

These are outside MVP scope.

---

# User Journey Summary

Customer
→ Post Requirement
→ Hire Contractor
→ Track Progress
→ Review

Contractor
→ Receive Lead
→ Accept Project
→ Manage Team
→ Complete Project

Worker
→ View Tasks
→ Execute Work
→ Upload Updates

Architect
→ Design
→ Collaborate
→ Deliver Plans

Admin
→ Manage Platform
→ Verify Users
→ Monitor Operations
 