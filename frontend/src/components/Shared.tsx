import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

const STATUS_STYLES: Record<string, string> = {
  Comfortable: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Manageable: "bg-blue-50 text-blue-700 border-blue-200",
  "Tight Budget": "bg-amber-50 text-amber-700 border-amber-200",
  "Over Budget": "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style}`}>
      {status}
    </span>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="animate-spin" size={28} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 py-12 text-center text-rose-700">
      <AlertTriangle size={26} />
      <p className="max-w-md text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <Inbox className="text-slate-400" size={30} />
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}

export function currency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
