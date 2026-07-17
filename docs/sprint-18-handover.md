# Sprint 18 — Multi-Source Wisdom Capture Foundation
## Engineering Handover Document

---

> **For the developer receiving this sprint.**
> This document assumes you have never seen this codebase before.
> Read it fully before writing a single line of code.
> Estimated reading time: 20 minutes.

---

# 1. Executive Summary

## What is Anubhav?

Anubhav is a personal wisdom operating system.

Most people accumulate experiences throughout their lives but never extract meaning from them. A difficult conversation, a failure at work, a lesson learned while traveling — these events happen and then fade. Anubhav exists to capture those moments, extract the wisdom inside them, connect that wisdom across time, and surface it back to the user when it is most relevant.

The name comes from the Hindi word for experience.

## What problem does it solve?

Humans are bad at learning from their own lives. Not because they lack intelligence, but because:

- Experiences are stored as memories, not lessons
- Memories decay
- Patterns across experiences are invisible without distance
- There is no system that connects what you learned at 22 to what you are facing at 35

Anubhav is that system.

## Current maturity

Sprint 17 is complete. The system is functional end-to-end.

A user can:
- Create an account and log in
- Record an experience
- Have AI extract lessons, summaries, and tags automatically
- Have the experience embedded into a vector space
- Have the system find relationships between experiences automatically
- Receive reflections — AI-generated insights that connect experiences across time
- Search experiences semantically
- View their World (a dashboard of their wisdom)
- Receive reminder notifications

The system is not a prototype. It is a working product with a real database, real AI pipelines, and a real frontend.

## What has already been built

**Backend (FastAPI + Python)**
- Authentication system (JWT-based, custom, no third-party auth)
- Experience CRUD (create, read, update, delete)
- AI extraction pipeline (lessons, summary, tags via OpenAI)
- Embedding service (all-MiniLM-L6-v2 via sentence-transformers, 384 dimensions)
- Relationship service (finds connections between experiences using vector similarity)
- Reflection engine (generates narrative insights connecting multiple experiences)
- Semantic search (vector-based search across all experiences)
- Reminder engine (scheduled notifications)
- World API (aggregated dashboard data)

**Frontend (Next.js 14 + TypeScript)**
- Landing page
- Authentication (sign-in, sign-up)
- World page (dashboard)
- Experience list, creation, and detail pages
- Reflection page
- Search page
- Journey page
- Settings page
- Sidebar navigation

**Database (PostgreSQL + pgvector)**
- Users, experiences, tags, categories, embeddings, relationships, reflections, reminders

## What this sprint changes

Sprint 18 introduces the concept that wisdom can come from sources other than lived experience.

Specifically, it adds **Book** as a wisdom source.

A user will be able to photograph a page from a book, scan it using OCR, write their personal insight about what they read, and have that insight flow through the exact same AI pipeline that processes experiences.

The key architectural decision: **we are not building a book pipeline**. We are building a **unified capture pipeline** that treats all sources — experience, book, and future sources — as the same type of object: a **Wisdom Entry**.

## What this sprint explicitly does NOT change

- The existing experience flow is not touched
- The AI pipeline is not modified
- The embedding service is not modified
- The relationship service is not modified
- The reflection engine is not modified
- Search is not modified
- The database schema for existing tables is not modified
- The frontend navigation structure is not modified

If it worked before Sprint 18, it must still work after Sprint 18.

---

# 2. Product Philosophy

## Before Sprint 18

The implicit assumption baked into the entire system was:
Wisdom comes from experiences.


Every model, every schema, every API endpoint, every UI screen was designed around a single source: the lived experience of the user.

This made sense. It was the right place to start. But it created a hidden constraint: the system could only learn from what the user *did*, not from what the user *read*, *heard*, or *discussed*.

## After Sprint 18

The philosophy expands:

Wisdom comes from many sources.

A lived experience is one source.
A book is another source.
A conversation will be another.
A podcast will be another.
A research paper will be another.


This is not a small change in philosophy. It changes the fundamental question the system asks.

Before: *What happened to you?*
After: *What did you learn, and where did it come from?*

## Why this matters architecturally

If we treat book as a special case, we build two pipelines.
Two pipelines means two maintenance burdens.
Two pipelines means inconsistent behavior.
Two pipelines means future sources (podcast, PDF, YouTube) each become their own special case.

Instead, Sprint 18 establishes a **Capture Pipeline** — a single abstraction that accepts any source, normalizes it into a Wisdom Entry, and passes it to the existing AI, embedding, relationship, and reflection engines unchanged.

This is the central design decision of Sprint 18. Everything else follows from it.

---

# 3. Current Architecture (Before Sprint 18)
User
|
v
Landing Page (Next.js)
|
v
Authentication (JWT / sign-in / sign-up)
|
v
World Page (dashboard — aggregated view of all wisdom)
|
v
Experience Creation (manual text input by user)
|
v
AI Extraction Pipeline
| - Lesson extraction (OpenAI)
| - Summary generation (OpenAI)
| - Tag generation (OpenAI)
v
Embedding Service
| - Text embedded using all-MiniLM-L6-v2 (384 dimensions)
| - Stored in pgvector
v
Relationship Service
| - Finds similar experiences using vector cosine similarity
| - Stores relationships in experience_relationships table
v
Reflection Engine
| - Reads relationships
| - Generates narrative insights connecting experiences
| - Stores reflections
v
Search
| - Semantic vector search across all embedded experiences
v
Reminder Engine
- Scheduled jobs that surface past wisdom


Every layer is independent. Each layer consumes the output of the previous layer. This is what makes Sprint 18 possible — we insert a new entry point before the AI Extraction Pipeline without touching anything below it.

---

# 4. Existing Backend

**Location:** `apps/api/`

## Structure
apps/api/
main.py # FastAPI app entry point, router registration
requirements.txt # All Python dependencies
alembic.ini # Database migration configuration
alembic/
versions/ # Migration history
app/
core/ # Configuration, database connection, security
models/ # SQLAlchemy ORM models
schemas/ # Pydantic request/response schemas
routers/ # FastAPI route handlers
services/ # Business logic
scheduler.py # APScheduler configuration for reminders

|`models/relationship.py` | `experience_relationships` |
| `models/reminder.py` | `reminders` |
| `models/tag.py` | `tags` |
| `models/user.py` | `users` |

---

# 5. Existing Frontend

**Location:** `apps/web/`

## Structure
apps/web/
app/
(auth)/ # Route group — unauthenticated pages
sign-in/
sign-up/
layout.tsx
(app)/ # Route group — authenticated pages
world/ # Dashboard
experiences/ # Experience list + creation + detail
reflections/ # Reflections view
search/ # Semantic search
journey/ # Timeline view
settings/ # User settings
wisdom-space/ # (existing page)
layout.tsx # Shared layout with sidebar navigation
layout.tsx # Root layout
page.tsx # Landing page
components/
navigation/
HoverSidebar.tsx # Sidebar navigation component
Navigation.tsx # Navigation wrapper
reflections/ # Reflection display components
ui/ # Shared UI primitives (shadcn/ui)
layout/ # Layout components
services/
api.ts # All API calls to backend — single source of truth
hooks/
useAuth.tsx # Authentication state management
types/
index.ts # All TypeScript type definitions


## Navigation

The authenticated layout (`(app)/layout.tsx`) wraps all authenticated pages with the sidebar navigation.

Navigation items currently:
- World
- Experiences
- Reflections
- Search
- Journey
- Settings

All API communication goes through `services/api.ts`. There is no direct fetch elsewhere.

---

# 6. Existing Database

**Database:** PostgreSQL with pgvector extension

## Migration history

d76368627fb4 Initial schema — users, anubhavs, tags, categories, embeddings, reminders
7aa1129d8163 Update embedding dimension from 1536 to 384
29f7317b9a01 Add password_hash to users, remove Clerk
9f2fe2c02443 Add experience_relationships table


## Key tables

### `users`
Stores authenticated users.

id UUID, primary key
email VARCHAR, unique
password_hash VARCHAR
created_at TIMESTAMP


### `anubhavs`
The core table. Every experience lives here.

id UUID, primary key
user_id UUID, foreign key → users
title VARCHAR
description TEXT # Raw user input
lesson TEXT # AI-extracted lesson
summary TEXT # AI-generated summary
category VARCHAR
emotion VARCHAR
date DATE
created_at TIMESTAMP
updated_at TIMESTAMP


### `tags`

id UUID
name VARCHAR, unique


### `anubhav_tags`
Many-to-many join between anubhavs and tags.

anubhav_id UUID
tag_id UUID


### `embeddings`
Stores vector embeddings for each experience.

id UUID
anubhav_id UUID, foreign key → anubhavs
embedding VECTOR(384)
created_at TIMESTAMP


### `experience_relationships`
Stores discovered relationships between experiences.
id UUID
source_id UUID, foreign key → anubhavs
target_id UUID, foreign key → anubhavs
similarity_score FLOAT
relationship_type VARCHAR
created_at TIMESTAMP


### `reminders`

id UUID
user_id UUID
anubhav_id UUID
message TEXT
remind_at TIMESTAMP
sent BOOLEAN


---

# 7. Current AI Pipeline

This pipeline runs every time a new experience is created.
User submits experience (title + description + emotion + category + date)
|
v
[1] Extraction Service
| Input: raw description text
| Action: calls OpenAI GPT
| Output: lesson (string), summary (string), tags (list of strings)
| File: services/extraction_service.py
v
[2] Tag Storage
| Action: creates or retrieves tag records, links to experience
| File: services/anubhav_service.py
v
[3] Embedding Service
| Input: lesson + summary concatenated
| Action: encodes text using all-MiniLM-L6-v2 (384 dimensions)
| Output: vector stored in embeddings table
| File: services/embedding_service.py
v
[4] Relationship Service
| Input: new embedding
| Action: cosine similarity search against all existing embeddings
| Output: top matches stored in experience_relationships table
| File: services/relationship_service.py
v
[5] Reflection Engine
| Input: experience + its relationships
| Action: calls OpenAI GPT to generate narrative insight
| Output: reflection stored (linked to experience)
| File: services/reflection_service.py
v
Done. Experience is fully processed.


**Critical:** Sprint 18 does not modify any of these five stages. The capture pipeline feeds into Stage 1. Everything from Stage 1 onward runs identically whether the source was a lived experience or a book page.

---

# 8. Problem Statement

## The gap

A user reads a book. They encounter a paragraph that changes how they think about failure, or patience, or ambition.

Currently, to get that insight into Anubhav, they must:

Read the passage
Remember it well enough to retype it
Navigate to Experiences → New
Manually write a title
Manually write a description
Select a category
Select an emotion
Submit


This workflow is too long. The friction means users don't do it. The wisdom stays in the book. The book gets closed. The insight is lost.

## Why this is a real problem

Anubhav's value compounds over time. The more wisdom entries it has, the better its relationships, reflections, and search become. Every source of wisdom that is too difficult to capture is a compounding loss.

Books are one of the highest-density sources of wisdom humans have access to. They are currently completely outside the system.

## What needs to change

The capture experience for book wisdom should be:
Open phone to camera
Photograph the page
Write one sentence about what it means to you personally
Submit


Everything else — OCR, AI extraction, embedding, relationships, reflections — should happen automatically.

---

# 9. Proposed Solution

## The Capture Pipeline

User selects source: Book
|
v
User photographs page (or uploads image)
|
v
[OCR] Tesseract extracts text from image
|
v
User reviews OCR output (edits if needed)
|
v
User writes personal insight
("This made me think about how I handled the situation with...")
|
v
System combines: OCR text + personal insight → Wisdom Entry
|
v
[Existing AI Pipeline — unchanged]
Extraction → Embedding → Relationships → Reflection
|
v
Wisdom Entry appears in World, Search, Reflections


## What makes this work

The OCR text provides context. The personal insight provides meaning. Together they are equivalent in richness to a manually written experience description. The AI pipeline cannot tell the difference and does not need to.

---

# 10. Design Decisions

These decisions are fixed. They are not up for re-evaluation during Sprint 18.

---

### Decision 1: One pipeline, not two

**Rejected approach:**

Experience → Experience Pipeline → AI
Book → Book Pipeline → AI


**Chosen approach:**
Experience ─┐
Book ─┼─→ Capture Pipeline → AI
(future) ─┘


**Why:** Two pipelines create two maintenance surfaces. Every bug fix, every AI improvement, every schema change would need to be applied twice. With a unified pipeline, improvements to the AI stage benefit all sources automatically.

---

### Decision 2: Everything becomes a Wisdom Entry

A book insight is not stored as a "book record." It is stored as a Wisdom Entry — the same underlying object as an experience — with a `source_type` field that records where it came from.

This means:
- Search works across all sources automatically
- Relationships form between book insights and lived experiences automatically
- Reflections can connect a book you read to something that happened to you automatically
- The frontend displays everything in one unified view

---

### Decision 3: Reuse all existing engines

The following are **not** duplicated for Sprint 18:

| Engine | Reuse strategy |
|--------|----------------|
| Embedding Service | Called identically with Wisdom Entry text |
| Relationship Service | Runs against all entries regardless of source |
| Reflection Engine | Generates reflections across all sources |
| Search | Indexes all entries regardless of source |
| World API | Aggregates all entries regardless of source |

If you find yourself writing a second version of any of these, stop. You are doing it wrong.

---

### Decision 4: OCR runs server-side

OCR is handled by Tesseract on the backend. The frontend sends an image file. The backend returns extracted text. This keeps the frontend thin and makes the OCR step replaceable without frontend changes.

---

### Decision 5: Personal insight is mandatory

The OCR text alone is not a Wisdom Entry. A user must write at least one sentence explaining what the passage means to them personally. This is what transforms raw text into wisdom. It is enforced at the API level with a minimum character requirement.

---

# 11. Sprint Scope

## Included in Sprint 18

| Area | What is included |
|------|-----------------|
| Backend | `POST /capture/ocr` endpoint — accepts image, returns extracted text |
| Backend | `POST /capture` endpoint — accepts source_type, ocr_text, personal_insight, metadata |
| Backend | OCR service using Tesseract (pytesseract) |
| Backend | Capture service that normalizes input into Wisdom Entry format |
| Backend | Database migration adding `source_type` and `source_metadata` to `anubhavs` table |
| Backend | Integration with existing extraction, embedding, relationship, reflection services |
| Frontend | Capture entry point on World page |
| Frontend | Source selection screen (Book only in Sprint 18) |
| Frontend | Image capture/upload screen with OCR |
| Frontend | Personal insight screen |
| Frontend | Review and submit screen |
| Frontend | Wisdom Entry display showing source badge |

## Explicitly excluded from Sprint 18

| What | Why excluded |
|------|--------------|
| PDF upload | Separate parsing complexity. Future sprint. |
| Voice/audio capture | Requires speech-to-text service. Future sprint. |
| YouTube / podcast | Requires transcript extraction. Future sprint. |
| Website / URL capture | Requires web scraping. Future sprint. |
| Research paper parsing | Requires academic format handling. Future sprint. |
| Multi-page book scanning | Sprint 18 handles single page only. |
| Editing a Wisdom Entry after submission | Existing edit flow handles this. |
| Source-specific search filters | Unified search is sufficient for Sprint 18. |

---

# 12. Milestones

---

## Milestone 1: Database Migration

**Objective:** Extend the `anubhavs` table to support source tracking without breaking existing data.

**Deliverables:**
- New Alembic migration file
- `source_type` column added (VARCHAR, default `'experience'`)
- `source_metadata` column added (JSONB, nullable)
- All existing rows default correctly

**Files:**

apps/api/alembic/versions/[hash]_add_source_type_to_anubhavs.py


**Migration schema:**
```sql
ALTER TABLE anubhavs
ADD COLUMN source_type VARCHAR(50) NOT NULL DEFAULT 'experience';

ALTER TABLE anubhavs
ADD COLUMN source_metadata JSONB;

Rollback:

{}SQL

ALTER TABLE anubhavs DROP COLUMN source_metadata;
ALTER TABLE anubhavs DROP COLUMN source_type;

Testing:

Run migration on development database
Verify existing experience records have source_type = 'experience'
Verify source_metadata is NULL for existing records
Verify new experience creation still works
Regression checklist:

 Existing experience creation works
 Existing experience retrieval works
 World page loads
 Search works
 Reflections load
Acceptance criteria:

Migration runs without error
Migration is reversible without data loss
All existing functionality passes regression checklist
Milestone 2: OCR Service
Objective: Build the server-side OCR capability.

Deliverables:

ocr_service.py in apps/api/app/services/
Accepts image bytes
Returns extracted text string
Handles failures gracefully
Files:
apps/api/app/services/ocr_service.py

Dependencies to add to requirements.txt:
pytesseract==0.3.10
Pillow==10.3.0

Note: Tesseract must be installed on the system separately. Document the installation command.

Service interface:

{}Python

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Accepts raw image bytes.
    Returns extracted text string.
    Raises OcrExtractionError if extraction fails.
    Raises OcrEmptyResultError if no text is found.
    """
Error cases:

Image is corrupted → raise OcrExtractionError
Image contains no detectable text → raise OcrEmptyResultError
Unsupported image format → raise OcrUnsupportedFormatError
Tesseract not installed → raise OcrServiceUnavailableError
Testing:

Unit test with a clear book page image → verify text is extracted
Unit test with a blank image → verify OcrEmptyResultError
Unit test with a corrupted file → verify OcrExtractionError
Acceptance criteria:

OCR extracts readable text from a clear photograph of a book page
All error cases return appropriate typed exceptions
No unhandled exceptions propagate
Milestone 3: Capture Service
Objective: Build the service that normalizes a capture input into a Wisdom Entry and passes it to the existing AI pipeline.

Deliverables:

capture_service.py in apps/api/app/services/
Files:
apps/api/app/services/capture_service.py

Service responsibility:
Input:
  user_id
  source_type        ("book")
  ocr_text           (from OCR service)
  personal_insight   (user's own words)
  metadata           (book title, author, page number — all optional)

Process:
  1. Validate personal_insight minimum length (50 characters)
  2. Compose description = ocr_text + "\n\n" + personal_insight
  3. Create anubhav record with source_type and source_metadata
  4. Call extraction_service (unchanged)
  5. Call embedding_service (unchanged)
  6. Call relationship_service (unchanged)
  7. Call reflection_service (unchanged)

Output:
  Created Wisdom Entry with all AI fields populated

Critical: Steps 4–7 must call the existing services with no modification to those services. The capture service is a coordinator, not a replacement.

Acceptance criteria:

A book capture creates a record in anubhavs with source_type = 'book'
source_metadata stores book title, author, page number if provided
AI pipeline runs identically to experience creation
Embedding is created
Relationships are found
Reflection is generated
Milestone 4: API Endpoints
Objective: Expose the capture capability through two endpoints.

Deliverables:

routers/capture.py
Router registered in main.py
Files:
apps/api/app/routers/capture.py
apps/api/main.py  (modified — add capture router)

Endpoint 1: OCR
POST /capture/ocr
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
  image: File

Response 200:
{
  "extracted_text": "It is not the critic who counts...",
  "word_count": 142,
  "confidence": "high"
}

Response 400:
{
  "error": "ocr_empty_result",
  "message": "No text could be extracted from the image. Try a clearer photograph."
}

Response 422:
{
  "error": "ocr_unsupported_format",
  "message": "Supported formats: JPEG, PNG, WEBP"
}

Response 503:
{
  "error": "ocr_service_unavailable",
  "message": "OCR service is not available."
}

Endpoint 2: Capture Submit
POST /capture
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "source_type": "book",
  "ocr_text": "It is not the critic who counts...",
  "personal_insight": "This made me think about how I approach feedback at work. I spend too much time worrying about critics rather than staying in the arena.",
  "metadata": {
    "book_title": "Citizenship in a Republic",
    "author": "Theodore Roosevelt",
    "page_number": "7"
  }
}

Response 201:
{
  "id": "uuid",
  "source_type": "book",
  "title": "AI-generated title",
  "lesson": "AI-extracted lesson",
  "summary": "AI-generated summary",
  "tags": ["resilience", "feedback", "courage"],
  "source_metadata": {
    "book_title": "Citizenship in a Republic",
    "author": "Theodore Roosevelt",
    "page_number": "7"
  },
  "created_at": "2026-07-15T00:00:00Z"
}

Response 400:
{
  "error": "insight_too_short",
  "message": "Personal insight must be at least 50 characters. Your wisdom deserves more than a few words."
}

Response 400:
{
  "error": "invalid_source_type",
  "message": "source_type must be one of: book"
}

Registration in main.py:

from app.routers import capture
app.include_router(capture.router, prefix="/capture", tags=["capture"])

Acceptance criteria:

POST /capture/ocr returns extracted text for a valid image
POST /capture/ocr returns appropriate error for each failure case
POST /capture creates a complete Wisdom Entry
POST /capture rejects personal_insight shorter than 50 characters
Both endpoints require authentication
Both endpoints are documented in OpenAPI (automatic with FastAPI)
Milestone 5: Frontend Capture Flow
Objective: Build the user-facing capture experience.

Deliverables:

New route: apps/web/app/(app)/capture/
Capture page with multi-step flow
Source selection (Book only)
Image upload + OCR display
Personal insight input
Metadata input (optional)
Review and submit
World page updated with Capture entry point
Files:
apps/web/app/(app)/capture/page.tsx        (new)
apps/web/services/api.ts                   (modified — add capture API calls)
apps/web/types/index.ts                    (modified — add WisdomEntry, CaptureSource types)
apps/web/app/(app)/world/page.tsx          (modified — add Capture button)

Flow:
World Page
  |
  [+ Capture Wisdom] button
  |
  v
Step 1: Choose Source
  [ Book ]
  (future: PDF, Voice, Website...)
  |
  v
Step 2: Capture Image
  [ Upload image / Take photo ]
  OCR runs automatically on upload
  Extracted text displayed for review
  User can edit extracted text
  |
  v
Step 3: Your Insight
  Large text area
  Prompt: "What does this mean to you personally?"
  Minimum: 50 characters
  Character counter shown
  |
  v
Step 4: Book Details (optional)
  Book title
  Author
  Page number
  |
  v
Step 5: Review
  Shows: extracted text, personal insight, book details
  [ Submit ] button
  |
  v
Processing screen
  "Extracting wisdom..."
  |
  v
Success
  Shows created Wisdom Entry
  [ View in World ] link

API calls to add to services/api.ts:
{}TypeScript

// Submit image for OCR
uploadForOcr(imageFile: File): Promise<OcrResult>

// Submit capture
submitCapture(data: CaptureSubmission): Promise<WisdomEntry>

Types to add to types/index.ts:
{}TypeScript

type CaptureSourceType = 'book'

interface OcrResult {
  extracted_text: string
  word_count: number
  confidence: string
}

interface BookMetadata {
  book_title?: string
  author?: string
  page_number?: string
}

interface CaptureSubmission {
  source_type: CaptureSourceType
  ocr_text: string
  personal_insight: string
  metadata?: BookMetadata
}

interface WisdomEntry {
  id: string
  source_type: CaptureSourceType | 'experience'
  title: string
  lesson: string
  summary: string
  tags: string[]
  source_metadata?: BookMetadata
  created_at: string
}

Acceptance criteria:

Capture button visible on World page
Multi-step flow completes without error on happy path
OCR result displayed to user before submission
User can edit OCR text
Personal insight enforces 50 character minimum
Book details are optional
Successful submission displays created entry
World page reflects new entry after submission
Milestone 6: Wisdom Entry Display
Objective: Existing pages that display experiences should show source badges for book entries.

Deliverables:

Source badge component
World page updated to show badges
Experience list updated to show badges
Files:

apps/web/components/ui/SourceBadge.tsx     (new)
apps/web/app/(app)/world/page.tsx          (modified)
apps/web/app/(app)/experiences/page.tsx    (modified)

Badge design:

Experience → no badge (existing behavior preserved)
Book       → small badge: "📖 Book"

Acceptance criteria:

Book entries show source badge
Experience entries show no badge (backward compatible)
Badge is visually distinct but not distracting
13. API Changes
New endpoints

POST /capture/ocr
POST /capture

Modified endpoints
None. All existing endpoints are unchanged.

Full endpoint reference
POST /capture/ocr
Auth required: Yes (Bearer token)
Content-Type: multipart/form-data

Request:

image: File  (JPEG, PNG, or WEBP)

Success response (200):

{}JSON

{
  "extracted_text": "string",
  "word_count": 142,
  "confidence": "high | medium | low"
}

Error responses:

{}JSON

400: { "error": "ocr_empty_result", "message": "string" }
422: { "error": "ocr_unsupported_format", "message": "string" }
503: { "error": "ocr_service_unavailable", "message": "string" }

POST /capture
Auth required: Yes (Bearer token)
Content-Type: application/json

Request:

{}JSON

{
  "source_type": "book",
  "ocr_text": "string",
  "personal_insight": "string (min 50 chars)",
  "metadata": {
    "book_title": "string (optional)",
    "author": "string (optional)",
    "page_number": "string (optional)"
  }
}

Success response (201):

{}JSON

{
  "id": "uuid",
  "source_type": "book",
  "title": "string",
  "lesson": "string",
  "summary": "string",
  "tags": ["string"],
  "source_metadata": {},
  "created_at": "ISO8601"
}

Error responses:

{}JSON

400: { "error": "insight_too_short", "message": "string" }
400: { "error": "invalid_source_type", "message": "string" }

14. Database Migration
Migration file
Location: apps/api/alembic/versions/[autogenerated_hash]_add_source_type_to_anubhavs.py

Up migration:

{}Python

def upgrade() -> None:
    op.add_column(
        'anubhavs',
        sa.Column(
            'source_type',
            sa.String(50),
            nullable=False,
            server_default='experience'
        )
    )
    op.add_column(
        'anubhavs',
        sa.Column(
            'source_metadata',
            postgresql.JSONB(),
            nullable=True
        )
    )
    op.create_index(
        'ix_anubhavs_source_type',
        'anubhavs',
        ['source_type']
    )

Down migration:

{}Python

def downgrade() -> None:
    op.drop_index('ix_anubhavs_source_type', table_name='anubhavs')
    op.drop_column('anubhavs', 'source_metadata')
    op.drop_column('anubhavs', 'source_type')

Run migration:

{}PowerShell

cd apps\api
.venv\Scripts\Activate.ps1
alembic upgrade head

Verify migration:

{}PowerShell

alembic current

Rollback if needed:

{}PowerShell

alembic downgrade -1

15. Frontend Flow
World Page (/world)
  |
  [+ Capture Wisdom] button  ← new
  |
  v
/capture
  |
  Step 1: Source Selection
  [ Book ] (only option in Sprint 18)
  |
  v
  Step 2: Image Capture
  [ Upload Image ]
  ↓ auto-triggers OCR on upload
  Extracted text displayed in editable text area
  [ Continue ] button (enabled when text is present)
  |
  v
  Step 3: Personal Insight
  Text area with prompt
  Character counter
  [ Continue ] button (enabled at 50+ characters)
  |
  v
  Step 4: Book Details
  Book title (optional text input)
  Author (optional text input)
  Page number (optional text input)
  [ Continue ] button (always enabled — fields are optional)
  |
  v
  Step 5: Review
  Displays all entered information
  [ Submit ] button
  |
  v
  Processing
  Spinner + "Extracting wisdom from your reading..."
  (API call in progress)
  |
  v
  Success
  Displays created Wisdom Entry title and lesson
  [ View in World ] → navigates to /world
  [ Add Another ] → resets to Step 1

16. Backend Flow
POST /capture/ocr
  |
  Router: capture.py → ocr_endpoint()
  |
  v
  ocr_service.extract_text_from_image(image_bytes)
  |
  Tesseract processes image
  |
  Returns: { extracted_text, word_count, confidence }
  |
  Response sent to frontend


POST /capture
  |
  Router: capture.py → capture_endpoint()
  |
  Validate: source_type in allowed list
  Validate: personal_insight >= 50 chars
  |
  v
  capture_service.create_wisdom_entry(
    user_id, source_type, ocr_text, personal_insight, metadata
  )
  |
  v
  Compose description = ocr_text + "\n\n" + personal_insight
  |
  v
  Create anubhav record (source_type, source_metadata set)
  |
  v
  extraction_service.extract(description)    ← UNCHANGED SERVICE
  |
  v
  embedding_service.embed(lesson + summary)  ← UNCHANGED SERVICE
  |
  v
  relationship_service.find_and_store(id)    ← UNCHANGED SERVICE
  |
  v
  reflection_service.generate(id)            ← UNCHANGED SERVICE
  |
  v
  Return completed WisdomEntry to router
  |
  Response 201 sent to frontend

17. Error Handling
OCR errors
Scenario    Error code    HTTP status    User message
Image file is corrupted    ocr_extraction_error    400    "Could not read this image. Please try a different photo."
No text detected in image    ocr_empty_result    400    "No text found in this image. Try a clearer photograph with better lighting."
Unsupported file format    ocr_unsupported_format    422    "Please upload a JPEG, PNG, or WEBP image."
Tesseract not installed    ocr_service_unavailable    503    "OCR service is temporarily unavailable."
Image too large    ocr_file_too_large    413    "Image must be under 10MB."
Capture submission errors
Scenario    Error code    HTTP status    User message
Personal insight too short    insight_too_short    400    "Personal insight must be at least 50 characters."
Invalid source_type    invalid_source_type    400    "Invalid source type."
OCR text empty    ocr_text_required    400    "Book text is required."
AI extraction fails    extraction_failed    500    "Could not process your wisdom entry. Please try again."
Frontend error handling
OCR failure: display error message inline, allow user to retry or type text manually
Submission failure: display error message, preserve all entered data, allow retry
Network failure: display generic retry message, preserve all entered data
18. Regression Checklist
Run this checklist after every milestone and before final delivery.

Authentication
 User can register a new account
 User can log in with existing account
 Invalid credentials are rejected
 Protected routes redirect unauthenticated users to sign-in
Experience creation (must not break)
 User can create a new experience
 AI extraction runs and populates lesson, summary, tags
 Embedding is created for new experience
 Relationships are found for new experience
 Reflection is generated for new experience
 Experience appears on World page
 Experience appears in Experiences list
Search
 Semantic search returns relevant results
 Search works for experiences created before Sprint 18
 Search works for book entries created in Sprint 18
World page
 World page loads without error
 Existing experiences are displayed
 Book entries are displayed with source badge
 Capture button is visible
Reflections
 Reflections page loads
 Existing reflections are displayed
 New reflections generated from book entries appear
Relationships
 Relationships are found between book entries and experiences
 Relationships are found between two book entries
 Relationship display works on experience detail page
Reminders
 Reminder creation still works
 Scheduled reminders still fire
19. Testing Plan
Manual testing (required before each milestone sign-off)
Milestone 1 (Migration):

Run migration
Create a new experience — verify it works identically
Check source_type column exists with default value 'experience'
Milestone 2 (OCR):

Upload a clear photograph of a book page
Verify extracted text is readable and accurate
Upload a blank image — verify error response
Upload a corrupted file — verify error response
Milestone 3 (Capture Service):

Submit a capture with all fields — verify Wisdom Entry created
Submit a capture with no metadata — verify works
Submit a capture with insight under 50 characters — verify rejection
Milestone 4 (API):

Test both endpoints via curl or Postman
Test all error cases
Verify OpenAPI docs show new endpoints
Milestone 5 (Frontend):

Complete the full capture flow from World page to success screen
Verify OCR text is displayed and editable
Verify character counter works
Verify book details are optional
Verify success screen shows created entry
Milestone 6 (Badges):

Verify book entries show badge on World page
Verify experience entries show no badge
Unit tests (new files)

apps/api/tests/test_ocr_service.py
apps/api/tests/test_capture_service.py
apps/api/tests/test_capture_router.py

Integration test
Submit a complete book capture via API and verify:

Record in anubhavs with source_type = 'book'
Record in embeddings
Record in experience_relationships (if other entries exist)
Record in reflections (if other entries exist)
Smoke test (add to existing sprint-17-smoke.ps1 or create sprint-18-smoke.ps1)

POST /capture/ocr    → 200
POST /capture        → 201
GET  /world          → 200 (includes book entry)
GET  /search         → 200 (book entry appears in results)

20. Future Evolution
Sprint 18 establishes the foundation. Every future source plugs into the same Capture Pipeline.

How to add a new source
Add the new source_type to the allowed list in capture_service.py
Build a new extraction method (PDF parser, audio transcriber, URL scraper)
Add a new step in the frontend source selection screen
Add the new metadata schema to BookMetadata-equivalent type
The rest of the pipeline (AI, embedding, relationships, reflections) requires zero changes
Planned future sources

Sprint 18  →  Book (image + OCR)           ← you are here
Sprint 19  →  PDF (file upload + parsing)
Sprint 20  →  Website (URL + scraping)
Sprint 21  →  Voice (audio + transcription)
Sprint 22  →  Podcast (episode + timestamp)
Sprint 23  →  Research Paper (academic format)
Sprint 24  →  Conversation (dialogue capture)

Each sprint adds one source. Each source reuses the same pipeline. By Sprint 24, Anubhav captures wisdom from every major medium humans consume.

Architectural invariant
No matter how many sources are added, this must remain true:

All wisdom entries, regardless of source,
flow through the same AI, embedding,
relationship, and reflection pipeline.

If a future developer violates this — if they build a separate embedding for PDFs or a separate reflection engine for voice — they are breaking the architecture. The power of Anubhav comes from the unified wisdom space. Fragmentation destroys that.


Appendix: File Change Summary
New files

apps/api/app/services/ocr_service.py
apps/api/app/services/capture_service.py
apps/api/app/routers/capture.py
apps/api/app/schemas/capture.py
apps/api/alembic/versions/[hash]_add_source_type_to_anubhavs.py
apps/web/app/(app)/capture/page.tsx
apps/web/components/ui/SourceBadge.tsx
docs/sprint-18-handover.md
scripts/sprint-18-smoke.ps1

Modified files

apps/api/main.py                              (register capture router)
apps/api/requirements.txt                     (add pytesseract, Pillow)
apps/api/app/models/anubhav.py               (add source_type, source_metadata fields)
apps/web/services/api.ts                      (add uploadForOcr, submitCapture)
apps/web/types/index.ts                       (add WisdomEntry, CaptureSubmission types)
apps/web/app/(app)/world/page.tsx             (add Capture button)
apps/web/app/(app)/experiences/page.tsx       (add source badge display)

Untouched files (do not modify)

apps/api/app/services/extraction_service.py
apps/api/app/services/embedding_service.py
apps/api/app/services/relationship_service.py
apps/api/app/services/reflection_service.py
apps/api/app/services/semantic_search_service.py
apps/api/app/routers/anubhav.py
apps/api/app/routers/reflections.py
apps/api/app/routers/reminder.py
apps/api/app/routers/auth.py
apps/web/app/(app)/experiences/
apps/web/app/(app)/reflections/
apps/web/app/(app)/search/
apps/web/app/(app)/journey/
apps/web/hooks/useAuth.tsx

Document version: Sprint 18 — Multi-Source Wisdom Capture Foundation
Project: Anubhav
Prepared for: incoming developer handover
