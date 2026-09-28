from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services.calculator_service import calculate_expenses, determine_budget_status
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/api/plans", tags=["plans"])


@router.post("", response_model=schemas.MovePlanDetail, status_code=201)
def create_plan(payload: schemas.MovePlanCreate, db: Session = Depends(get_db)):
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

    plan = models.MovePlan(
        user_id=payload.user_id,
        city_id=city.id,
        destination_city=payload.destination_city,
        monthly_budget=payload.monthly_budget,
        stay_type=payload.stay_type,
        food_preference=payload.food_preference,
        transport_preference=payload.transport_preference,
        estimated_rent=result["rent"],
        estimated_food=result["food"],
        estimated_transport=result["transport"],
        estimated_utilities=result["utilities"],
        estimated_other=result["other"],
        total_estimated_cost=result["total"],
        remaining_budget=remaining,
        budget_status=status,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    out = schemas.MovePlanDetail.model_validate(plan)
    out.recommendations = recommendations
    return out


@router.get("", response_model=list[schemas.MovePlanOut])
def list_plans(db: Session = Depends(get_db)):
    plans = db.query(models.MovePlan).order_by(models.MovePlan.created_at.desc()).all()
    return plans


@router.get("/{plan_id}", response_model=schemas.MovePlanDetail)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.MovePlan).filter(models.MovePlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    recommendations = generate_recommendations(
        monthly_budget=plan.monthly_budget,
        total_estimated_cost=plan.total_estimated_cost,
        remaining_budget=plan.remaining_budget,
        estimated_rent=plan.estimated_rent,
        estimated_transport=plan.estimated_transport,
        transport_preference=plan.transport_preference,
    )
    out = schemas.MovePlanDetail.model_validate(plan)
    out.recommendations = recommendations
    return out


@router.delete("/{plan_id}", status_code=204)
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.MovePlan).filter(models.MovePlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(plan)
    db.commit()
    return None
