export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} MoveMate. Built for planning, not official pricing.</p>
          <p className="text-slate-400">
            All costs shown are estimates and can vary by lifestyle, locality and time.
          </p>
        </div>
      </div>
    </footer>
  );
}
