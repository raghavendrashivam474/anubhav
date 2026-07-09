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

Yet most of them disappear.

Not because they lack value.

Because they are forgotten.

Anubhav exists to preserve those lessons and make them available when they matter most.

---

# ✨ Features

## Intelligent Experience Capture

Capture meaningful experiences before they are forgotten.

---

## AI Wisdom Extraction

Transform raw experiences into structured knowledge through:

- Lessons
- Summaries
- Automatic tags

---

## Semantic Search

Search experiences by **meaning**, not only keywords.

Powered by vector embeddings using **pgvector**.

---

## Wisdom Relationship Graph

Automatically discover related experiences through semantic similarity.

Reveal recurring patterns, connected decisions, and repeated lessons.

---

## Reflection Engine

Surface relevant wisdom through:

- Daily reflections
- Scheduled reminders
- Forgotten experiences
- Related wisdom

---

## Interactive Wisdom World

Explore experiences inside an immersive world.

- Experiences become islands
- Categories become regions
- Relationships become pathways
- Reflections become discoveries

Instead of browsing notes, users explore accumulated wisdom.

---

# 🔄 Product Flow

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
Relationship Discovery
      ↓
Reflection
      ↓
Retrieval
      ↓
Better Decisions
```

---

# 🚀 Current MVP

## Backend

- Authentication
- CRUD Operations
- Keyword Search
- Semantic Search
- AI Lesson Extraction
- Embedding Generation
- Reminder System
- Reflection Engine
- Wisdom Relationship Graph

## Frontend

- Landing Page
- Authentication
- Experiences
- Search
- Reflections
- Journey
- Settings
- Interactive Wisdom World
- World-First Navigation
- Experience Dock

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
- Pydantic

## Database

- PostgreSQL 16
- pgvector

## AI

### Extraction

- Groq API
- Structured JSON outputs

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
                    Next.js Frontend
                           │
                           ▼
             World-First User Experience
                           │
                   Clerk Authentication
                           │
                           ▼
                    FastAPI Backend
                           │
      ┌────────────┬────────────┬────────────┐
      │            │            │
 Authentication   CRUD     Intelligence
                               │
      ┌────────────────────────┼───────────────────────┐
      │                        │                       │
Lesson Extraction       Embeddings        Reflection Engine
      │                        │                       │
      └───────────────┬────────┴───────────────┐
                      │                        │
          Relationship Graph          Search Services
                      │
                      ▼
             PostgreSQL + pgvector
```

---

# 📊 Project Status

**Current Stage**

✅ Feature-Complete MVP

Current focus:

- Deployment
- User validation
- Performance optimization
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
| World-First Experience | ✅ |
| Deployment | 🚧 |
| User Validation | ⏳ |

---

# 🎯 Product Principles

Every feature should strengthen one or more of these pillars:

- Capture
- Preservation
- Retrieval
- Application

If a feature improves none of them, it probably doesn't belong in Anubhav.

---

# 🛣 Roadmap

### Phase 1 — Experience Vault ✅

Capture and preserve experiences.

### Phase 2 — Wisdom Intelligence ✅

AI extraction, semantic search, embeddings.

### Phase 3 — Relationship Discovery ✅

Connected wisdom and similarity graph.

### Phase 4 — Reflection Engine ✅

Proactive wisdom resurfacing.

### Phase 5 — Interactive Wisdom World ✅

Explore wisdom spatially.

### Phase 6 — Deployment 🚧

Production deployment and performance optimization.

### Phase 7 — User Validation ⏳

Validate the product with real users before expanding the platform.

---

# 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/raghavendrashivam474/anubhav.git

cd anubhav

# Start infrastructure
docker compose up -d

# Backend
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ../web
npm install
npm run dev
```

---

# 📚 Documentation

Additional documentation is available in the `docs/` directory.

- Founder Bible
- Architecture Notes
- Junior Developer Handover
- Sprint Reports

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*

> **Learn once. Benefit forever.**