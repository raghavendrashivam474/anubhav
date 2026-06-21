# ANUBHAV

# Junior Developer Handover Document

Version: 2.0

Prepared By:
Raghavendra Singh

Project Status:
Pre-MVP

Current Milestone:
CRUD Complete

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
🚧 Next

AI Extraction:
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

users

anubhavs

tags

anubhav_tags

reminders

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

POST /anubhavs

GET /anubhavs

GET /anubhavs/{id}

PATCH /anubhavs/{id}

DELETE /anubhavs/{id}

Verified:

* User ownership
* Pagination
* Category filtering
* Tag normalization
* Cascade delete

CRUD should be considered stable.

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

# 6. Immediate Task

Current Sprint Goal:

Search Functionality

Implement:

GET /anubhavs/search

---

# 7. Search Requirements

Features:

Keyword Search

Search Fields:

* title
* lesson
* observation
* advice_to_future_self

Tag Search

Category Filter

Pagination

User Scoping

---

Implementation Guidance

Use PostgreSQL ILIKE.

Do not implement semantic search yet.

Do not introduce Elasticsearch.

Do not introduce external search services.

Simple search is sufficient for MVP.

---

# 8. After Search

Next Task:

AI Lesson Extraction

---

Input Example

"My friend delayed every opportunity waiting to feel ready."

Expected Output

Lesson:

Action creates confidence.

Summary:

Waiting for certainty often delays growth.

Tags:

career
growth
opportunity

---

Requirements

Use OpenAI structured responses.

Store:

* lesson
* summary
* tags

in the database.

---

# 9. After AI Extraction

Implement Embeddings.

Model:

text-embedding-3-small

Dimensions:

1536

Store in:

anubhavs.embedding

Future semantic search depends on this.

---

# 10. After Embeddings

Implement Semantic Search.

Goal:

Search by meaning instead of exact words.

Example:

Query:

confidence

Should retrieve:

action
risk-taking
growth

Even when exact keywords are absent.

---

# 11. Reminder System

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

# 12. Frontend Requirements

Pages Needed

Authentication

Dashboard

Create Anubhav

Timeline

Search

Settings

Priority:

Functionality first.

Visual polish later.

---

# 13. MVP Completion Criteria

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

# 14. Validation Goals

Do not build advanced features until:

50 Users

20 Entries Per User

1000 Total Entries

are achieved.

---

# 15. Explicitly Out of Scope

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

# 16. Known Lessons Learned

Lesson #1

When debugging failures, verify infrastructure first.

During CRUD testing:

POST /anubhavs returned 500.

Root Cause:

PostgreSQL container had stopped.

Resolution:

Restarted via:

npm run db:up

Lesson:

Do not trust the layer mentioned in the error message.
Verify infrastructure first.

This lesson is stored inside Anubhav itself.

---

# 17. Success Definition

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

# 18. Your Immediate Assignment

Priority 1

Complete Search.

Priority 2

Complete AI Extraction.

Priority 3

Complete Embeddings.

Priority 4

Complete Reminders.

Priority 5

Build Frontend.

Priority 6

Deploy MVP.

Follow existing patterns.

Avoid scope creep.

Keep the implementation simple.

When uncertain, read:

README.md


and preserve alignment with the product mission.
