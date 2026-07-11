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

- Authentication
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

## Frontend

- Public Landing Page
- Sign In and Sign Up
- Interactive Wisdom World
- World-First Navigation
- Hover-Reveal World Sidebar
- Experience Dock
- Experiences
- Search
- Reflections
- Journey
- Settings
- Connected Wisdom Navigation

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

---

# 🏛 Architecture

```text
                    Public Landing Page
                             │
                     Sign Up / Sign In
                             │
                             ▼
                  World-First Experience
                             │
                     Interactive World
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

**Feature-Complete and Experience-Complete MVP**

Core product capabilities are implemented and integrated.

### Current Focus

- Authentication hardening
- Deployment readiness
- Production deployment
- User validation
- Performance optimization
- Product refinement

A known pre-deployment priority is graceful handling of expired authentication tokens.

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
| Authentication Hardening | 🚧 |
| Deployment | ⏳ |
| User Validation | ⏳ |

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

### Phase 7 — Deployment Readiness 🚧

Harden authentication, verify production configuration, optimize critical paths, and prepare the MVP for deployment.

### Phase 8 — User Validation ⏳

Validate the core product question with real users:

> **Will people consistently preserve experiences and revisit them when future situations make those lessons relevant?**

---

# 🚀 Getting Started

```bash
# Clone the repository
git clone <repository-url>

cd anubhav

# Start PostgreSQL + pgvector
docker compose up -d
```

### Backend

```bash
cd apps/api

pip install -r requirements.txt

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
- Junior Developer Handover
- Architecture and Engineering Decisions
- Sprint Reports
- Product and Validation Notes

The README intentionally remains a concise overview of the product and its current state.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*

> **Learn once. Benefit forever.**