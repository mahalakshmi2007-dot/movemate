"""
Core budget calculation logic.

Takes a City's base costs and adjusts them according to the user's
accommodation, food and transport preferences. All multipliers live here so
they are easy to tune without touching route handlers.
"""
from app.models import City

STAY_MULTIPLIERS = {
    "Shared Room": 0.65,
    "PG": 0.85,
    "Private Room": 1.15,
    "1BHK": 1.75,
}

FOOD_MULTIPLIERS = {
    "Mostly Home Food": 0.75,
    "Mixed": 1.0,
    "Mostly Outside Food": 1.4,
}

TRANSPORT_MULTIPLIERS = {
    "Walking + Public Transport": 0.6,
    "Public Transport": 1.0,
    "Two Wheeler": 1.25,  # fuel + maintenance
    "Cab/Auto": 1.9,
}


def calculate_expenses(city: City, stay_type: str, food_preference: str, transport_preference: str):
    """Returns a dict with rent, food, transport, utilities, other and total."""
    rent = round(city.average_rent * STAY_MULTIPLIERS.get(stay_type, 1.0), 2)
    food = round(city.food_cost * FOOD_MULTIPLIERS.get(food_preference, 1.0), 2)
    transport = round(
        city.transport_cost * TRANSPORT_MULTIPLIERS.get(transport_preference, 1.0), 2
    )
    utilities = round(city.utilities_cost, 2)
    other = round(city.other_cost, 2)

    total = round(rent + food + transport + utilities + other, 2)

    return {
        "rent": rent,
        "food": food,
        "transport": transport,
        "utilities": utilities,
        "other": other,
        "total": total,
    }


def determine_budget_status(monthly_budget: float, total_estimated_cost: float) -> str:
    remaining = monthly_budget - total_estimated_cost
    if remaining < 0:
        return "Over Budget"
    ratio = remaining / monthly_budget if monthly_budget > 0 else 0
    if ratio >= 0.20:
        return "Comfortable"
    if ratio >= 0.10:
        return "Manageable"
    return "Tight Budget"
