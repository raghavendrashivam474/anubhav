# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a **Personal Wisdom Preservation System** that helps people transform life experiences into structured, searchable, interconnected, and retrievable wisdom.

Modern software excels at storing information.

**Anubhav is built to preserve wisdom.**

Rather than becoming another note-taking or journaling application, Anubhav captures experiences, extracts lessons using Artificial Intelligence, discovers relationships between them, resurfaces meaningful reflections, and enables users to explore their accumulated wisdom through an interactive world.

The long-term vision is simple:

> **Help people stop relearning the lessons they have already paid to acquire.**

---

# 🌍 Why Anubhav Exists

Every person accumulates valuable experiences throughout life.

- A failed interview
- A difficult relationship
- A startup mistake
- Advice from a mentor
- An important realization
- A difficult decision
- A career breakthrough
- A financial lesson

Many of these experiences contain wisdom that required significant time, effort, sacrifice, failure, or emotional cost to acquire.

Yet most of those lessons slowly disappear.

Not because they lack value.

Because memory fades.

As a result, people repeatedly:

- Repeat the same mistakes
- Forget valuable lessons
- Lose meaningful insights
- Miss opportunities to learn from themselves
- Rebuild knowledge they once possessed

Modern software preserves information.

Anubhav aims to preserve **wisdom**.

---

# 💡 What Anubhav Does

Anubhav enables users to:

- Capture experiences quickly
- Extract lessons using AI
- Generate structured summaries
- Automatically organize knowledge
- Generate semantic embeddings
- Discover relationships between experiences
- Retrieve wisdom through keyword search
- Retrieve wisdom through semantic understanding
- Surface meaningful reflections
- Explore accumulated experiences inside an interactive world

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
Relationship Discovery
      ↓
Reflection
      ↓
Preservation
      ↓
Retrieval
      ↓
Better Decisions
```

Every feature in Anubhav strengthens one or more stages of this loop.

---

# ✨ Core Capabilities

## Intelligent Experience Capture

Capture experiences before they are forgotten.

Instead of storing random notes, every experience becomes structured knowledge.

---

## AI Wisdom Extraction

Artificial Intelligence automatically extracts:

- Lessons
- Summaries
- Contextual tags

This converts raw experiences into meaningful, searchable wisdom.

---

## Semantic Understanding

Every extracted experience is converted into a vector embedding using a local embedding model.

This enables searching by **meaning**, not just exact words.

---

## Relationship Discovery

Anubhav automatically discovers related experiences based on semantic similarity.

Users can explore:

- Similar lessons
- Connected mistakes
- Related decisions
- Recurring patterns

instead of isolated entries.

---

## Reflection Engine

Rather than waiting for users to search manually, Anubhav proactively resurfaces meaningful wisdom.

Reflections may originate from:

- Scheduled reminders
- Similar situations
- Forgotten experiences
- Related wisdom
- Daily reflection prompts

The objective is simple:

Surface the right lesson at the right time.

---

## Interactive Wisdom World

Instead of navigating endless lists of notes, users explore their accumulated wisdom spatially.

Experiences become islands.

Categories become regions.

Relationships become navigable pathways.

The result is a world that users can explore rather than merely browse.

---

# 🚀 Current MVP Features

## Backend

- Authentication
- CRUD Operations
- Categories & Tags
- Keyword Search
- Semantic Search
- AI Lesson Extraction
- AI Summary Generation
- AI Tag Generation
- Automatic Embedding Generation
- Reminder System
- Wisdom Relationship Graph
- Reflection Engine

---

## Frontend

- Landing Page
- Authentication
- Wisdom Space Dashboard
- Experiences
- Search
- Journey
- Reflections
- Settings
- Interactive Wisdom World
- Reflection Integration
- Experience Dock
- Connected Wisdom Navigation

---

## Artificial Intelligence

### Wisdom Extraction

- Structured lesson generation
- Summary generation
- Automatic tagging

### Semantic Intelligence

- Local embedding generation
- Semantic retrieval
- Relationship discovery
- Reflection generation

---

# 🏗 Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Backend

- FastAPI
- SQLAlchemy 2.0
- AsyncPG
- Pydantic v2

---

## Database

- PostgreSQL 16
- pgvector

---

## Infrastructure

- Docker
- Turborepo

---

## Artificial Intelligence

### Wisdom Extraction

- Groq API
- Structured JSON Outputs
- Provider-agnostic architecture

### Embeddings

- sentence-transformers
- all-MiniLM-L6-v2
- Local inference
- 384-dimensional vectors

---

# 📊 Current Project Status

## Current Stage

**Feature-Complete & Integration-Complete MVP**

Current development is now focused on polishing the product experience, deployment, and validating the core hypothesis with real users.

### Current Priorities

- World-First Experience
- Deployment
- Performance Optimization
- User Validation
- Product Refinement

### Validation Goals

Before introducing major new capabilities, Anubhav aims to validate the core product with:

- 50 Active Users
- 20 Experiences per User
- 1000 Total Experiences

Only after reaching this milestone will advanced AI capabilities and larger product expansions be considered.

---

# 🎯 Product Principles

Every product decision should reinforce these principles.

1. Capture should be effortless.
2. Retrieval is more important than storage.
3. Wisdom is more valuable than information.
4. Privacy is non-negotiable.
5. Reflection should replace engagement addiction.
6. Validate user behavior before building sophisticated AI.
7. AI providers must always remain replaceable.
8. Architecture should evolve without requiring rewrites.

---

# 📈 Build Progress

Anubhav has been developed incrementally through a series of focused engineering sprints.

The following sections summarize the current implementation status across the entire system.
## ✅ Product

- Product vision finalized
- Problem statement defined
- Core product philosophy documented
- MVP scope finalized
- User personas identified
- Validation strategy documented
- Product roadmap established
- Founder continuity documentation prepared

The product vision has remained intentionally focused throughout development:

> Build a system that helps people preserve and retrieve wisdom—not simply store information.

---

## ✅ Infrastructure

The development environment has been fully established.

Implemented:

- Docker development environment
- Turborepo monorepo
- PostgreSQL 16
- pgvector extension
- Environment configuration
- Local development tooling
- Version-controlled infrastructure
- Alembic migration workflow

Infrastructure is stable and production-ready for MVP deployment.

---

## ✅ Backend Foundation

Implemented using FastAPI and SQLAlchemy 2.0.

Features include:

- FastAPI application
- Async SQLAlchemy
- AsyncPG
- Dependency Injection
- Pydantic Settings
- Swagger/OpenAPI Documentation
- Structured configuration
- Health endpoint (`/health`)

The backend architecture follows a layered design:

```text
Router
      ↓
Service
      ↓
Model
      ↓
Database
```

Business logic remains isolated inside service layers.

---

## ✅ Database

Database migrations are managed through Alembic.

Current database includes:

- users
- anubhavs
- tags
- anubhav_tags
- reminders
- alembic_version

Additional capabilities:

- pgvector extension
- Vector storage (384 dimensions)
- Relationship tables
- Cascade delete support
- Ownership enforcement

---

## ✅ Authentication

Authentication is implemented using Clerk.

Capabilities:

- Clerk Integration
- JWT Verification
- JWKS Validation
- User Auto-Provisioning
- Protected Routes
- `/auth/me`

Security principles:

- User-scoped resources
- Ownership validation
- Stateless authentication
- Provider abstraction

---

## ✅ Experience Management (CRUD)

Implemented endpoints:

- POST `/anubhavs`
- GET `/anubhavs`
- GET `/anubhavs/{id}`
- PATCH `/anubhavs/{id}`
- DELETE `/anubhavs/{id}`

Supported capabilities:

- Ownership validation
- Pagination
- Category filtering
- Tag normalization
- Cascade delete
- User isolation
- Validation using Pydantic

---

## ✅ Keyword Search

Implemented:

- Keyword search
- Category filtering
- Pagination
- User-scoped retrieval
- Case-insensitive matching
- Tag-based discovery

Validation completed:

- Keyword matches
- Category filtering
- Pagination
- Authorization
- Empty query validation
- Tag-only matches

The traditional search experience is considered stable.

---

## ✅ AI Lesson Extraction

Every experience can be transformed into structured wisdom.

Pipeline:

```text
Raw Experience
        ↓
Groq AI
        ↓
Lesson
Summary
Tags
        ↓
Database
```

Capabilities:

- Lesson generation
- Summary generation
- Automatic tags
- Provider abstraction
- Structured JSON validation
- Re-extraction protection
- Graceful error handling

Extraction occurs independently from creation, allowing users to control AI usage while keeping the architecture flexible.

---

## ✅ Embedding Generation

After successful AI extraction, every experience automatically receives a semantic embedding.

Pipeline:

```text
Lesson
Summary
        ↓
sentence-transformers
(all-MiniLM-L6-v2)
        ↓
384-dimensional vector
        ↓
PostgreSQL pgvector
```

Capabilities:

- Local inference
- Zero API cost
- Automatic generation
- Graceful degradation
- Backfill support
- Provider abstraction

Embeddings form the foundation for semantic retrieval and relationship discovery.

---

## ✅ Semantic Search

Anubhav supports searching by meaning rather than exact keywords.

Pipeline:

```text
User Query
        ↓
Embedding Generation
        ↓
Cosine Similarity
(pgvector)
        ↓
Ranked Results
```

Capabilities:

- Meaning-based retrieval
- Pagination
- Category filtering
- User scoping
- Similarity scoring

Semantic search complements keyword search rather than replacing it.

Users can discover relevant experiences even when they do not remember the original wording.

---

## ✅ Reminder System

The reminder engine enables users to intentionally revisit important experiences.

Capabilities:

- Reminder creation
- Reminder updates
- Reminder deletion
- Scheduled triggering
- Background scheduler
- User-scoped reminders

Reminder workflow:

```text
Experience
      ↓
Reminder Created
      ↓
Scheduled Trigger
      ↓
Reflection Engine
```

This shifts Anubhav from passive storage to active knowledge resurfacing.

---

## ✅ Wisdom Relationship Graph

Anubhav automatically discovers meaningful relationships between experiences.

Instead of isolated entries, users explore connected wisdom.

Capabilities:

- Similarity scoring
- Related experiences
- Bidirectional relationships
- Semantic ranking
- Connected exploration

Relationship workflow:

```text
Experience
      ↓
Embedding
      ↓
Similarity Analysis
      ↓
Connected Wisdom
```

The relationship graph serves as the bridge between semantic understanding and interactive exploration.

---

## ✅ Reflection Engine

The Reflection Engine proactively resurfaces wisdom instead of waiting for users to search manually.

Current reflection sources include:

- Daily reflections
- Reminder-based reflections
- Forgotten wisdom
- Connected experiences
- Random reflections

Reflection workflow:

```text
Stored Wisdom
        ↓
Reflection Selection
        ↓
Reflection Cards
        ↓
User Exploration
```

This transforms Anubhav into an active companion rather than a passive archive.

---

## ✅ Frontend

The frontend now exposes nearly every major backend capability.

Implemented pages include:

- Landing Page
- Authentication
- Wisdom Space
- Experiences
- Search
- Journey
- Reflections
- Settings
- Interactive Wisdom World

Additional integrations:

- Reflection cards
- Experience Dock
- Relationship visualization
- Reminder actions
- Deep linking
- World navigation

Traditional interfaces and immersive exploration coexist within a unified experience.

---

## ✅ Interactive Wisdom World

The Wisdom World is the visual representation of accumulated experiences.

Core concepts:

- Experiences become islands
- Categories become regions
- Relationships become navigable paths
- Reflections become highlighted discoveries

Current capabilities include:

- Regional exploration
- Camera controls
- Island selection
- Experience Dock
- Relationship navigation
- Reflection highlighting
- Search integration

The world is intentionally renderer-agnostic, enabling future migration to technologies such as PixiJS without changing business logic.

---

# 📊 MVP Progress
| Module | Status |
|---------|--------|
| Product Definition | ✅ Complete |
| Infrastructure | ✅ Complete |
| Database | ✅ Complete |
| Authentication | ✅ Complete |
| CRUD Operations | ✅ Complete |
| Keyword Search | ✅ Complete |
| Semantic Search | ✅ Complete |
| AI Lesson Extraction | ✅ Complete |
| Embedding Generation | ✅ Complete |
| Reminder System | ✅ Complete |
| Wisdom Relationship Graph | ✅ Complete |
| Reflection Engine | ✅ Complete |
| Reflection Integration | ✅ Complete |
| Traditional Frontend | ✅ Complete |
| Interactive Wisdom World | ✅ Complete |
| Deployment | 🚧 In Progress |
| User Validation | ⏳ Pending |

---

## Overall Progress

| Area | Status |
|------|--------|
| Backend MVP | ✅ Complete |
| Frontend MVP | ✅ Complete |
| Intelligence Layer | ✅ Complete |
| Integration Layer | ✅ Complete |
| Interactive World | ✅ Complete |
| Deployment | 🚧 Remaining |
| User Validation | ⏳ Pending |

The current product is feature-complete for the MVP.

Remaining work is focused on:

- World-first navigation
- Deployment
- Performance optimization
- User onboarding
- User validation
- Product refinement

---

# 🔄 Current Product Flow

The current experience follows a complete end-to-end intelligence pipeline.

```text
Authentication
        ↓
Capture Experience
        ↓
Store Experience
        ↓
AI Lesson Extraction
        ↓
Embedding Generation
        ↓
Relationship Discovery
        ↓
Reflection Engine
        ↓
Keyword Search
        ↓
Semantic Search
        ↓
Interactive Wisdom World
        ↓
Retrieve Wisdom
        ↓
Better Decisions
```

Every stage contributes toward preserving and resurfacing meaningful life experiences.

---

# 🏛 Architecture

```text
                           Next.js Frontend
                                   │
                                   ▼
          Traditional UI + Interactive Wisdom World
                                   │
                          Clerk Authentication
                                   │
                                   ▼
                           FastAPI Backend
                                   │
      ┌────────────┬────────────┬────────────┬────────────┐
      │            │            │            │
 Authentication   CRUD      Intelligence    Retrieval
                               │                │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
 Lesson Extraction      Embedding Service    Search Services
         │                     │                     │
         ├──────────────┬──────┴──────────────┐
         │              │                     │
 Relationship Graph  Reminder Engine   Reflection Engine
         │              │                     │
         └──────────────┴──────────────┬──────┘
                                      │
                                      ▼
                         PostgreSQL 16 + pgvector
```

The architecture is intentionally modular.

Business logic remains inside backend services.

Frontend components consume APIs without duplicating business rules.

This separation allows future changes to rendering technology or AI providers without affecting the overall architecture.

---

# 🗂 Repository Structure

```text
anubhav/
│
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── world/
│   │   │   └── ai/
│   │   ├── alembic/
│   │   ├── main.py
│   │   └── requirements.txt
│   │
│   └── web/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── services/
│       └── world/
│
├── docs/
│
├── infra/
│
├── packages/
│
├── .env.example
├── package.json
└── README.md
```

The repository follows a monorepo architecture.

Backend and frontend evolve independently while sharing a common product vision.

---

# 🎯 Engineering Principles

Several engineering decisions guide development.

## Layered Architecture

```text
Router
    ↓
Service
    ↓
Model
    ↓
Database
```

Business logic should never live inside routers.

---

## User Isolation

Every protected endpoint must operate only on data owned by the authenticated user.

Ownership violations intentionally return **404** instead of **403** to prevent resource enumeration.

---

## Provider Abstraction

External services should always remain replaceable.

Current examples include:

- Groq → AI Extraction
- sentence-transformers → Embeddings
- Clerk → Authentication

Each service is isolated behind its own abstraction layer.

---

## Progressive Intelligence

Every intelligence layer builds upon the previous one.

```text
Experience
      ↓
Lesson
      ↓
Embedding
      ↓
Relationship
      ↓
Reflection
```

Future intelligence should extend this chain rather than replace it.

---

## Renderer Independence

The Wisdom World has been designed to remain renderer-agnostic.

Current renderer:

- SVG + React

Possible future renderers:

- PixiJS
- WebGL
- Canvas

Migration should require replacing only the renderer layer.

---

## Validation Before Complexity

The product intentionally avoids premature sophistication.

Every significant feature must answer one question:

> Does this improve the user's ability to preserve or retrieve wisdom?

If not, it should not be built.

---

# 📚 Documentation

The repository includes extensive project documentation covering:

- Product vision
- Engineering decisions
- Founder continuity
- Junior developer handover
- Sprint reports
- Architecture evolution
- Validation strategy
- Lessons learned

Documentation is treated as a first-class project artifact rather than an afterthought.

---

# 🧭 Product Roadmap
## Phase 1 — Experience Vault

The foundation of Anubhav.

Goals:

- Capture experiences
- Preserve them securely
- Organize them using categories and tags

**Status:** ✅ Complete

---

## Phase 2 — Wisdom Intelligence

Transform raw experiences into structured wisdom.

Capabilities:

- AI lesson extraction
- AI summaries
- Automatic tagging
- Semantic embeddings
- Keyword search
- Semantic search

**Status:** ✅ Complete

---

## Phase 3 — Relationship Discovery

Help users understand how their experiences connect.

Capabilities:

- Similarity scoring
- Related experiences
- Connected wisdom graph
- Experience exploration

**Status:** ✅ Complete

---

## Phase 4 — Reflection Engine

Bring forgotten wisdom back when it matters.

Capabilities:

- Daily reflections
- Reminder-based reflections
- Forgotten wisdom
- Related wisdom
- Reflection integration

**Status:** ✅ Complete

---

## Phase 5 — Interactive Wisdom World

Transform navigation into exploration.

Capabilities:

- Interactive world
- Regional organization
- Wisdom islands
- Experience dock
- Camera navigation
- Connected wisdom visualization

**Status:** ✅ Complete

---

## Phase 6 — World-First Experience

The next milestone.

Goals:

- Make `/world` the default entry after authentication.
- Full-screen world experience.
- Camera-driven navigation instead of browser scrolling.
- Hover-to-reveal sidebar.
- Refined interactions and animations.
- A seamless exploration experience.

**Status:** 🚧 Planned

---

## Phase 7 — Deployment & Validation

Deploy the MVP and validate the core hypothesis with real users.

Goals:

- Production deployment
- Performance optimization
- Analytics
- Bug fixing
- User interviews
- Behavioral validation

Validation Targets:

- 50 Users
- 20 Experiences per User
- 1000 Total Experiences

Only after this stage should major new capabilities be introduced.

---

# 🚀 Long-Term Vision

Anubhav is evolving toward becoming a **Personal Wisdom Operating System**.

Imagine a system that:

- Understands your experiences.
- Connects lessons across years.
- Surfaces forgotten wisdom at the right moment.
- Helps you make better decisions using your own accumulated knowledge.

The objective is not to replace memory.

The objective is to augment it.

---

# 📈 Product Evolution

```text
Raw Notes
      ↓
Structured Experiences
      ↓
AI Wisdom
      ↓
Semantic Understanding
      ↓
Relationship Discovery
      ↓
Reflection
      ↓
Interactive Exploration
      ↓
Personal Wisdom Operating System
```

Every release should move one step further along this journey.

---

# 🎯 Validation Strategy

Technology is **not** the primary risk.

Behavior is.

The most important question is:

> **Will people consistently preserve experiences and return to retrieve them?**

Validation will focus on:

- Number of captured experiences
- Retrieval frequency
- Reflection engagement
- Reminder usefulness
- Search usage
- World exploration
- Retention over time

Only after validating these behaviors should additional AI sophistication or platform expansion be considered.

---

# ❌ Anti-Goals

Anubhav is **not** intended to become:

- A generic note-taking application
- A journaling application
- A second-brain clone
- A social network
- A productivity tracker
- A PKM platform
- A knowledge wiki

Feature additions should strengthen the core mission rather than dilute it.

---

# 🤝 Contributing

Contributions are welcome.

When proposing changes, consider the following questions:

- Does this improve capture?
- Does this improve preservation?
- Does this improve retrieval?
- Does this improve application?

If the answer to all four is **No**, the feature probably does not belong in Anubhav.

---

# 🧠 Founder Note

Anubhav is not primarily a software project.

It is an attempt to solve a human problem.

People spend years earning wisdom.

Yet memory gradually erodes it.

If Anubhav succeeds, users will not simply accumulate experiences.

They will build a lifelong repository of wisdom that can be searched, connected, reflected upon, and applied whenever life presents similar situations again.

The ultimate goal is not better notes.

It is **better decisions**.

Protect the mission.

Keep the architecture simple.

Validate continuously.

Let wisdom compound.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*