<div align="center">

# 🧠 Anubhav

### Capture experiences. Preserve wisdom. Rediscover what matters.

An AI-powered Personal Wisdom Preservation Platform that transforms experiences, books, and other knowledge sources into structured, searchable, and interconnected wisdom.

<p align="center">

![Status](https://img.shields.io/badge/status-MVP-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)

</p>

<p align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,python,fastapi,postgres,docker,git,vscode" />

</p>

<p align="center">

<a href="#overview">Overview</a> •
<a href="#why-anubhav">Why</a> •
<a href="#features">Features</a> •
<a href="#architecture">Architecture</a> •
<a href="#roadmap">Roadmap</a>

</p>

</div>

---

# Overview

Every day we gain valuable knowledge.

Sometimes it comes from success.

Sometimes from failure.

Sometimes from a single sentence hidden inside a book.

Sometimes from years of experience.

Unfortunately, most of these lessons disappear.

Traditional note-taking applications are designed to store information.

They are not designed to preserve wisdom.

Notes become archives.

Bookmarks become digital clutter.

Journals become timelines that are rarely revisited.

Important insights slowly fade into memory.

Anubhav exists to solve this problem.

Instead of becoming another note-taking application, it focuses on helping people build a lifelong collection of experiences, lessons, reflections, and understanding that continuously grows more valuable over time.

Every captured experience becomes structured knowledge that can later be searched, connected with other ideas, and rediscovered exactly when it becomes useful again.

---

# Why Anubhav?

People rarely forget information because it was unimportant.

They forget because it was never connected.

Imagine reading an excellent book.

Months later, you remember enjoying it but cannot recall the ideas that changed your thinking.

Or solving a difficult engineering problem only to face the same challenge again a year later.

Or receiving advice from a mentor that feels profound in the moment but slowly disappears with time.

These are not failures of effort.

They are limitations of human memory.

Anubhav is designed to become an external layer of memory—not simply preserving information, but preserving understanding.

---

# Vision

To become a lifelong personal wisdom companion.

One that grows alongside its user.

One that remembers what people naturally forget.

One that transforms isolated experiences into an interconnected network of knowledge.

Instead of asking,

> "What happened?"

Anubhav asks,

> **"What did you learn?"**

---

# Core Principles

The project is built around a small number of guiding principles.

## Wisdom over Information

Information answers questions.

Wisdom improves decisions.

The platform focuses on preserving understanding rather than collecting data.

---

## Capture Once

Knowledge should only need to be captured once.

From that point onward the system should organize, understand, connect, and retrieve it automatically.

---

## AI as an Assistant

Artificial intelligence should reduce effort rather than replace thinking.

AI assists with:

- summarization
- lesson extraction
- semantic understanding
- relationship discovery
- reflection generation

while keeping users fully in control of their own knowledge.

---

## Knowledge Should Connect

Knowledge rarely exists in isolation.

Books influence experiences.

Experiences reinforce ideas.

Ideas inspire projects.

Projects generate new experiences.

Anubhav continuously discovers these relationships to build a living knowledge graph rather than a collection of isolated notes.

---

# Features

## 📝 Experience Capture

Record personal experiences together with their lessons, reflections, outcomes, and supporting context.

Every experience becomes a searchable piece of structured wisdom.

---

## 📚 Book Wisdom

Capture insights directly from books.

Using OCR, the platform extracts selected passages before transforming them into meaningful summaries, lessons, and searchable knowledge.

Rather than storing entire books, Anubhav focuses on preserving what actually changed your thinking.

---

## 🤖 AI Intelligence Pipeline

Every captured entry is processed through an AI pipeline that automatically generates:

- concise summaries
- key lessons
- semantic tags
- embeddings
- contextual metadata

This significantly reduces manual organization while improving future retrieval.

---

## 🔍 Semantic Search

Search by meaning instead of exact words.

Instead of remembering precise titles or tags, users can search naturally.

Examples include:

```
leadership lessons

handling failure

system design

product thinking

database optimization
```

Relevant wisdom is retrieved using semantic similarity rather than keyword matching.

---

## 🔗 Relationship Discovery

Knowledge grows when ideas connect.

The platform identifies relationships between entries to create a continuously evolving personal knowledge graph.

```
Book
      │
      ▼
Experience
      │
      ▼
Reflection
      │
      ▼
Project
```

Over time these connections reveal recurring patterns, long-term growth, and hidden insights.

---

## 💭 Reflection Engine

Remembering at the right time is often more valuable than remembering everything.

The Reflection Engine periodically resurfaces:

- forgotten lessons
- related experiences
- previous decisions
- similar situations
- long-term learning patterns

Its goal is to transform stored knowledge into practical wisdom.

---

## 🌍 Wisdom World

Wisdom World provides a visual representation of personal knowledge.

Instead of navigating folders, users explore an interconnected landscape of experiences, books, ideas, and reflections.

As more knowledge is captured, the map continues to evolve alongside the individual.

---

# Current Status

Anubhav is currently in the **Minimum Viable Product (MVP)** stage.

Implemented capabilities include:

- User Authentication
- Experience Management
- Book Wisdom Capture
- OCR Integration
- AI Lesson Extraction
- AI Summarization
- Semantic Search
- Relationship Discovery
- Reflection Engine
- Wisdom World Foundation

The project is now focused on platform stabilization, production readiness, and user validation before expanding into additional knowledge sources.

---

# Technology Stack

| Layer | Technology |
|----------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Vector Search | pgvector |
| AI | Groq API |
| OCR | Tesseract OCR |
| Migrations | Alembic |
| Containers | Docker |
| Version Control | Git |

---

# Architecture

```text
                     Capture Sources
      ┌────────────────────────────────────────┐
      │                                        │
 Experiences   Books   Articles   PDFs   Future
      │                                        │
      └──────────────────┬─────────────────────┘
                         │
                         ▼
               Unified Capture Pipeline
                         │
                         ▼
               AI Intelligence Engine
                         │
      ┌────────────┬────────────┬────────────┐
      │            │            │            │
  Summary      Lessons      Tags      Embeddings
      │            │            │            │
      └────────────┴────────────┴────────────┘
                         │
                         ▼
             Relationship Discovery
                         │
                         ▼
               Reflection Engine
                         │
                         ▼
                  Wisdom World
```

The architecture intentionally separates capture, intelligence, storage, and presentation layers, making it straightforward to introduce new knowledge sources while preserving a consistent processing pipeline.

---
# 🚀 Getting Started

Follow the steps below to set up Anubhav for local development.

## Prerequisites

Ensure the following software is installed on your machine.

| Software | Version |
|-----------|---------|
| Python | 3.12+ |
| Node.js | 20+ |
| PostgreSQL | 16+ |
| Docker | Latest |
| Git | Latest |

---

## Clone the Repository

```bash
git clone https://github.com/<your-username>/anubhav.git

cd anubhav
```

---

## Backend Setup

Navigate to the backend application.

```bash
cd apps/api
```

Create and activate a virtual environment.

Linux / macOS

```bash
python -m venv .venv

source .venv/bin/activate
```

Windows

```powershell
python -m venv .venv

.\.venv\Scripts\Activate.ps1
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Configure environment variables.

```bash
cp .env.example .env
```

Run database migrations.

```bash
alembic upgrade head
```

Start the development server.

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://localhost:8000
```

---

## Frontend Setup

Navigate to the frontend.

```bash
cd apps/web
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

---

# ⚙️ Configuration

Application configuration is managed using environment variables.

Example configuration:

```env
DATABASE_URL=
JWT_SECRET_KEY=
GROQ_API_KEY=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
EMBEDDING_MODEL=
```

Refer to `.env.example` for the complete list of supported configuration options.

Sensitive credentials should never be committed to version control.

---

# 📁 Project Structure

The repository follows a modular architecture designed for scalability and maintainability.

```text
anubhav/
│
├── apps/
│   ├── api/
│   │   ├── app/
│   │   ├── alembic/
│   │   ├── tests/
│   │   └── requirements.txt
│   │
│   └── web/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── public/
│
├── docs/
│   ├── architecture/
│   ├── deployment/
│   ├── product/
│   ├── roadmap/
│   └── sprints/
│
├── docker/
├── scripts/
├── docker-compose.yml
├── README.md
└── LICENSE
```

Each module has a clearly defined responsibility, making the project easier to understand, extend, and maintain.

---

# 🔄 System Workflow

Every piece of knowledge follows a unified processing pipeline.

```text
Knowledge Source
        │
        ▼
 Capture Service
        │
        ▼
 AI Intelligence Pipeline
        │
        ├──────────────► Summary
        │
        ├──────────────► Lessons
        │
        ├──────────────► Semantic Tags
        │
        └──────────────► Embeddings
                       │
                       ▼
            Relationship Discovery
                       │
                       ▼
             Reflection Scheduling
                       │
                       ▼
                Knowledge Retrieval
```

This architecture allows new capture sources to be added without changing downstream processing.

---

# 🌐 API Overview

The backend exposes RESTful APIs for every major platform capability.

| Module | Description |
|----------|-------------|
| Authentication | User registration, login and authorization |
| Wisdom | Experience and wisdom management |
| Capture | Multi-source capture pipeline |
| OCR | Book text extraction |
| Search | Semantic knowledge retrieval |
| Reflection | Reflection scheduling |
| Health | Service monitoring |

Interactive API documentation is automatically generated by FastAPI and available at:

```
http://localhost:8000/docs
```

---

# 🗄️ Database

Anubhav uses PostgreSQL together with **pgvector** to combine relational data with semantic search.

Primary entities include:

- Users
- Wisdom Entries
- Categories
- Tags
- Relationships
- Reflections
- Embeddings

The schema has been designed to support future capture sources while maintaining a consistent data model.

---

# 🔒 Security

Protecting user knowledge is one of the platform's highest priorities.

Current security measures include:

- JWT Authentication
- Password Hashing
- Secure API Authorization
- Input Validation
- SQL Injection Protection
- Environment-Based Configuration

Planned enhancements include:

- End-to-End Encryption
- Offline Encryption
- Secure Backup & Restore
- Local AI Processing
- Multi-Device Synchronization

---

# ⚡ Performance

The platform has been designed with long-term scalability in mind.

Current optimizations include:

- PostgreSQL indexing
- Vector similarity search using pgvector
- Modular service architecture
- Asynchronous AI processing
- Optimized database relationships
- Efficient frontend rendering

These architectural decisions ensure that the platform remains responsive even as the knowledge base grows significantly.

---

# 🧪 Testing

The project follows a continuous validation approach throughout development.

Current testing includes:

- Authentication Flow
- CRUD Operations
- OCR Processing
- AI Lesson Extraction
- Semantic Search
- Relationship Discovery
- Reflection Engine
- API Validation
- Database Migrations

Automated unit, integration, and end-to-end testing will continue to expand alongside future releases.

---

# 📚 Documentation

Additional documentation is available within the `docs/` directory.

| Document | Description |
|----------|-------------|
| PRODUCT_VISION.md | Product philosophy and long-term direction |
| ARCHITECTURE.md | System architecture and design decisions |
| ROADMAP.md | Planned features and milestones |
| CHANGELOG.md | Release history |
| DEPLOYMENT.md | Deployment instructions |
| SECURITY.md | Security practices |
| CONTRIBUTING.md | Contribution guidelines |

Engineering decisions, sprint documentation, and architecture discussions are also maintained within the documentation directory.

---
# 🛣️ Roadmap

Anubhav is being developed incrementally with a strong focus on stability, usability, and long-term scalability.

Planned areas of expansion include:

- Additional knowledge sources (PDFs, Articles, Research Papers, Websites)
- Voice Notes and Conversation Capture
- Browser Extension
- Mobile Companion Application
- Advanced Knowledge Graph Visualization
- AI-Powered Personal Knowledge Assistant
- Local AI Support
- End-to-End Encryption

For a detailed development plan, see the project roadmap in the `docs/` directory.

---

# 🤝 Contributing

Contributions are welcome and appreciated.

Whether it's reporting bugs, suggesting improvements, improving documentation, or submitting pull requests, every contribution helps make Anubhav better.

Please read the contribution guidelines before opening an issue or pull request.

---

# 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

---

# 👨‍💻 Author

**Raghavendra Singh**

Computer Science undergraduate passionate about building AI-powered systems, developer tools, and products that solve meaningful real-world problems.

---

<div align="center">

**If you found this project interesting, consider giving it a ⭐ on GitHub.**

*Capture experiences. Preserve wisdom. Rediscover what matters.*

</div>