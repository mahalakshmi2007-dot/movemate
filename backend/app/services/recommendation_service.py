"""
Rule-based recommendation engine.

Deliberately kept as a standalone function that takes plain numbers/strings
in and returns a list of strings out, so it can later be swapped for (or
augmented with) a call to an LLM API without changing any callers.
"""
from typing import List


def generate_recommendations(
    monthly_budget: float,
    total_estimated_cost: float,
    remaining_budget: float,
    estimated_rent: float,
    estimated_transport: float,
    transport_preference: str,
) -> List[str]:
    recommendations: List[str] = []

    if remaining_budget < 0:
        recommendations.append(
            "Your estimated expenses exceed your monthly budget. Consider shared "
            "accommodation or reducing outside food expenses."
        )
    elif monthly_budget > 0 and (remaining_budget / monthly_budget) >= 0.20:
        recommendations.append(
            "Your estimated expenses are within your budget. You have some room "
            "for unexpected expenses."
        )
    else:
        recommendations.append(
            "Your budget is workable but leaves limited room for extra spending. "
            "Track your expenses closely in the first few months."
        )

    if monthly_budget > 0 and (estimated_rent / monthly_budget) > 0.4:
        recommendations.append(
            "Shared accommodation could significantly reduce your monthly housing cost."
        )

    if transport_preference in ("Cab/Auto", "Two Wheeler") and monthly_budget > 0 and (
        estimated_transport / monthly_budget
    ) > 0.15:
        recommendations.append(
            "Choosing public transport may reduce your monthly transportation cost."
        )

    if total_estimated_cost > 0 and estimated_transport / total_estimated_cost > 0.25:
        recommendations.append(
            "Transportation makes up a large share of your estimated cost — walking "
            "or public transport for shorter trips could help."
        )

    return recommendations
