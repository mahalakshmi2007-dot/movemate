# MoveMate

**Smart Relocation & Budget Planning Assistant.**

MoveMate helps students and employees moving to a new city estimate their monthly cost of
living, compare cities, and plan their relocation budget with real, backend-calculated
numbers — not guesswork.

> All city costs used by this app are **rough estimates** for a student / young-professional
> lifestyle. They are illustrative starting points, not official or exact real-world prices,
> and will vary based on lifestyle, exact locality, and time.

---

## Features

- Plan a move: pick a destination city, monthly budget, accommodation, food and transport
  preferences, and get an instant, backend-calculated budget estimate.
- Expense breakdown (rent, food, transport, utilities, other) shown as a donut chart and a
  detailed list.
- Budget status classification: **Comfortable**, **Manageable**, **Tight Budget**, **Over
  Budget**.
- Personalized, rule-based recommendations generated from your actual numbers.
- Compare 2–4 cities side by side in a table and bar chart.
- Save relocation plans, view them later, and delete them — all persisted in a real database.
- Analytics dashboard: total plans, average estimated cost, average budget, most-selected
  city, and a breakdown of plans by budget status (computed with pandas).
- Loading, empty, and error states throughout; frontend + backend validation.
- Fully responsive, works on desktop, tablet, and mobile.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide
React icons.

**Backend:** Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn.

**Database:** SQLite (development). The data layer uses SQLAlchemy's engine/session
abstraction, so switching to PostgreSQL later only requires changing the `DATABASE_URL`
environment variable — no application code needs to change.

**Data / Analytics:** Pandas, NumPy.

**AI / Recommendations:** A rule-based recommendation service (`recommendation_service.py`)
that takes plain numeric/string inputs and returns a list of suggestions. It requires no paid
API key and is deliberately isolated so a real AI/LLM API could be dropped in later without
touching the routes that call it.

## Architecture

```
Frontend (React + TS)  <--REST/JSON-->  Backend (FastAPI)  <-->  SQLite (SQLAlchemy)
                                              |
                                   services/ (calculation, recommendations, analytics)
```

- The frontend never performs the actual budget math — it only sends the user's choices to
  `/api/calculate` (or `/api/plans`) and renders what the backend returns.
- Business logic lives in `backend/app/services/`, kept separate from the HTTP route layer in
  `backend/app/routes/`, so the calculation and recommendation logic can be tested or reused
  independently of FastAPI.

## Project Structure

```
MoveMate/
  frontend/
    src/
      components/   Navbar, Footer, Layout, shared UI (status badge, loading/empty/error states)
      pages/        Home, PlanMove, Compare, Plans, PlanDetails, Analytics
      services/     api.ts — centralized Axios client + typed API functions
      types/        Shared TypeScript interfaces
    package.json
    vite.config.ts
    tsconfig.json
  backend/
    app/
      main.py           FastAPI app, CORS, global exception handler
      database.py        SQLAlchemy engine/session setup
      models.py           User, City, MovePlan ORM models
      schemas.py          Pydantic request/response schemas
      seed.py             Seed script for sample city data
      routes/              cities, calculator, plans, recommendations, analytics
      services/            calculator_service, recommendation_service, analytics_service
    requirements.txt
  README.md
  .gitignore
```

## Database Design

- **User** — `id`, `name`, `email`, `created_at`. A plan can optionally belong to a user
  (`user_id` is nullable so the app works without an auth system yet).
- **City** — `id`, `city_name`, `state`, `average_rent`, `food_cost`, `transport_cost`,
  `utilities_cost`, `other_cost`, `description`.
- **MovePlan** — `id`, `user_id` (FK), `city_id` (FK), `destination_city`, `monthly_budget`,
  `stay_type`, `food_preference`, `transport_preference`, `estimated_rent`, `estimated_food`,
  `estimated_transport`, `estimated_utilities`, `estimated_other`, `total_estimated_cost`,
  `remaining_budget`, `budget_status`, `created_at`.

`User 1—* MovePlan *—1 City`.

## API Endpoints

| Method | Path                     | Description                                  |
|--------|--------------------------|-----------------------------------------------|
| GET    | `/api/cities`            | List all seeded cities                        |
| GET    | `/api/cities/{city_id}`  | Get one city                                  |
| POST   | `/api/calculate`         | Calculate an estimate without saving it       |
| POST   | `/api/plans`             | Calculate **and** save a relocation plan      |
| GET    | `/api/plans`             | List all saved plans                          |
| GET    | `/api/plans/{plan_id}`   | Get one saved plan with recommendations       |
| DELETE | `/api/plans/{plan_id}`   | Delete a saved plan                           |
| POST   | `/api/recommendations`   | Get recommendations for a given set of numbers|
| GET    | `/api/analytics`         | Aggregate analytics across all saved plans    |

Interactive API docs are available at `http://127.0.0.1:8000/docs` once the backend is
running.

## How It Works

1. The user fills out the **Plan Your Move** form (city, budget, accommodation, food,
   transport).
2. The frontend calls `POST /api/calculate`.
3. The backend looks up the city's baseline costs and applies multipliers for the chosen
   accommodation, food, and transport preferences (`calculator_service.py`), then computes a
   budget status (`Comfortable` / `Manageable` / `Tight Budget` / `Over Budget`) and generates
   recommendations (`recommendation_service.py`).
4. The result is returned as JSON and rendered as a dashboard with a chart, breakdown, and
   recommendations — no numbers are calculated in the frontend.
5. The user can save the plan (`POST /api/plans`), which re-runs the same calculation and
   persists it to SQLite.

## Installation

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python -m app.seed          # creates the DB and seeds sample cities
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000` (docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

By default the frontend expects the backend at `http://127.0.0.1:8000` (see `frontend/.env`,
`VITE_API_URL`). Change this if your backend runs elsewhere.

## Running Locally

Run both servers in separate terminals:

**Terminal 1 — backend**
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

**Terminal 2 — frontend**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173`.

## Screenshots

_Add screenshots here after running the app locally:_

- `docs/screenshots/home.png`
- `docs/screenshots/plan-your-move.png`
- `docs/screenshots/compare-cities.png`
- `docs/screenshots/analytics.png`

## Future Improvements

These are **not yet implemented** — they are documented as a roadmap only:

- Migrate from SQLite to PostgreSQL for production use.
- User authentication and per-user saved plans.
- Live/crowdsourced cost-of-living data instead of static seed estimates.
- AI-powered recommendations via an LLM API (the recommendation service is already isolated
  to make this a drop-in change).
- Map integration for visualizing city locations and neighborhoods.
- A relocation checklist (documents, housing search, utilities setup, etc.).
- Salary-to-cost-of-living analysis across cities.
