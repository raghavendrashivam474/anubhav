# 🧠 Anubhav

> **Preserve experiences today. Retrieve wisdom tomorrow.**

Anubhav is a **Personal Wisdom Preservation System** that helps people transform life experiences into structured, searchable, and interconnected wisdom.

Modern software is excellent at storing information.

**Anubhav is built to preserve wisdom.**

Instead of becoming another note-taking or journaling application, Anubhav captures experiences, extracts lessons using AI, discovers relationships between them, and resurfaces the right wisdom when it becomes relevant.

---

# 🌍 Why Anubhav Exists

Every person accumulates valuable experiences throughout life.

- A failed interview
- A difficult relationship
- A startup mistake
- Advice from a mentor
- An important realization

These experiences often contain lessons that required significant time, effort, sacrifice, failure, or emotional cost to acquire.

Yet most disappear.

Not because they lack value.

Because they are forgotten.

As a result, people repeatedly:

- Repeat mistakes
- Forget valuable lessons
- Lose hard-earned insights
- Miss opportunities to learn from themselves

Anubhav exists to solve this problem.

---

# 💡 What Anubhav Does

Anubhav enables users to:

- Capture experiences effortlessly
- Extract lessons using AI
- Generate structured summaries
- Automatically organize knowledge
- Preserve wisdom long-term
- Search through keyword and semantic understanding
- Visualize relationships between experiences
- Explore wisdom inside an interactive world

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
Preservation
      ↓
Retrieval
      ↓
Better Decisions
```

Every feature in Anubhav strengthens this loop.

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

## AI

- Structured lesson extraction
- Summary generation
- Automatic tagging
- Local embedding generation
- Semantic retrieval
- Relationship discovery

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

## Infrastructure

- Docker
- Turborepo

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

**Feature-Complete MVP**

Current focus:

- Deployment
- Performance optimization
- User validation
- Product refinement

Validation Goal:

- 50 Users
- 20 Experiences per User
- 1000 Total Experiences

---

# 🎯 Product Principles

1. Capture should be effortless.
2. Retrieval matters more than storage.
3. Wisdom is more valuable than information.
4. Privacy is non-negotiable.
5. Reflection over engagement.
6. Validate behavior before sophistication.
7. AI providers must remain replaceable.
8. Architecture should evolve without rewrites.

---

# 📈 Build Progress

## ✅ Product

- Product vision
- MVP definition
- Validation strategy
- User personas
- Product documentation

---

## ✅ Infrastructure

- Docker
- Turborepo
- PostgreSQL
- pgvector
- Local development environment

---

## ✅ Backend

### Foundation

- FastAPI
- Async SQLAlchemy
- Dependency Injection
- Swagger/OpenAPI
- Health endpoint

### Authentication

- Clerk Integration
- JWT Verification
- JWKS Validation
- User Auto Provisioning

### CRUD

- Create
- Read
- Update
- Delete
- Ownership validation
- Pagination
- Category filtering
- Tag normalization

### Search

- Keyword search
- Semantic search
- Category filtering
- Pagination
- User scoping

### AI

- Lesson extraction
- Summary generation
- Automatic tagging
- Embedding generation

### Intelligence

- Wisdom relationship graph
- Similarity scoring
- Connected experience discovery

### Reminders

- Reminder creation
- Reminder management
- Scheduled reflection support

---

## ✅ Frontend

Traditional application pages completed.

Interactive Wisdom World completed.

Features include:

- Regional exploration
- Wisdom islands
- Camera controls
- Interactive docks
- Relationship visualization

---

# 📊 MVP Progress

| Module | Status |
|---------|--------|
| Product Definition | ✅ Complete |
| Infrastructure | ✅ Complete |
| Database | ✅ Complete |
| Authentication | ✅ Complete |
| CRUD | ✅ Complete |
| Keyword Search | ✅ Complete |
| Semantic Search | ✅ Complete |
| AI Lesson Extraction | ✅ Complete |
| Embedding Generation | ✅ Complete |
| Reminder System | ✅ Complete |
| Wisdom Relationship Graph | ✅ Complete |
| Traditional Frontend | ✅ Complete |
| Interactive Wisdom World | ✅ Complete |
| Deployment | 🚧 In Progress |
| User Validation | ⏳ Pending |

---

### Overall Progress

- **Backend MVP:** ✅ Complete
- **Frontend MVP:** ✅ Complete
- **Feature MVP:** ✅ Complete
- **Deployment:** 🚧 Remaining

Current product flow:

```text
Authentication
        ↓
Capture Experience
        ↓
Store
        ↓
AI Extraction
        ↓
Embedding Generation
        ↓
Relationship Discovery
        ↓
Keyword Search
        ↓
Semantic Search
        ↓
Interactive Wisdom World
        ↓
Retrieve Wisdom
```

---

# 🏛 Architecture

```text
                Next.js Frontend
                        │
                        ▼
        Traditional UI + Interactive World
                        │
                Clerk Authentication
                        │
                        ▼
                FastAPI Backend
                        │
     ┌──────────┬──────────┬──────────┐
     │          │          │          │
 Authentication CRUD     AI      Search
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   Lesson Extraction  Embeddings   Relationship Graph
          │                │                │
          └────────────────┴────────────────┘
                        │
                        ▼
            PostgreSQL + pgvector
```

---

# 🗂 Repository Structure

```text
anubhav/
├── apps/
│   ├── api/
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

## Phase 1

Experience Vault

Capture and preserve experiences.

---

## Phase 2

Wisdom Intelligence

AI extraction, semantic retrieval, relationship discovery.

---

## Phase 3

Reflection Engine

Context-aware reminders and wisdom resurfacing.

---

## Phase 4

Interactive Wisdom World

Visual exploration of accumulated experiences.

---

## Phase 5

Personal Wisdom Operating System

A lifelong companion that helps people make better decisions through accumulated experience.

---

# 🧠 Founder Note

Anubhav is not trying to compete with note-taking applications.

It is attempting to answer a different question:

> **How can people preserve wisdom gained through experience?**

Every feature should strengthen at least one of these pillars:

- Capture
- Preservation
- Retrieval
- Application

If a feature strengthens none of them, it should not be built.

---

# 👤 Founder

**Raghavendra Singh**

*Building systems that help people remember what matters.*