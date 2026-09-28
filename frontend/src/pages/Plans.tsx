import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Trash2 } from "lucide-react";
import { deletePlan, fetchPlans, getErrorMessage } from "../services/api";
import type { MovePlan } from "../types";
import { currency, EmptyState, ErrorState, LoadingState, StatusBadge } from "../components/Shared";

export default function Plans() {
  const [plans, setPlans] = useState<MovePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    setError("");
    fetchPlans()
      .then(setPlans)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this plan? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Plans</h1>
          <p className="mt-1 text-sm text-slate-600">Review or remove your saved relocation plans.</p>
        </div>
        <Link to="/plan" className="btn-primary">
          <Plus size={18} /> New Plan
        </Link>
      </div>

      {loading ? (
        <LoadingState message="Loading your saved plans..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : plans.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No saved plans yet"
            description="Create a relocation plan to see it listed here."
            action={
              <Link to="/plan" className="btn-primary mt-2">
                Plan Your Move
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Destination</th>
                <th className="py-2 pr-4">Budget</th>
                <th className="py-2 pr-4">Estimated Cost</th>
                <th className="py-2 pr-4">Remaining</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-semibold text-slate-900">{p.destination_city}</td>
                  <td className="py-3 pr-4">{currency(p.monthly_budget)}</td>
                  <td className="py-3 pr-4">{currency(p.total_estimated_cost)}</td>
                  <td className={`py-3 pr-4 ${p.remaining_budget < 0 ? "text-rose-600" : ""}`}>
                    {currency(p.remaining_budget)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={p.budget_status} />
                  </td>
                  <td className="py-3 pr-4 text-slate-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/plans/${p.id}`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
