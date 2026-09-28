import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, Info, Save, Wallet } from "lucide-react";
import {
  calculateBudget,
  createPlan,
  fetchCities,
  getErrorMessage,
} from "../services/api";
import type {
  CalculateResponse,
  City,
  FoodPreference,
  StayType,
  TransportPreference,
} from "../types";
import { currency, ErrorState, LoadingState, StatusBadge } from "../components/Shared";

const STAY_OPTIONS: StayType[] = ["Shared Room", "PG", "Private Room", "1BHK"];
const FOOD_OPTIONS: FoodPreference[] = ["Mostly Home Food", "Mixed", "Mostly Outside Food"];
const TRANSPORT_OPTIONS: TransportPreference[] = [
  "Public Transport",
  "Two Wheeler",
  "Walking + Public Transport",
  "Cab/Auto",
];

const CHART_COLORS = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899"];

export default function PlanMove() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const [destinationCity, setDestinationCity] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [stayType, setStayType] = useState<StayType>("PG");
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("Mixed");
  const [transportPreference, setTransportPreference] = useState<TransportPreference>("Public Transport");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");
  const [result, setResult] = useState<CalculateResponse | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchCities()
      .then((data) => {
        setCities(data);
        if (data.length > 0) setDestinationCity(data[0].city_name);
      })
      .catch((err) => setCitiesError(getErrorMessage(err)))
      .finally(() => setCitiesLoading(false));
  }, []);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!destinationCity) errors.destinationCity = "Please select a destination city.";
    const budgetNum = Number(monthlyBudget);
    if (!monthlyBudget || Number.isNaN(budgetNum) || budgetNum <= 0) {
      errors.monthlyBudget = "Budget must be greater than 0.";
    }
    if (!stayType) errors.stayType = "Please select an accommodation type.";
    if (!foodPreference) errors.foodPreference = "Please select a food preference.";
    if (!transportPreference) errors.transportPreference = "Please select a transport preference.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCalculate(e: FormEvent) {
    e.preventDefault();
    setCalcError("");
    setSaved(false);
    setSaveError("");
    if (!validate()) return;

    setCalculating(true);
    setResult(null);
    try {
      const data = await calculateBudget({
        destination_city: destinationCity,
        monthly_budget: Number(monthlyBudget),
        stay_type: stayType,
        food_preference: foodPreference,
        transport_preference: transportPreference,
      });
      setResult(data);
    } catch (err) {
      setCalcError(getErrorMessage(err));
    } finally {
      setCalculating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const plan = await createPlan({
        destination_city: destinationCity,
        monthly_budget: Number(monthlyBudget),
        stay_type: stayType,
        food_preference: foodPreference,
        transport_preference: transportPreference,
      });
      setSaved(true);
      setTimeout(() => navigate(`/plans/${plan.id}`), 900);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const chartData = result
    ? [
        { name: "Rent", value: result.breakdown.rent },
        { name: "Food", value: result.breakdown.food },
        { name: "Transport", value: result.breakdown.transport },
        { name: "Utilities", value: result.breakdown.utilities },
        { name: "Other", value: result.breakdown.other },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Plan Your Move</h1>
      <p className="mt-1 text-sm text-slate-600">
        Tell us about your move and we'll estimate your monthly cost of living.
      </p>

      {citiesLoading ? (
        <LoadingState message="Loading cities..." />
      ) : citiesError ? (
        <ErrorState message={citiesError} />
      ) : (
        <form onSubmit={handleCalculate} className="card mt-6 space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label-text">Destination City</label>
              <select
                className="input-field"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.city_name}>
                    {c.city_name}, {c.state}
                  </option>
                ))}
              </select>
              {formErrors.destinationCity && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.destinationCity}</p>
              )}
            </div>

            <div>
              <label className="label-text">Monthly Budget (₹)</label>
              <input
                type="number"
                min={1}
                className="input-field"
                placeholder="e.g. 15000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
              {formErrors.monthlyBudget && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.monthlyBudget}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label-text">Accommodation</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STAY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setStayType(opt)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    stayType === opt
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Food Preference</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {FOOD_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFoodPreference(opt)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    foodPreference === opt
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Transportation</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {TRANSPORT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setTransportPreference(opt)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    transportPreference === opt
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {calcError && <ErrorState message={calcError} />}

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={calculating}>
            <Wallet size={18} />
            {calculating ? "Calculating your estimated monthly cost..." : "Calculate My Budget"}
          </button>
        </form>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monthly Budget</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{currency(result.monthly_budget)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated Monthly Cost</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{currency(result.total_estimated_cost)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Remaining Budget</p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    result.remaining_budget < 0 ? "text-rose-600" : "text-slate-900"
                  }`}
                >
                  {currency(result.remaining_budget)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <StatusBadge status={result.budget_status} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">Expense Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {chartData.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => currency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">Cost Details</h3>
              <ul className="space-y-3">
                {chartData.map((item, idx) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-semibold text-slate-900">{currency(item.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Info size={18} className="text-brand-600" /> How We Calculated This
            </h3>
            <p className="text-sm text-slate-600">
              We start from {result.destination_city}'s baseline living costs, then adjust rent for your
              accommodation type, food cost for your eating habits, and transport cost for your commute
              preference. Utilities and other miscellaneous costs use the city baseline. These are estimates
              only and can vary based on your actual lifestyle and locality.
            </p>
          </div>

          {result.recommendations.length > 0 && (
            <div className="card p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Personalized Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {saveError && <ErrorState message={saveError} />}

          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={handleSave} disabled={saving || saved}>
              <Save size={18} />
              {saved ? "Saved!" : saving ? "Saving..." : "Save This Plan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
