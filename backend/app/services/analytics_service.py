"""Analytics computed over saved MovePlan records, using pandas."""
from typing import List
import pandas as pd

from app.models import MovePlan


def compute_analytics(plans: List[MovePlan]) -> dict:
    if not plans:
        return {
            "total_plans": 0,
            "average_estimated_cost": 0.0,
            "average_budget": 0.0,
            "most_selected_city": None,
            "average_remaining_budget": 0.0,
            "status_breakdown": {},
        }

    df = pd.DataFrame(
        [
            {
                "destination_city": p.destination_city,
                "monthly_budget": p.monthly_budget,
                "total_estimated_cost": p.total_estimated_cost,
                "remaining_budget": p.remaining_budget,
                "budget_status": p.budget_status,
            }
            for p in plans
        ]
    )

    most_selected_city = df["destination_city"].mode().iloc[0] if not df.empty else None
    status_breakdown = df["budget_status"].value_counts().to_dict()

    return {
        "total_plans": int(len(df)),
        "average_estimated_cost": round(float(df["total_estimated_cost"].mean()), 2),
        "average_budget": round(float(df["monthly_budget"].mean()), 2),
        "most_selected_city": most_selected_city,
        "average_remaining_budget": round(float(df["remaining_budget"].mean()), 2),
        "status_breakdown": status_breakdown,
    }
