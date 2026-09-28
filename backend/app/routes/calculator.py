from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services.calculator_service import calculate_expenses, determine_budget_status
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/api/calculate", tags=["calculator"])


@router.post("", response_model=schemas.CalculateResponse)
def calculate(payload: schemas.CalculateRequest, db: Session = Depends(get_db)):
    city = (
        db.query(models.City)
        .filter(models.City.city_name == payload.destination_city)
        .first()
    )
    if not city:
        raise HTTPException(status_code=404, detail=f"City '{payload.destination_city}' not found")

    result = calculate_expenses(
        city, payload.stay_type, payload.food_preference, payload.transport_preference
    )
    remaining = round(payload.monthly_budget - result["total"], 2)
    status = determine_budget_status(payload.monthly_budget, result["total"])

    recommendations = generate_recommendations(
        monthly_budget=payload.monthly_budget,
        total_estimated_cost=result["total"],
        remaining_budget=remaining,
        estimated_rent=result["rent"],
        estimated_transport=result["transport"],
        transport_preference=payload.transport_preference,
    )

    return schemas.CalculateResponse(
        destination_city=payload.destination_city,
        monthly_budget=payload.monthly_budget,
        breakdown=schemas.ExpenseBreakdown(
            rent=result["rent"],
            food=result["food"],
            transport=result["transport"],
            utilities=result["utilities"],
            other=result["other"],
        ),
        total_estimated_cost=result["total"],
        remaining_budget=remaining,
        budget_status=status,
        recommendations=recommendations,
    )
