import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Compass, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan Your Move" },
  { to: "/compare", label: "Compare Cities" },
  { to: "/plans", label: "Saved Plans" },
  { to: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 text-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Compass size={20} />
          </div>
          <span className="text-lg font-bold">MoveMate</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
