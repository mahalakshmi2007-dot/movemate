import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Calculator, ListChecks, MapPinned, PiggyBank, Sparkles } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Smart Budget Calculator",
    description:
      "Enter your income and preferences to get a real, backend-computed estimate of your monthly living costs.",
  },
  {
    icon: MapPinned,
    title: "Compare Cities",
    description: "Compare rent, food, transport and other costs across multiple Indian cities side by side.",
  },
  {
    icon: PiggyBank,
    title: "Budget Status",
    description: "Instantly see whether your budget is Comfortable, Manageable, Tight, or Over Budget.",
  },
  {
    icon: ListChecks,
    title: "Save & Revisit Plans",
    description: "Save relocation plans and come back to review or delete them anytime.",
  },
  {
    icon: BarChart3,
    title: "Personal Analytics",
    description: "See trends across all your saved plans — average cost, most-picked city, and more.",
  },
  {
    icon: Sparkles,
    title: "Personalized Tips",
    description: "Get practical, rule-based recommendations tailored to your actual numbers.",
  },
];

const steps = [
  { title: "Tell us your plan", description: "Pick a destination city, your budget, and your lifestyle preferences." },
  { title: "Get an instant estimate", description: "Our backend calculates rent, food, transport, utilities and more." },
  { title: "Decide with confidence", description: "Compare cities, save plans, and revisit your budget anytime." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Plan Your Move. Understand Your Budget.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Estimate living costs, compare cities, and plan your move with confidence.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/plan" className="btn-primary px-6 py-3 text-base">
              Plan Your Move <ArrowRight size={18} />
            </Link>
            <Link to="/compare" className="btn-secondary px-6 py-3 text-base">
              Compare Cities
            </Link>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-slate-600">
          Moving to a new city for college or a new job is exciting — but the cost of living can be hard to predict.
          MoveMate turns your income and lifestyle choices into a clear, honest monthly budget estimate, so you can
          plan your relocation instead of guessing.
        </p>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <f.icon size={22} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
