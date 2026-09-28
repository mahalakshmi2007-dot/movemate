import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeIndianRupee, MapPin, PiggyBank, Wallet } from "lucide-react";
import { fetchAnalytics, getErrorMessage } from "../services/api";
import type { AnalyticsResponse } from "../types";
import { currency, EmptyState, ErrorState, LoadingState } from "../components/Shared";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Crunching your analytics..." />;
  if (error) return <div className="mx-auto max-w-4xl px-4 py-10"><ErrorState message={error} /></div>;
  if (!data) return null;

  if (data.total_plans === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <div className="mt-8">
          <EmptyState
            title="No data yet"
            description="Save at least one relocation plan to see analytics here."
            action={
              <Link to="/plan" className="btn-primary mt-2">
                Plan Your Move
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const statusChartData = Object.entries(data.status_breakdown).map(([status, count]) => ({
    status,
    count,
  }));

  const stats = [
    { label: "Total Plans", value: data.total_plans.toString(), icon: Wallet },
    { label: "Average Estimated Cost", value: currency(data.average_estimated_cost), icon: BadgeIndianRupee },
    { label: "Average Budget", value: currency(data.average_budget), icon: PiggyBank },
    { label: "Most Selected City", value: data.most_selected_city || "—", icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      <p className="mt-1 text-sm text-slate-600">Trends across all of your saved relocation plans.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <s.icon size={18} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Average Remaining Budget</p>
          <p
            className={`mt-1 text-xl font-bold ${
              data.average_remaining_budget < 0 ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {currency(data.average_remaining_budget)}
          </p>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Plans by Budget Status</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
