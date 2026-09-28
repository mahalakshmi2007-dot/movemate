from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.routes import cities, calculator, plans, recommendations, analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MoveMate API",
    description="Smart Relocation & Budget Planning Assistant backend.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the deployed frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Never leak stack traces to the client.
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


app.include_router(cities.router)
app.include_router(calculator.router)
app.include_router(plans.router)
app.include_router(recommendations.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "MoveMate API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
