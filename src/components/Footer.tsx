import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-center text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:text-left">
        <p>© 2026 AP Path Planner</p>

        <p>
          An independent student project. Not affiliated with or endorsed by
          the College Board.
        </p>
        <Link
  href="/privacy"
  className="text-sm text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
>
  Privacy
</Link>
      </div>
    </footer>
  );
}