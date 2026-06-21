# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a Personal Wisdom Preservation System designed to help people capture experiences, lessons, observations, and insights before they are forgotten.

Modern tools help us store information.

**Anubhav helps us preserve wisdom.**

The platform transforms life experiences into structured, searchable, and retrievable knowledge that can be surfaced when it becomes relevant in the future.

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
* Extract meaningful lessons
* Organize wisdom intelligently
* Preserve insights long-term
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
Categorization
    ↓
Preservation
    ↓
Retrieval
    ↓
Better Decisions
```

Every feature in Anubhav is designed to strengthen this loop.

---

# 🚀 MVP Features

## Included

* Authentication
* Create, Edit, Delete Anubhavs
* Categories & Tags
* Search
* AI Lesson Extraction
* Reminders
* Timeline View

## Planned

* Semantic Search
* Wisdom Recommendations
* Context-Aware Retrieval
* Decision Assistance

## Explicitly Out of Scope

* Social Feed
* Community Platform
* Multi-Agent Systems
* Voice Companion
* Enterprise Features

These features will only be considered after user validation.

---

# 🏗️ Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* FastAPI
* SQLAlchemy
* Pydantic

## Database

* PostgreSQL
* pgvector

## Infrastructure

* Docker
* Turborepo

## AI

* OpenAI
* Embeddings
* Lesson Extraction
* Semantic Retrieval

---

# 📊 Project Status

## Current Stage

Pre-MVP Development

## Current Focus

Validate a single question:

> Will people consistently preserve experiences and return to retrieve them?

## Validation Goal

* 50 Users
* 20 Entries Per User
* 1000 Total Anubhavs

Advanced AI features will only be developed after this milestone is achieved.

---

# 🎯 Product Principles

1. Capture should be effortless.
2. Retrieval is more important than storage.
3. Wisdom is more valuable than volume.
4. Privacy is non-negotiable.
5. Reflection is preferred over engagement addiction.

These principles guide all product decisions.

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

* Turborepo monorepo setup
* Docker development environment
* PostgreSQL 16 configured
* pgvector extension enabled

### Backend Foundation

* FastAPI application setup
* Async SQLAlchemy 2.0
* AsyncPG integration
* Pydantic settings
* Swagger documentation
* Health endpoint (`/health`)

### Database

* Alembic migrations configured
* Initial schema migrated
* pgvector extension version-controlled

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
* `/auth/me` endpoint

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

### Validation

* First authenticated user persisted
* First real Anubhav stored
* End-to-end API verification completed

---

## 🚧 In Progress

### Search

Current implementation:

* User-scoped keyword search
* ILIKE search
* Category filtering

Testing and validation ongoing.

---

## ⏭️ Next

1. AI Lesson Extraction
2. Embedding Generation
3. Semantic Search
4. Reminder System
5. Frontend Development
6. MVP Deployment

---

# 🏛️ Architecture

```text
┌─────────────────────────────────────────────┐
│              Next.js Frontend               │
│          (Planned / In Development)         │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS + Clerk JWT
                   ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
│                                             │
│ Routers → Services → Models                 │
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
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   ├── alembic/
│   │   ├── main.py
│   │   └── requirements.txt
│   │
│   └── web/
│       └── (Next.js frontend)
│
├── infra/
│   └── docker-compose.yml
│
├── packages/
│
├── docs/
│   └── JUNIOR_DEV_HANDOVER.md
│
├── .env.example
│
├── package.json
│
└── README.md
```

---

# 🧭 Product Roadmap

## Phase 1

Experience Vault

## Phase 2

Wisdom Retrieval Engine

## Phase 3

Decision Assistant

## Phase 4

Personal Wisdom Operating System

## Long-Term Vision

Intergenerational Wisdom Network

A future where valuable experiences can outlive memory and continue helping people across years, generations, and communities.

---

# 🧠 Founder Note

Anubhav is not being built to compete with note-taking applications.

It is being built to answer a different question:

> How can people preserve wisdom gained through experience?

Every future feature must improve one or more of the following:

* Capture
* Preservation
* Retrieval
* Application

If a feature does not contribute to these goals, it should be reconsidered.

---

# 👤 Founder

**Raghavendra Singh**

Building systems that help people remember what matters.
