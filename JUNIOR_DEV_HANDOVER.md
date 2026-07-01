# ANUBHAV

# Junior Developer Handover Document

**Version:** 4.0

**Prepared By:**
Raghavendra Singh

**Project Status:**
Pre-MVP

**Current Milestone:**
Embedding Generation Complete

**Audience:**
Incoming Junior Developer

**Purpose:**
This document enables any incoming developer to continue implementation with minimal onboarding time while preserving the project's architecture, engineering practices, and product direction.

---

# 1. Project Overview

Anubhav is a **Personal Wisdom Preservation System**.

Unlike traditional note-taking or journaling applications, Anubhav focuses on helping users preserve valuable life experiences and transform them into retrievable wisdom.

The platform enables users to:

* Capture experiences
* Extract structured lessons using AI
* Generate summaries and tags
* Preserve knowledge
* Retrieve relevant wisdom through keyword and semantic search

## Core Mission

> **Capture experiences today. Retrieve wisdom tomorrow.**

The project is **NOT**:

* A notes application
* A journaling application
* A productivity platform
* A social network

The project **IS**:

A system for preserving, organizing, and retrieving valuable life lessons.

---

# 2. Current Project Status

## Product

| Area                  | Status     |
| --------------------- | ---------- |
| Product Definition    | ✅ Complete |
| MVP Scope             | ✅ Complete |
| User Personas         | ✅ Complete |
| Product Documentation | ✅ Complete |

---

## Backend

| Module               | Status         |
| -------------------- | -------------- |
| Infrastructure       | ✅ Complete     |
| Database             | ✅ Complete     |
| Authentication       | ✅ Complete     |
| CRUD                 | ✅ Complete     |
| Keyword Search       | ✅ Complete     |
| AI Lesson Extraction | ✅ Complete     |
| Embedding Generation | ✅ Complete     |
| Semantic Search      | 🚧 Next Sprint |
| Reminder System      | ⏳ Pending      |
| Frontend             | ⏳ Pending      |
| Deployment           | ⏳ Pending      |

---

# 3. What Has Been Built

## Infrastructure

Configured and verified:

* Docker
* PostgreSQL 16
* pgvector
* Turborepo

Development environment is stable.

---

## Database

Current tables:

* users
* anubhavs
* tags
* anubhav_tags
* reminders
* alembic_version

All schema changes are managed through Alembic migrations.

Current embedding column:

```text
Vector(384)
```

---

## Authentication

Provider:

**Clerk**

Implemented:

* JWT verification
* JWKS validation
* User auto-provisioning
* Protected endpoints
* `/auth/me`

Authentication is considered stable.

---

## CRUD

Implemented endpoints:

* POST `/anubhavs`
* GET `/anubhavs`
* GET `/anubhavs/{id}`
* PATCH `/anubhavs/{id}`
* DELETE `/anubhavs/{id}`

Verified features:

* Ownership validation
* Pagination
* Category filtering
* Tag normalization
* Cascade delete
* User-scoped access

CRUD is production-ready for MVP.

---

## Search

Endpoint:

```text
GET /anubhavs/search
```

Features:

* Keyword search
* Tag search
* Category filtering
* Pagination
* Case-insensitive matching

Validation:

* 10/10 documented test cases passed.

Search is considered complete.

---

## AI Lesson Extraction

Endpoint:

```text
POST /anubhavs/{id}/extract
```

Implemented:

* Groq integration
* Structured JSON extraction
* Lesson generation
* Summary generation
* Automatic tag generation
* Provider abstraction
* Re-extraction protection (409 Conflict)
* Graceful error handling

Extraction is complete and stable.

---

## Embedding Generation

Implemented:

* Local embedding model (`sentence-transformers`)
* `all-MiniLM-L6-v2`
* Automatic execution after successful extraction
* Provider-agnostic embedding service
* Automatic persistence to PostgreSQL
* Existing record backfill support

Current embedding dimension:

```text
384
```

Embedding generation is complete.

---

# 4. Current Database Model

Primary Entity:

**Anubhav**

Important fields:

* id
* what_happened
* lesson
* summary
* advice
* category
* source
* embedding (Vector 384)
* user_id
* created_at
* updated_at

Relationships:

* User → Many Anubhavs
* Anubhav → Many Tags
* Anubhav → Many Reminders

Do not modify the schema without approval.

---

# 5. Engineering Rules

### Rule 1

Every protected endpoint must use:

```python
Depends(get_current_user)
```

---

### Rule 2

Every database query must be scoped to:

```python
current_user.id
```

Never expose another user's data.

---

### Rule 3

Ownership violations return:

```text
404
```

Never return `403`.

This prevents resource enumeration.

---

### Rule 4

Maintain architecture:

```text
Router
   ↓
Service
   ↓
Model
```

Business logic belongs only inside services.

---

### Rule 5

AI providers must remain replaceable.

Routers and business logic must never depend directly on Groq or the embedding library.

---

### Rule 6

Failures in optional AI components must never prevent the primary workflow from succeeding.

Graceful degradation is preferred over rollback.

---

# 6. Current Sprint Goal

## Semantic Search

Implement semantic retrieval using stored pgvector embeddings.

Current database already contains embeddings for all extracted Anubhavs.

No additional schema changes are expected.

---

# 7. Semantic Search Requirements

Proposed endpoint:

```text
GET /anubhavs/semantic-search?q=...
```

Workflow:

```text
User Query
        ↓
Generate Query Embedding
        ↓
Cosine Similarity Search
        ↓
Rank Results
        ↓
Return Most Relevant Anubhavs
```

Requirements:

* User-scoped
* Cosine similarity
* Ranking by similarity score
* Pagination
* Graceful error handling

Do not replace keyword search.

Semantic search should exist alongside keyword search.

---

# 8. Reminder System

After semantic search, implement reminders.

Reminder intervals:

* 30 Days
* 6 Months
* 1 Year

Email delivery may initially be mocked.

---

# 9. Frontend Requirements

Planned pages:

* Authentication
* Dashboard
* Create Anubhav
* Timeline
* Search
* Semantic Search
* Settings

Priority:

Functionality first.

Visual refinement later.

---

# 10. MVP Completion Criteria

A user should be able to:

1. Authenticate
2. Capture an experience
3. Edit experiences
4. Delete experiences
5. Search by keyword
6. Search semantically
7. Receive AI-generated lessons
8. Generate embeddings automatically
9. Set reminders
10. Browse a timeline

Once these capabilities are complete, the backend MVP is feature-complete.

---

# 11. Validation Goals

Do **not** expand scope until the product demonstrates usage.

Target:

* 50 Users
* 20 Entries per User
* 1000 Total Anubhavs

Only after reaching this milestone should advanced AI features be considered.

---

# 12. Explicitly Out of Scope

Do not implement:

* Social Feed
* Likes
* Comments
* Followers
* Community Features
* Multi-Agent Systems
* Voice Assistant
* Enterprise Features
* Recommendation Feed

These are intentionally deferred.

---

# 13. Engineering Lessons Learned

### Lesson 1

Always verify infrastructure before debugging application code.

---

### Lesson 2

Authentication failures may indicate service identity problems rather than invalid credentials.

---

### Lesson 3

Do not rely on Alembic autogeneration for pgvector dimension changes.

Write vector migrations manually.

---

### Lesson 4

Async FastAPI applications should never execute synchronous SDK calls directly.

Wrap synchronous work in a thread executor.

---

### Lesson 5

Keep AI providers interchangeable.

Business logic should depend on service abstractions, not vendor SDKs.

---

### Lesson 6

Historical data must be migrated whenever new derived fields (such as embeddings) are introduced.

Backfill is part of the implementation—not an afterthought.

---

# 14. Success Definition

Success is **not** measured by:

* More code
* More features
* More AI

Success is measured by one outcome:

A user captures an experience.

The system preserves its wisdom.

The system resurfaces that wisdom at the right time.

The user makes a better decision because of it.

Everything in Anubhav exists to support that outcome.

---

# 15. Immediate Assignment

Priority 1

Implement Semantic Search.

Priority 2

Implement Reminder System.

Priority 3

Develop the Next.js frontend.

Priority 4

Deploy the MVP.

Priority 5

Begin user validation.

Before implementing any feature:

1. Read `README.md`.
2. Follow existing architectural patterns.
3. Avoid unnecessary dependencies.
4. Preserve provider-agnostic design.
5. Keep implementation simple.
6. Prevent scope creep.
