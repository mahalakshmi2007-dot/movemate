from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services.analytics_service import compute_analytics

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    plans = db.query(models.MovePlan).all()
    data = compute_analytics(plans)
    return schemas.AnalyticsResponse(**data)
