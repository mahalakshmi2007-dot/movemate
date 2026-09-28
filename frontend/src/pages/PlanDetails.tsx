import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowLeft, CheckCircle2, Trash2 } from "lucide-react";
import { deletePlan, fetchPlan, getErrorMessage } from "../services/api";
import type { MovePlanDetail } from "../types";
import { currency, ErrorState, LoadingState, StatusBadge } from "../components/Shared";

const CHART_COLORS = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899"];

export default function PlanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MovePlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPlan(Number(id))
      .then(setPlan)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!plan) return;
    if (!window.confirm("Delete this plan? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deletePlan(plan.id);
      navigate("/plans");
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) return <LoadingState message="Loading plan details..." />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorState message={error} /></div>;
  if (!plan) return null;

  const chartData = [
    { name: "Rent", value: plan.estimated_rent },
    { name: "Food", value: plan.estimated_food },
    { name: "Transport", value: plan.estimated_transport },
    { name: "Utilities", value: plan.estimated_utilities },
    { name: "Other", value: plan.estimated_other },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/plans" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Back to Saved Plans
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{plan.destination_city}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Saved on {new Date(plan.created_at).toLocaleDateString()}
          </p>
        </div>
        <button onClick={handleDelete} disabled={deleting} className="btn-secondary text-rose-600">
          <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete Plan"}
        </button>
      </div>

      <div className="card mt-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monthly Budget</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{currency(plan.monthly_budget)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated Cost</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{currency(plan.total_estimated_cost)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Remaining Budget</p>
            <p className={`mt-1 text-xl font-bold ${plan.remaining_budget < 0 ? "text-rose-600" : "text-slate-900"}`}>
              {currency(plan.remaining_budget)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <StatusBadge status={plan.budget_status} />
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Preferences</h3>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-slate-500">Accommodation</p>
            <p className="font-medium text-slate-900">{plan.stay_type}</p>
          </div>
          <div>
            <p className="text-slate-500">Food Preference</p>
            <p className="font-medium text-slate-900">{plan.food_preference}</p>
          </div>
          <div>
            <p className="text-slate-500">Transportation</p>
            <p className="font-medium text-slate-900">{plan.transport_preference}</p>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Expense Breakdown</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => currency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-3 self-center">
            {chartData.map((item, idx) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900">{currency(item.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {plan.recommendations.length > 0 && (
        <div className="card mt-6 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Personalized Recommendations</h3>
          <ul className="space-y-2">
            {plan.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
