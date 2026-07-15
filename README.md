# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a **Personal Wisdom Preservation System** that helps people capture life experiences, transform them into structured wisdom using AI, and rediscover those lessons when they become relevant again.

Instead of becoming another note-taking or journaling application, Anubhav focuses on one problem:

> **People spend years earning wisdom but often lose it because memory fades.**

The long-term vision is simple:

> **Learn once. Benefit forever.**

---

# 🌍 Why Anubhav?

Everyone accumulates valuable experiences throughout life.

- A failed interview
- A startup mistake
- A difficult relationship
- Advice from a mentor
- An important realization
- A career breakthrough

These experiences often contain lessons that required significant time, effort, sacrifice, or failure to acquire.

Yet most disappear.

Not because they lack value.

Because they are forgotten.

Anubhav exists to preserve those lessons and make them available when they matter most.

---

# ✨ Features

## Intelligent Experience Capture

Capture meaningful experiences before they are forgotten.

## AI Wisdom Extraction

Transform raw experiences into structured wisdom through:

- Lessons
- Summaries
- Automatic tags

## Semantic Search

Search experiences by **meaning**, not only exact keywords.

Vector embeddings and pgvector enable semantic retrieval across accumulated experiences.

## Wisdom Relationship Graph

Automatically discover semantically related experiences.

Reveal recurring patterns, connected decisions, similar lessons, and repeated mistakes.

## Reflection Engine

Proactively resurface wisdom through:

- Daily reflections
- Scheduled reminders
- Forgotten experiences
- Related wisdom

## Interactive Wisdom World

Explore accumulated experiences inside an immersive spatial world.

- Experiences become islands
- Categories become regions
- Relationships become pathways
- Reflections guide rediscovery

A force-directed layout combines semantic relationship attraction, category gravity, and island repulsion to organize the world automatically.

The Wisdom World is the primary authenticated experience of Anubhav.

Instead of navigating pages of notes, users explore their accumulated wisdom.

---

# 🔄 Product Flow

```text
Public Landing Page
        ↓
Sign Up / Sign In
        ↓
Wisdom World
        ↓
Capture Experience
        ↓
AI Understanding
        ↓
Structured Wisdom
        ↓
Embedding Generation
        ↓
Relationship Discovery
        ↓
Reflection & Retrieval
        ↓
Better Decisions
```

The landing page is Anubhav's public front door.

The Wisdom World is the authenticated home.

---

# 🚀 Current MVP

## Backend

- JWT Authentication
- Experience CRUD
- Categories and Tags
- Keyword Search
- Semantic Search
- AI Lesson Extraction
- AI Summary Generation
- Automatic Tag Generation
- Local Embedding Generation
- Reminder System
- Reflection Engine
- Wisdom Relationship Graph
- Health Monitoring
- Centralized Application Logging

## Frontend

- Public Landing Page
- Sign In and Sign Up
- Interactive Wisdom World
- World-First Navigation
- Hover-Reveal World Sidebar
- Force-Directed Island Layout
- Experience Dock
- Experiences
- Search
- Daily Reflections
- Reminder Management
- Journey
- Settings
- Connected Wisdom Navigation
- Explicit World Recovery States
- Backend Availability Awareness

## Reliability

- Centralized authentication lifecycle
- Global expired-session handling
- API failure classification
- World loading and recovery states
- Reactive backend health checks
- Environment configuration audit
- Migration lifecycle verification
- Production startup verification
- Reproducible critical-path smoke validation

---

# 🏗 Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- FastAPI
- SQLAlchemy 2.0
- AsyncPG
- Pydantic v2

## Database

- PostgreSQL 16
- pgvector

## Artificial Intelligence

### Wisdom Extraction

- Groq API
- Structured JSON outputs
- Provider-agnostic extraction architecture

### Embeddings

- sentence-transformers
- all-MiniLM-L6-v2
- Local inference
- 384-dimensional vectors

## Infrastructure

- Docker
- Turborepo
- Alembic

---

# 🏛 Architecture

```text
                    Public Landing Page
                             │
                     Sign Up / Sign In
                             │
                             ▼
                  Authentication Lifecycle
                             │
                             ▼
                  World-First Experience
                             │
                     Interactive World
                             │
                             ▼
                       API Client Layer
                             │
                  Failure Classification
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       Success              401          Recoverable Error
          │                  │                  │
       Continue       Session Recovery      UI Recovery
          │                                     │
          └──────────────────┬──────────────────┘
                             │
                             ▼
                      FastAPI Backend
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
Authentication            CRUD               Intelligence
                                                   │
          ┌────────────────┼────────────────┬───────┐
          │                │                │       │
 AI Lesson Extraction  Embeddings      Reflection  Search
          │                │             Engine    Services
          └────────────────┴──────────┬─────────────┘
                                     │
                         Relationship Discovery
                                     │
                                     ▼
                         PostgreSQL + pgvector
```

---

# 📊 Project Status

## Current Stage

**Deployment-Ready MVP**

The core product, frontend experience, intelligence systems, and reliability layer are implemented and integrated.

Sprint 17 completed deployment-readiness validation with:

```text
33 Smoke Tests
33 Passed
0 Failed
```

Verified areas include:

- Infrastructure
- Authentication
- Experience CRUD
- AI extraction
- Embedding persistence
- Keyword and semantic retrieval
- Relationship discovery
- World rendering
- Reflection workflows
- Session failure handling
- Backend outage recovery

### Current Focus

- Production security configuration
- Production deployment
- Minor pre-deploy polish
- User validation
- Performance observation
- Product refinement

---

# 📈 MVP Progress

| Module | Status |
|---------|--------|
| Product Definition | ✅ |
| Infrastructure | ✅ |
| Authentication | ✅ |
| CRUD | ✅ |
| AI Extraction | ✅ |
| Semantic Search | ✅ |
| Embedding Generation | ✅ |
| Reminder System | ✅ |
| Reflection Engine | ✅ |
| Relationship Graph | ✅ |
| Interactive Wisdom World | ✅ |
| Unified Experience Layer | ✅ |
| World-First Experience | ✅ |
| Public/Auth Routing Flow | ✅ |
| Authentication Hardening | ✅ |
| API Failure Recovery | ✅ |
| World Recovery States | ✅ |
| Environment Audit | ✅ |
| Startup Verification | ✅ |
| Critical-Path Validation | ✅ |
| Production Deployment | 🚧 |
| User Validation | ⏳ |

---

# 🧪 Deployment Readiness

The verified application startup lifecycle is:

```text
PostgreSQL
      ↓
pgvector
      ↓
Alembic Migrations
      ↓
FastAPI
      ↓
Health Verification
      ↓
Next.js Frontend
      ↓
Application Ready
```

Current migration state has been verified with a single Alembic head and an idempotent `upgrade head` lifecycle.

The critical Anubhav product path has also been smoke-tested end to end:

```text
Authentication
      ↓
Capture Experience
      ↓
AI Extraction
      ↓
Embedding Persistence
      ↓
Semantic Retrieval
      ↓
Relationship Discovery
      ↓
Wisdom World
      ↓
Reflection
      ↓
Failure Recovery
```

A reproducible Sprint 17 smoke-validation script is maintained under `scripts/`.

---

# 🎯 Product Principles

Every feature should strengthen one or more of these pillars:

- Capture
- Preservation
- Retrieval
- Application

If a feature strengthens none of them, it probably does not belong in Anubhav.

Additional engineering principles:

- Privacy is non-negotiable.
- Retrieval matters more than storage.
- Reflection matters more than engagement.
- Validate behavior before sophistication.
- AI providers should remain replaceable.
- Prefer architectural evolution over unnecessary rewrites.
- Reliability is part of the product experience.

---

# 🛣 Roadmap

### Phase 1 — Experience Vault ✅

Capture and preserve experiences.

### Phase 2 — Wisdom Intelligence ✅

AI extraction, embeddings, and semantic retrieval.

### Phase 3 — Relationship Discovery ✅

Discover connected wisdom through semantic similarity.

### Phase 4 — Reflection Engine ✅

Proactively resurface relevant and forgotten wisdom.

### Phase 5 — Interactive Wisdom World ✅

Transform accumulated experiences into an explorable spatial world.

### Phase 6 — World-First Experience ✅

Make the Wisdom World the primary authenticated home while preserving traditional interfaces as supporting tools.

### Phase 7 — Deployment Readiness ✅

Harden authentication, classify API failures, introduce World recovery states, verify environment configuration, validate migrations, and smoke-test the critical product path.

### Phase 8 — Production Deployment 🚧

Secure production configuration, deploy infrastructure and application services, and verify the live product lifecycle.

### Phase 9 — User Validation ⏳

Validate the core product question with real users:

> **Will people consistently preserve experiences and revisit them when future situations make those lessons relevant?**

---

# 🚀 Getting Started

```bash
# Clone the repository
git clone <repository-url>

cd anubhav
```

Locate and start the Docker Compose infrastructure:

```bash
docker compose up -d
```

### Backend

```bash
cd apps/api

pip install -r requirements.txt

alembic upgrade head

uvicorn main:app --reload
```

### Frontend

```bash
cd apps/web

npm install

npm run dev
```

The local application flow is:

```text
/
↓
Landing Page
↓
/sign-up or /sign-in
↓
/world
```

---

# 📚 Documentation

Detailed project documentation is maintained separately from the README.

Documentation includes:

- Founder Handover & Product Continuity Bible
- Junior Developer Handovers
- Architecture and Engineering Decisions
- Sprint Reports
- Deployment Readiness Reports
- Product and Validation Notes

Sprint 17 also introduced a reproducible critical-path smoke-validation workflow for future regression testing.

The README intentionally remains a concise overview of the product and its current state.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*

> **Learn once. Benefit forever.**