"""
Seed script for MoveMate.

Run with:  python -m app.seed

Safe to re-run: cities are matched by city_name, so existing rows are
updated rather than duplicated.

All figures below are ROUGH ESTIMATES for a student / young-professional
lifestyle, in INR per month. They are illustrative starting points, not
official or exact current market prices, and can be edited later.
"""
from app.database import Base, engine, SessionLocal
from app.models import City

CITY_DATA = [
    dict(city_name="Coimbatore", state="Tamil Nadu", average_rent=7000, food_cost=5000,
         transport_cost=1800, utilities_cost=2000, other_cost=2500,
         description="Mid-sized industrial city with a lower cost of living than major metros."),
    dict(city_name="Chennai", state="Tamil Nadu", average_rent=12000, food_cost=6500,
         transport_cost=2500, utilities_cost=2500, other_cost=3000,
         description="Major metro with higher rent, especially near IT corridors."),
    dict(city_name="Bangalore", state="Karnataka", average_rent=15000, food_cost=7000,
         transport_cost=2800, utilities_cost=2500, other_cost=3500,
         description="India's tech hub; among the higher cost-of-living cities on this list."),
    dict(city_name="Hyderabad", state="Telangana", average_rent=11000, food_cost=6000,
         transport_cost=2200, utilities_cost=2200, other_cost=3000,
         description="Growing IT hub with relatively better rent-to-amenity value than Bangalore."),
    dict(city_name="Pune", state="Maharashtra", average_rent=12500, food_cost=6500,
         transport_cost=2400, utilities_cost=2300, other_cost=3000,
         description="Popular with students and IT professionals; moderate-to-high rent."),
    dict(city_name="Kochi", state="Kerala", average_rent=9000, food_cost=5500,
         transport_cost=2000, utilities_cost=2100, other_cost=2500,
         description="Coastal city with a growing IT sector and moderate living costs."),
    dict(city_name="Madurai", state="Tamil Nadu", average_rent=6000, food_cost=4500,
         transport_cost=1500, utilities_cost=1800, other_cost=2000,
         description="Tier-2 city with a notably lower cost of living."),
    dict(city_name="Trichy", state="Tamil Nadu", average_rent=6500, food_cost=4500,
         transport_cost=1600, utilities_cost=1800, other_cost=2000,
         description="Compact tier-2 city, affordable for students and early professionals."),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        created, updated = 0, 0
        for data in CITY_DATA:
            city = db.query(City).filter(City.city_name == data["city_name"]).first()
            if city:
                for k, v in data.items():
                    setattr(city, k, v)
                updated += 1
            else:
                db.add(City(**data))
                created += 1
        db.commit()
        print(f"Seed complete. Created {created} cities, updated {updated} cities.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
