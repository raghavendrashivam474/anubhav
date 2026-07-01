# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a **Personal Wisdom Preservation System** designed to help people capture experiences, preserve life lessons, and retrieve meaningful wisdom when it becomes relevant.

Modern software excels at storing information.

**Anubhav is designed to preserve wisdom.**

Rather than acting as another note-taking application, Anubhav transforms life experiences into structured, AI-enriched knowledge that can be searched, understood, and resurfaced when it matters most.

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
* Generate structured summaries
* Organize wisdom intelligently
* Preserve insights for the long term
* Retrieve relevant lessons through keyword and semantic search
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
Embedding Generation
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
* Automatic Embedding Generation

## In Progress

* Semantic Search

## Planned

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

## Artificial Intelligence

### Extraction

* Groq API
* Structured JSON Responses
* Provider-agnostic extraction service

### Embeddings

* sentence-transformers
* all-MiniLM-L6-v2
* Local inference
* 384-dimensional embeddings
* Provider-agnostic embedding service

---

# 📊 Current Project Status

## Current Stage

**Pre-MVP**

## Current Focus

Validate one fundamental question:

> **Will people consistently preserve experiences and revisit them when making future decisions?**

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
7. Keep AI providers replaceable.

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
* Vector migration (1536 → 384 dimensions)

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

* Keyword search
* Tag search
* Category filtering
* Pagination
* Case-insensitive matching

Validation:

* 10/10 test cases passed
* User scoping verified
* Unauthorized access verified
* Pagination verified
* Tag-only matching verified

### AI Lesson Extraction

Implemented:

* Structured lesson generation
* AI summaries
* Automatic tag generation
* Re-extraction protection
* Provider abstraction
* Graceful failure handling

### Embedding Generation

Implemented:

* Local embedding generation
* Automatic execution after extraction
* sentence-transformers integration
* all-MiniLM-L6-v2 model
* Vector(384) storage
* Automatic persistence
* Backfill support for existing records
* Graceful degradation if embedding generation fails

---

# 🚧 Current Sprint

## Semantic Search

Goal:

Retrieve relevant experiences based on semantic similarity instead of exact keyword matching.

Planned flow:

```text
User Query
      ↓
Generate Query Embedding
      ↓
Cosine Similarity (pgvector)
      ↓
Rank Results
      ↓
Return Most Relevant Wisdom
```

---

# ⏭️ Next

1. Semantic Search
2. Reminder System
3. Next.js Frontend
4. MVP Deployment
5. User Validation

---

# 📊 MVP Progress

| Module               | Status         |
| -------------------- | -------------- |
| Product Definition   | ✅ Complete     |
| Infrastructure       | ✅ Complete     |
| Database             | ✅ Complete     |
| Authentication       | ✅ Complete     |
| CRUD                 | ✅ Complete     |
| Keyword Search       | ✅ Complete     |
| AI Lesson Extraction | ✅ Complete     |
| Embedding Generation | ✅ Complete     |
| Semantic Search      | 🚧 In Progress |
| Reminder System      | ⏳ Pending      |
| Frontend             | ⏳ Pending      |
| Deployment           | ⏳ Pending      |

### Overall Progress

* **Backend MVP:** ~90% Complete
* **Overall MVP:** ~80% Complete

Current operational workflow:

```text
Authentication
        ↓
Capture Experience
        ↓
Store
        ↓
AI Lesson Extraction
        ↓
Embedding Generation
        ↓
Keyword Search
        ↓
Retrieve
```

---

# 🏛️ Architecture

```text
┌─────────────────────────────────────────────┐
│             Next.js Frontend                │
│               (Planned)                     │
└──────────────────┬──────────────────────────┘
                   │
             HTTPS + Clerk JWT
                   ▼
┌─────────────────────────────────────────────┐
│             FastAPI Backend                 │
│                                             │
│ Routers → Services → AI → Models            │
│                                             │
│ • Authentication                            │
│ • CRUD                                      │
│ • Search                                    │
│ • AI Extraction                             │
│ • Embedding Generation                      │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│        PostgreSQL 16 + pgvector             │
│                                             │
│ Users                                       │
│ Anubhavs                                    │
│ Tags                                        │
│ Reminders                                   │
│ Embeddings (Vector 384)                     │
└─────────────────────────────────────────────┘
```

---

# 🗂️ Repository Structure

```text
anubhav/
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── ai/
│   │   ├── alembic/
│   │   ├── main.py
│   │   └── requirements.txt
│   └── web/
├── docs/
├── infra/
├── packages/
├── .env.example
├── package.json
└── README.md
```

---

# 🧭 Product Roadmap

### Phase 1 — Experience Vault

Capture and preserve experiences.

### Phase 2 — Wisdom Retrieval

Keyword search and AI-assisted retrieval.

### Phase 3 — Semantic Intelligence

Meaning-based retrieval using vector embeddings.

### Phase 4 — Reflection Engine

Reminders, resurfacing, and context-aware insights.

### Phase 5 — Personal Wisdom Operating System

A lifelong companion that helps people make better decisions using accumulated experiences.

---

# 🧠 Founder Note

Anubhav is not being built to compete with note-taking applications.

It is being built to answer a different question:

> **How can people preserve wisdom gained through experience?**

Every feature should strengthen one or more of these pillars:

* Capture
* Preservation
* Retrieval
* Application

If a feature does not improve these pillars, it should be reconsidered.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*
