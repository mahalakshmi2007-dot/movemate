"""Pydantic request/response schemas."""
from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, EmailStr, ConfigDict

StayType = Literal["Shared Room", "PG", "Private Room", "1BHK"]
FoodPreference = Literal["Mostly Home Food", "Mixed", "Mostly Outside Food"]
TransportPreference = Literal[
    "Public Transport", "Two Wheeler", "Walking + Public Transport", "Cab/Auto"
]


# ---------- City ----------
class CityBase(BaseModel):
    city_name: str
    state: str
    average_rent: float
    food_cost: float
    transport_cost: float
    utilities_cost: float
    other_cost: float
    description: Optional[str] = None


class CityOut(CityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    estimated_total: float


# ---------- Calculator ----------
class CalculateRequest(BaseModel):
    destination_city: str
    monthly_budget: float = Field(gt=0, description="Must be greater than 0")
    stay_type: StayType
    food_preference: FoodPreference
    transport_preference: TransportPreference


class ExpenseBreakdown(BaseModel):
    rent: float
    food: float
    transport: float
    utilities: float
    other: float


class CalculateResponse(BaseModel):
    destination_city: str
    monthly_budget: float
    breakdown: ExpenseBreakdown
    total_estimated_cost: float
    remaining_budget: float
    budget_status: str
    recommendations: List[str]


# ---------- Plans ----------
class MovePlanCreate(BaseModel):
    user_id: Optional[int] = None
    destination_city: str
    monthly_budget: float = Field(gt=0)
    stay_type: StayType
    food_preference: FoodPreference
    transport_preference: TransportPreference


class MovePlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    destination_city: str
    monthly_budget: float
    stay_type: str
    food_preference: str
    transport_preference: str
    estimated_rent: float
    estimated_food: float
    estimated_transport: float
    estimated_utilities: float
    estimated_other: float
    total_estimated_cost: float
    remaining_budget: float
    budget_status: str
    created_at: datetime


class MovePlanDetail(MovePlanOut):
    recommendations: List[str] = []


# ---------- Recommendations ----------
class RecommendationRequest(BaseModel):
    monthly_budget: float
    total_estimated_cost: float
    remaining_budget: float
    estimated_rent: float
    estimated_transport: float
    transport_preference: TransportPreference


class RecommendationResponse(BaseModel):
    recommendations: List[str]


# ---------- Analytics ----------
class AnalyticsResponse(BaseModel):
    total_plans: int
    average_estimated_cost: float
    average_budget: float
    most_selected_city: Optional[str]
    average_remaining_budget: float
    status_breakdown: dict
