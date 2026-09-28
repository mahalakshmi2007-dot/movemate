"""SQLAlchemy ORM models for MoveMate."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    plans = relationship("MovePlan", back_populates="user", cascade="all, delete-orphan")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    city_name = Column(String(100), unique=True, index=True, nullable=False)
    state = Column(String(100), nullable=False)
    average_rent = Column(Float, nullable=False)
    food_cost = Column(Float, nullable=False)
    transport_cost = Column(Float, nullable=False)
    utilities_cost = Column(Float, nullable=False)
    other_cost = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

    plans = relationship("MovePlan", back_populates="city")

    @property
    def estimated_total(self) -> float:
        return (
            self.average_rent
            + self.food_cost
            + self.transport_cost
            + self.utilities_cost
            + self.other_cost
        )


class MovePlan(Base):
    __tablename__ = "move_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)

    destination_city = Column(String(100), nullable=False)
    monthly_budget = Column(Float, nullable=False)
    stay_type = Column(String(50), nullable=False)
    food_preference = Column(String(50), nullable=False)
    transport_preference = Column(String(50), nullable=False)

    estimated_rent = Column(Float, nullable=False)
    estimated_food = Column(Float, nullable=False)
    estimated_transport = Column(Float, nullable=False)
    estimated_utilities = Column(Float, nullable=False)
    estimated_other = Column(Float, nullable=False)
    total_estimated_cost = Column(Float, nullable=False)
    remaining_budget = Column(Float, nullable=False)
    budget_status = Column(String(30), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="plans")
    city = relationship("City", back_populates="plans")
