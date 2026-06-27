# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a Personal Wisdom Preservation System that helps people capture experiences, preserve life lessons, and retrieve meaningful wisdom when it becomes relevant.

Modern software excels at storing information.

**Anubhav is designed to preserve wisdom.**

It transforms raw experiences into structured, searchable, and retrievable knowledge, enabling people to benefit from lessons they've already earned instead of repeatedly paying the cost of relearning them.

---

# 🌍 Why Anubhav Exists

Every person accumulates valuable experiences throughout life.

* A failed interview
* A difficult relationship
* A startup mistake
* Advice from a mentor
* An important realization

These experiences often contain lessons that required significant time, effort, failure, or emotional cost to acquire.

Yet most of them disappear.

Not because they lack value.

Because they are forgotten.

As a result, people frequently:

* Repeat mistakes
* Forget important lessons
* Lose valuable insights
* Miss opportunities to learn from their own experiences

Anubhav exists to solve this problem.

---

# 💡 What Anubhav Does

Anubhav enables users to:

* Capture experiences quickly
* Extract meaningful lessons using AI
* Organize wisdom intelligently
* Preserve insights for the long term
* Retrieve relevant lessons when needed
* Build a personal wisdom archive over time

The goal is simple:

> **Learn once. Benefit forever.**

---

# 🔄 Core Product Loop

```text
Experience
      ↓
Capture
      ↓
AI Understanding
      ↓
Structured Wisdom
      ↓
Preservation
      ↓
Retrieval
      ↓
Better Decisions
```

Every feature in Anubhav strengthens this loop.

---

# 🚀 MVP Features

## Implemented

* Authentication
* Create, Edit & Delete Anubhavs
* Categories & Tags
* Keyword Search
* AI Lesson Extraction
* AI Summary Generation
* AI Tag Generation

## Planned

* Vector Embeddings
* Semantic Search
* Reminder System
* Timeline View
* Wisdom Recommendations
* Context-Aware Retrieval

## Explicitly Out of Scope

* Social Feed
* Community Platform
* Multi-Agent Systems
* Voice Companion
* Enterprise Features

These features are intentionally deferred until user behavior validates the core product loop.

---

# 🏗️ Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* FastAPI
* SQLAlchemy 2.0
* Pydantic v2

## Database

* PostgreSQL 16
* pgvector

## Infrastructure

* Docker
* Turborepo

## AI

* Groq API (current implementation)
* Provider-agnostic AI service architecture
* Structured JSON extraction
* Future embedding generation
* Semantic retrieval pipeline

---

# 📊 Current Project Status

## Current Stage

**Pre-MVP**

## Current Focus

Validate one fundamental question:

> **Will people consistently capture experiences and revisit them when making future decisions?**

## Validation Goal

* 50 Users
* 20 Entries Per User
* 1000 Total Anubhavs

Advanced AI capabilities will only be expanded after this milestone.

---

# 🎯 Product Principles

1. Capture should be effortless.
2. Retrieval is more important than storage.
3. Wisdom is more valuable than volume.
4. Privacy is non-negotiable.
5. Reflection over engagement.
6. Validate user behavior before building sophisticated AI.

---

# 📈 Build Progress

## ✅ Completed

### Product

* Product vision finalized
* MVP scope finalized
* User personas defined
* Validation strategy documented
* Product principles documented

### Infrastructure

* Turborepo monorepo
* Docker development environment
* PostgreSQL 16
* pgvector
* Local development environment

### Backend Foundation

* FastAPI
* Async SQLAlchemy
* AsyncPG
* Dependency Injection
* Pydantic Settings
* Swagger/OpenAPI
* Health endpoint (`/health`)

### Database

* Alembic migrations
* Version-controlled schema
* pgvector extension

Tables:

* users
* anubhavs
* tags
* anubhav_tags
* reminders
* alembic_version

### Authentication

* Clerk integration
* JWT verification
* JWKS validation
* User auto-provisioning
* Protected routes
* `/auth/me`

### CRUD

Implemented and verified:

* POST `/anubhavs`
* GET `/anubhavs`
* GET `/anubhavs/{id}`
* PATCH `/anubhavs/{id}`
* DELETE `/anubhavs/{id}`

Features:

* Ownership validation
* Pagination
* Category filtering
* Tag normalization
* Cascade delete
* User-scoped access

### Search

Implemented and validated:

* GET `/anubhavs/search`
* Keyword search
* Tag search
* Category filtering
* Pagination
* Case-insensitive matching

Validation:

* 10/10 search test cases passed
* Unauthorized access verified
* Pagination verified
* Tag-only matches verified
* Category filtering verified

### AI Lesson Extraction

Implemented:

* POST `/anubhavs/{id}/extract`
* Provider-agnostic AI service layer
* Structured JSON extraction
* Lesson generation
* Summary generation
* Automatic tag generation
* Ownership verification
* Re-extraction protection
* Database persistence

Validation:

* AI extraction verified
* Re-extraction returns 409 Conflict
* Unauthorized requests rejected
* Invalid IDs handled correctly

---

# 🚧 Current Sprint

## Embedding Generation

Goal:

Generate vector embeddings for every structured Anubhav and store them in PostgreSQL using pgvector.

This forms the foundation for semantic retrieval.

---

# ⏭️ Next

1. Embedding Generation
2. Semantic Search
3. Reminder System
4. Next.js Frontend
5. MVP Deployment
6. User Validation

---

# 📊 MVP Progress

| Module               | Status     |
| -------------------- | ---------- |
| Product Definition   | ✅ Complete |
| Infrastructure       | ✅ Complete |
| Database             | ✅ Complete |
| Authentication       | ✅ Complete |
| CRUD                 | ✅ Complete |
| Search               | ✅ Complete |
| AI Lesson Extraction | ✅ Complete |
| Embeddings           | 🚧 Next    |
| Semantic Search      | ⏳ Pending  |
| Reminders            | ⏳ Pending  |
| Frontend             | ⏳ Pending  |
| Deployment           | ⏳ Pending  |

### Overall Progress

Approximately **80% of the backend MVP** is complete.

Current operational workflow:

```text
Authentication
        ↓
Capture Experience
        ↓
Store
        ↓
AI Extraction
        ↓
Search
        ↓
Retrieve
```

---

# 🏛️ Architecture

```text
┌─────────────────────────────────────────────┐
│              Next.js Frontend               │
│                 (Planned)                   │
└──────────────────┬──────────────────────────┘
                   │
             HTTPS + Clerk JWT
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
│                                             │
│ Routers → Services → AI → Models            │
│ Async SQLAlchemy + JWT Verification         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         PostgreSQL 16 + pgvector            │
│                                             │
│ Users                                       │
│ Anubhavs                                    │
│ Tags                                        │
│ Reminders                                   │
│ Embeddings (vector 1536)                    │
└─────────────────────────────────────────────┘
```

---

# 🗂️ Repository Structure

```text
anubhav/
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── ai/
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   ├── alembic/
│   │   ├── main.py
│   │   └── requirements.txt
│   └── web/
├── infra/
├── packages/
├── docs/
├── .env.example
├── package.json
└── README.md
```

---

# 🧭 Product Roadmap

### Phase 1 — Experience Vault

Capture, organize, and preserve experiences.

### Phase 2 — Wisdom Retrieval

Search and retrieve structured lessons.

### Phase 3 — Semantic Intelligence

Meaning-based retrieval through embeddings.

### Phase 4 — Reflection Engine

Context-aware reminders and resurfacing.

### Phase 5 — Personal Wisdom Operating System

A lifelong companion that helps people make better decisions using their accumulated experiences.

---

# 🧠 Founder Note

Anubhav is not being built to compete with note-taking applications.

It is being built to answer a different question:

> **How can people preserve wisdom gained through experience?**

Every feature should improve at least one of:

* Capture
* Preservation
* Retrieval
* Application

If a feature does not strengthen these pillars, it should be reconsidered.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*
