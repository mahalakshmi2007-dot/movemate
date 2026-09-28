import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchCities, getErrorMessage } from "../services/api";
import type { City } from "../types";
import { currency, EmptyState, ErrorState, LoadingState } from "../components/Shared";

const MAX_SELECTION = 4;

export default function Compare() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchCities()
      .then((data) => {
        setCities(data);
        setSelected(data.slice(0, 3).map((c) => c.city_name));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function toggleCity(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, name];
    });
  }

  const selectedCities = useMemo(
    () => cities.filter((c) => selected.includes(c.city_name)),
    [cities, selected]
  );

  const chartData = selectedCities.map((c) => ({
    name: c.city_name,
    Rent: c.average_rent,
    Food: c.food_cost,
    Transport: c.transport_cost,
    Utilities: c.utilities_cost,
    Other: c.other_cost,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Compare Cities</h1>
      <p className="mt-1 text-sm text-slate-600">
        Select 2 to 4 cities to compare their estimated baseline monthly costs.
      </p>

      {loading ? (
        <LoadingState message="Loading cities..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => {
              const active = selected.includes(c.city_name);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCity(c.city_name)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.city_name}
                </button>
              );
            })}
          </div>

          {selectedCities.length < 2 ? (
            <div className="mt-8">
              <EmptyState
                title="Select at least 2 cities"
                description="Pick two to four cities above to see a side-by-side comparison."
              />
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              <div className="card overflow-x-auto p-6">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-4">City</th>
                      <th className="py-2 pr-4">Rent</th>
                      <th className="py-2 pr-4">Food</th>
                      <th className="py-2 pr-4">Transport</th>
                      <th className="py-2 pr-4">Utilities</th>
                      <th className="py-2 pr-4">Other</th>
                      <th className="py-2 pr-4">Estimated Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCities.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 font-semibold text-slate-900">{c.city_name}</td>
                        <td className="py-3 pr-4">{currency(c.average_rent)}</td>
                        <td className="py-3 pr-4">{currency(c.food_cost)}</td>
                        <td className="py-3 pr-4">{currency(c.transport_cost)}</td>
                        <td className="py-3 pr-4">{currency(c.utilities_cost)}</td>
                        <td className="py-3 pr-4">{currency(c.other_cost)}</td>
                        <td className="py-3 pr-4 font-bold text-brand-700">{currency(c.estimated_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Cost Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: number) => currency(v)} />
                      <Legend />
                      <Bar dataKey="Rent" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="Food" stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="Transport" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="Utilities" stackId="a" fill="#10b981" />
                      <Bar dataKey="Other" stackId="a" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  These are baseline city estimates before your personal accommodation, food and transport
                  preferences are applied. Use "Plan Your Move" for a personalized estimate. No city is
                  labeled as universally "best" — the right choice depends on your own priorities.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
