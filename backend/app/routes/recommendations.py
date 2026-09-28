from fastapi import APIRouter

from app import schemas
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("", response_model=schemas.RecommendationResponse)
def get_recommendations(payload: schemas.RecommendationRequest):
    recs = generate_recommendations(
        monthly_budget=payload.monthly_budget,
        total_estimated_cost=payload.total_estimated_cost,
        remaining_budget=payload.remaining_budget,
        estimated_rent=payload.estimated_rent,
        estimated_transport=payload.estimated_transport,
        transport_preference=payload.transport_preference,
    )
    return schemas.RecommendationResponse(recommendations=recs)
