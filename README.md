# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a Personal Wisdom Preservation System designed to help people capture experiences, lessons, observations, and insights before they are forgotten.

Modern tools help us store information.

Anubhav helps us preserve wisdom.

The platform transforms life experiences into structured, searchable, and retrievable knowledge that can be surfaced when it becomes relevant in the future.

---

## 🌍 Why Anubhav Exists

Every person accumulates valuable experiences throughout life.

A failed interview.

A difficult relationship.

A startup mistake.

Advice from a mentor.

An important realization.

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

## 💡 What Anubhav Does

Anubhav enables users to:

* Capture experiences quickly
* Extract meaningful lessons
* Organize wisdom intelligently
* Preserve insights long-term
* Retrieve relevant lessons when needed
* Build a personal wisdom archive over time

The goal is simple:

> Learn once. Benefit forever.

---

## 🔄 Core Product Loop

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

## 🚀 MVP Features

### Included

* Authentication
* Create, Edit, Delete Anubhavs
* Categories & Tags
* Search
* AI Lesson Extraction
* Reminders
* Timeline View

### Planned

* Semantic Search
* Wisdom Recommendations
* Context-Aware Retrieval
* Decision Assistance

### Explicitly Out of Scope

* Social Feed
* Community Platform
* Multi-Agent Systems
* Voice Companion
* Enterprise Features

These features will only be considered after user validation.

---

## 🏗️ Technology Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS
* shadcn/ui

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL
* pgvector

### Infrastructure

* Docker
* Turborepo

### AI

* OpenAI Embeddings
* Semantic Retrieval
* Lesson Extraction Pipelines

---

## 📊 Project Status

### Current Stage

Pre-MVP Development

### Current Focus

Validate a single question:

> Will people consistently preserve experiences and return to retrieve them?

### Validation Goal

* 50 Users
* 20 Entries Per User
* 1000 Total Anubhavs

Advanced AI features will only be developed after this milestone is achieved.

---

## 🧭 Product Vision

### Phase 1

Experience Vault

### Phase 2

Wisdom Retrieval Engine

### Phase 3

Decision Assistant

### Phase 4

Personal Wisdom Operating System

### Long-Term Vision

Intergenerational Wisdom Network

A future where valuable experiences can outlive memory and continue helping people across years, generations, and communities.

---

## 🎯 Product Principles

1. Capture should be effortless.
2. Retrieval is more important than storage.
3. Wisdom is more valuable than volume.
4. Privacy is non-negotiable.
5. Reflection is preferred over engagement addiction.

These principles guide all product decisions.

---
---

## 📊 Build Progress

### ✅ Completed
- Strategic foundation (vision, scope, validation strategy)
- Monorepo setup (Turborepo + npm workspaces)
- Local infrastructure (Docker + PostgreSQL 16 + pgvector)
- FastAPI backend (async SQLAlchemy 2.0 + asyncpg)
- Database schema with 6 tables (Alembic migrations)
- Health endpoint (`/health`) — verified end-to-end
- Clerk authentication (JWT verification via JWKS + auto-user provisioning)
- Protected `/auth/me` endpoint — first authenticated user confirmed in DB

### 🚧 In Progress / Next
- Anubhav CRUD endpoints (create, list, get, update, delete)
- Keyword search
- AI lesson extraction (OpenAI)
- Embedding generation + semantic search
- Reminder system + notifications
- Next.js frontend with Clerk sign-in

---

## 🏛️ Architecture

```text
┌─────────────────────────────────────────────┐
│              Client (Next.js)               │  — planned
└──────────────────┬──────────────────────────┘
                   │ HTTPS + Clerk JWT
                   ▼
┌─────────────────────────────────────────────┐
│            FastAPI Backend                  │
│  Routers → Services → Models                │
│  Async SQLAlchemy + Clerk JWT verification  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│       PostgreSQL 16 + pgvector              │
│  Users · Anubhavs · Tags · Reminders        │
│  (vector(1536) column ready for AI search)  │
└─────────────────────────────────────────────┘

🗂️ Repository Structure

anubhav/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── app/
│   │   │   ├── core/           # Settings, DB, Auth
│   │   │   ├── models/         # SQLAlchemy ORM
│   │   │   ├── routers/        # API endpoints
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   └── services/       # Business logic
│   │   ├── alembic/            # DB migrations
│   │   ├── main.py
│   │   └── requirements.txt
│   └── web/                    # Next.js frontend (planned)
├── infra/
│   └── docker-compose.yml      # Postgres + pgvector
├── packages/                   # Shared packages (future)
├── package.json                # Turborepo root
└── README.md


## 🧠 Founder Note

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

## 👤 Founder

**Raghavendra Singh**

Building systems that help people remember what matters.
