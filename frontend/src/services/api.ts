import axios from "axios";
import type {
  City,
  CalculateRequest,
  CalculateResponse,
  MovePlan,
  MovePlanDetail,
  AnalyticsResponse,
  StayType,
  FoodPreference,
  TransportPreference,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Friendly error message helper — never surface raw stack traces to the user.
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Unable to connect to the server. Please make sure the backend is running.";
    }
    const detail = (err.response.data as { detail?: string } | undefined)?.detail;
    return detail || "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export async function fetchCities(): Promise<City[]> {
  const res = await api.get<City[]>("/api/cities");
  return res.data;
}

export async function fetchCity(cityId: number): Promise<City> {
  const res = await api.get<City>(`/api/cities/${cityId}`);
  return res.data;
}

export async function calculateBudget(payload: CalculateRequest): Promise<CalculateResponse> {
  const res = await api.post<CalculateResponse>("/api/calculate", payload);
  return res.data;
}

export interface CreatePlanPayload {
  destination_city: string;
  monthly_budget: number;
  stay_type: StayType;
  food_preference: FoodPreference;
  transport_preference: TransportPreference;
}

export async function createPlan(payload: CreatePlanPayload): Promise<MovePlanDetail> {
  const res = await api.post<MovePlanDetail>("/api/plans", payload);
  return res.data;
}

export async function fetchPlans(): Promise<MovePlan[]> {
  const res = await api.get<MovePlan[]>("/api/plans");
  return res.data;
}

export async function fetchPlan(planId: number): Promise<MovePlanDetail> {
  const res = await api.get<MovePlanDetail>(`/api/plans/${planId}`);
  return res.data;
}

export async function deletePlan(planId: number): Promise<void> {
  await api.delete(`/api/plans/${planId}`);
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await api.get<AnalyticsResponse>("/api/analytics");
  return res.data;
}
