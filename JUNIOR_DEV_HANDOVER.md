# ANUBHAV

# Junior Developer Handover Document

Version: 3.0

Prepared By:
Raghavendra Singh

Project Status:
Pre-MVP

Current Milestone:
Search Complete

Audience:
Incoming Junior Developer

Purpose:
This document provides everything required for a new developer to continue development without requiring direct guidance from the founder.

---

# 1. Project Overview

Anubhav is a Personal Wisdom Preservation System.

The platform helps users:

* Capture experiences
* Extract lessons
* Preserve wisdom
* Retrieve insights later

Core Mission:

Capture experiences today.
Retrieve wisdom tomorrow.

The project is NOT:

* A notes app
* A journaling app
* A social network
* A productivity platform

The project IS:

A system for preserving and retrieving valuable life lessons.

---

# 2. Current Project State

## Product Status

Product Definition:
✅ Complete

MVP Scope:
✅ Complete

User Personas:
✅ Complete

Product Documentation:
✅ Complete

---

## Backend Status

Infrastructure:
✅ Complete

Database:
✅ Complete

Authentication:
✅ Complete

CRUD:
✅ Complete

Search:
✅ Complete

AI Extraction:
🚧 Next

Embeddings:
⏳ Pending

Semantic Search:
⏳ Pending

Reminders:
⏳ Pending

Frontend:
⏳ Pending

Deployment:
⏳ Pending

---

# 3. What Has Been Built

## Infrastructure

Configured:

* Docker
* PostgreSQL
* pgvector
* Turborepo

Environment starts successfully.

---

## Database

Tables:

* users
* anubhavs
* tags
* anubhav_tags
* reminders

All migrations are managed through Alembic.

---

## Authentication

Authentication provider:

Clerk

Implemented:

* JWT verification
* JWKS validation
* User auto-provisioning
* Protected routes

Reference endpoint:

GET /auth/me

Authentication is working correctly.

---

## CRUD

Implemented Endpoints:

* POST /anubhavs
* GET /anubhavs
* GET /anubhavs/{id}
* PATCH /anubhavs/{id}
* DELETE /anubhavs/{id}

Verified:

* User ownership
* Pagination
* Category filtering
* Tag normalization
* Cascade delete

CRUD is considered stable.

---

## Search

Implemented Endpoint:

GET /anubhavs/search

Verified Features:

* User-scoped search
* Keyword search
* Tag search
* Category filtering
* Pagination
* Case-insensitive matching

Validation:

10/10 search test cases passed.

Search is considered stable.

---

# 4. Current Database Model

Primary Entity:

Anubhav

Fields:

* id
* title
* situation
* observation
* lesson
* advice_to_future_self
* category
* source
* embedding
* user_id
* created_at
* updated_at

Relationships:

User → Many Anubhavs

Anubhav → Many Tags

Anubhav → Many Reminders

Do not modify the schema without approval.

---

# 5. Important Engineering Rules

Rule 1

Every protected endpoint must use:

Depends(get_current_user)

No exceptions.

---

Rule 2

Every query must be scoped to:

current_user.id

Users must never access another user's data.

---

Rule 3

Ownership violations return:

404

Not:

403

This prevents resource enumeration.

---

Rule 4

Keep architecture consistent:

Router
↓
Service
↓
Model

Business logic belongs in services.

---

Rule 5

Avoid unnecessary dependencies.

Prefer existing project patterns.

---

# 6. Current Sprint Goal

AI Lesson Extraction

Status:

Planning complete.

Implementation begins next development session.

---

# 7. AI Lesson Extraction

Objective:

Convert raw experiences into structured wisdom.

Recommended Endpoint:

POST /anubhavs/{id}/extract

Authentication:

Required

Ownership:

Required

Expected Output:

{
"lesson": "...",
"summary": "...",
"tags": ["...", "..."]
}

Example:

Input:

"I kept delaying opportunities because I never felt ready."

Expected Output:

Lesson:
Action creates confidence.

Summary:
Waiting for certainty often delays growth.

Tags:

* growth
* confidence
* career

Implementation:

OpenAI structured outputs.

Store:

* lesson
* summary
* tags

inside the database.

---

# 8. After AI Extraction

Implement Embeddings.

Model:

text-embedding-3-small

Dimensions:

1536

Store in:

anubhavs.embedding

Future semantic search depends on this.

---

# 9. After Embeddings

Implement Semantic Search.

Goal:

Search by meaning rather than exact words.

Example:

Query:

confidence

Should retrieve:

* action
* risk-taking
* growth

Even when exact keywords are absent.

---

# 10. Reminder System

Users can schedule reminders:

* 30 Days
* 6 Months
* 1 Year

Reminder fields:

* user_id
* anubhav_id
* trigger_at
* status

Email delivery can initially be mocked.

---

# 11. Frontend Requirements

Pages Needed:

* Authentication
* Dashboard
* Create Anubhav
* Timeline
* Search
* Settings

Priority:

Functionality first.

Visual polish later.

---

# 12. MVP Completion Criteria

A user must be able to:

1. Login
2. Create Anubhav
3. Edit Anubhav
4. Delete Anubhav
5. Search Anubhav
6. Receive AI-generated lessons
7. Set reminders
8. View timeline

When all eight are working:

MVP is complete.

---

# 13. Validation Goals

Do not build advanced features until:

* 50 Users
* 20 Entries Per User
* 1000 Total Entries

are achieved.

---

# 14. Explicitly Out of Scope

Do NOT build:

* Social Feed
* Likes
* Followers
* Comments
* Community Features
* AI Agents
* Voice Assistant
* Recommendation Feed
* Enterprise Features

These are intentionally deferred.

---

# 15. Known Lessons Learned

Lesson #1

Verify infrastructure before debugging application code.

Incident:

POST /anubhavs returned 500.

Root Cause:

PostgreSQL container stopped.

Resolution:

Restarted container.

---

Lesson #2

Authentication errors may indicate service identity problems rather than credential issues.

Incident:

password authentication failed for user "anubhav"

Root Cause:

Native Windows PostgreSQL service intercepted localhost:5432 connections.

Resolution:

Docker PostgreSQL moved to localhost:5433.

---

# 16. Success Definition

Success is not:

* More code
* More features
* More complexity

Success is:

A user captures an experience.

The lesson is preserved.

The lesson is retrieved later.

The user benefits from that experience.

That is the outcome the project is optimizing for.

---

# 17. Immediate Assignment

Priority 1

Implement AI Lesson Extraction.

Priority 2

Implement Embeddings.

Priority 3

Implement Semantic Search.

Priority 4

Implement Reminders.

Priority 5

Build Frontend.

Priority 6

Deploy MVP.

Follow existing patterns.

Avoid scope creep.

Keep implementation simple.

When uncertain:

Read README.md first.
