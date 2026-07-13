"use client";

import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Courses", href: "/courses" },
  { name: "Assignments", href: "/assignments" },
  { name: "Study Planner", href: "/planner" },
  { name: "Grades", href: "/grades" },
  { name: "Profile", href: "/profile" },
];

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          AP Path Planner
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:overflow-visible">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActiveItem(item.name)}
            className={`whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
              activeItem === item.name
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}