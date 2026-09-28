from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/cities", tags=["cities"])


@router.get("", response_model=list[schemas.CityOut])
def list_cities(db: Session = Depends(get_db)):
    cities = db.query(models.City).order_by(models.City.city_name).all()
    return [
        schemas.CityOut(
            id=c.id,
            city_name=c.city_name,
            state=c.state,
            average_rent=c.average_rent,
            food_cost=c.food_cost,
            transport_cost=c.transport_cost,
            utilities_cost=c.utilities_cost,
            other_cost=c.other_cost,
            description=c.description,
            estimated_total=c.estimated_total,
        )
        for c in cities
    ]


@router.get("/{city_id}", response_model=schemas.CityOut)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return schemas.CityOut(
        id=city.id,
        city_name=city.city_name,
        state=city.state,
        average_rent=city.average_rent,
        food_cost=city.food_cost,
        transport_cost=city.transport_cost,
        utilities_cost=city.utilities_cost,
        other_cost=city.other_cost,
        description=city.description,
        estimated_total=city.estimated_total,
    )
