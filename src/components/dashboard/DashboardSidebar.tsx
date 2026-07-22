"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Assignments",
    href: "/assignments",
  },
  {
  name: "Study Planner",
  href: "/planner",
},
{
  name: "Calendar",
  href: "/calendar",
},
{
  name: "Grades",
  href: "/grades",
},
  {
    name: "Profile",
    href: "/profile",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
        <Link
          href="/"
          className="font-bold tracking-tight text-slate-900"
        >
          AP Path Planner
        </Link>

        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen(
              (currentValue) =>
                !currentValue,
            )
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="text-2xl leading-none"
          >
            {isMobileMenuOpen ? "×" : "☰"}
          </span>
        </button>
      </header>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        id="mobile-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:static md:z-auto md:min-h-screen md:w-64 md:translate-x-0 md:shadow-none ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            AP Path Planner
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex flex-col gap-2 px-4 pb-6"
        >
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(
                  `${item.href}/`,
                ));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                className={`rounded-lg px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}