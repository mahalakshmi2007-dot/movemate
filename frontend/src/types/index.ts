export type StayType = "Shared Room" | "PG" | "Private Room" | "1BHK";
export type FoodPreference = "Mostly Home Food" | "Mixed" | "Mostly Outside Food";
export type TransportPreference =
  | "Public Transport"
  | "Two Wheeler"
  | "Walking + Public Transport"
  | "Cab/Auto";

export interface City {
  id: number;
  city_name: string;
  state: string;
  average_rent: number;
  food_cost: number;
  transport_cost: number;
  utilities_cost: number;
  other_cost: number;
  description?: string | null;
  estimated_total: number;
}

export interface ExpenseBreakdown {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  other: number;
}

export interface CalculateRequest {
  destination_city: string;
  monthly_budget: number;
  stay_type: StayType;
  food_preference: FoodPreference;
  transport_preference: TransportPreference;
}

export interface CalculateResponse {
  destination_city: string;
  monthly_budget: number;
  breakdown: ExpenseBreakdown;
  total_estimated_cost: number;
  remaining_budget: number;
  budget_status: string;
  recommendations: string[];
}

export interface MovePlan {
  id: number;
  destination_city: string;
  monthly_budget: number;
  stay_type: string;
  food_preference: string;
  transport_preference: string;
  estimated_rent: number;
  estimated_food: number;
  estimated_transport: number;
  estimated_utilities: number;
  estimated_other: number;
  total_estimated_cost: number;
  remaining_budget: number;
  budget_status: string;
  created_at: string;
}

export interface MovePlanDetail extends MovePlan {
  recommendations: string[];
}

export interface AnalyticsResponse {
  total_plans: number;
  average_estimated_cost: number;
  average_budget: number;
  most_selected_city: string | null;
  average_remaining_budget: number;
  status_breakdown: Record<string, number>;
}
