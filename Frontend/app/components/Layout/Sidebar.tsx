"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        name: "Home",
        href: "/",
        disabled: false,
    },
    {
        name: "Kalender",
        href: "/agenda-items",
        disabled: false,
    },
    {
        name: "Taken",
        href: "/agenda-tasks",
        disabled: false,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            aria-label="Hoofdnavigatie"
            className="hidden w-64 shrink-0 flex-col border-r md:flex md:min-h-screen"
            style={{
                backgroundColor: "var(--sidebar-bg)",
                color: "var(--sidebar-fg)",
                borderColor: "var(--sidebar-border)",
            }}
        >
            {/* Brand */}
            <div
                className="border-b px-6 py-6"
                style={{ borderColor: "var(--sidebar-border)" }}
            >
                <Link
                    href="/"
                    className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                        // @ts-expect-error -- CSS custom property for focus ring color
                        "--tw-ring-color": "var(--accent-ink)",
                        "--tw-ring-offset-color": "var(--sidebar-bg)",
                    }}
                >
                    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: "var(--accent)" }}
                        />
                        Agenda Management
                    </span>

                    <span
                        className="mt-1 block text-sm"
                        style={{ color: "var(--sidebar-muted)" }}
                    >
                        For your Productivity
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav aria-label="Hoofdnavigatie" className="flex-1 px-4 py-6">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                {item.disabled ? (
                                    <span
                                        aria-disabled="true"
                                        className="flex cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium opacity-50"
                                        style={{ color: "var(--sidebar-muted)" }}
                                    >
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        aria-current={isActive ? "page" : undefined}
                                        className="flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                                        style={{
                                            borderColor: isActive ? "var(--accent-ink)" : "transparent",
                                            backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                                            color: isActive ? "var(--accent-ink)" : "var(--sidebar-fg)",
                                            // @ts-expect-error -- CSS custom property for focus ring color
                                            "--tw-ring-color": "var(--accent-ink)",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Settings */}
            <div className="px-4 pb-3">
                <Link
                    href="/settings"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                        color: "var(--sidebar-fg)",
                        // @ts-expect-error -- CSS custom property for focus ring color
                        "--tw-ring-color": "var(--accent-ink)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 shrink-0 transition-colors group-hover:stroke-[color:var(--accent-ink)]"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 0 0 2.572-1.065Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>

                    <span>Instellingen</span>
                </Link>
            </div>

            {/* Footer */}
            <div
                className="border-t px-6 py-4"
                style={{ borderColor: "var(--sidebar-border)" }}
            >
                <p className="text-xs" style={{ color: "var(--sidebar-muted)" }}>
                    by Quilfort Frederiks
                </p>
            </div>
        </aside>
    );
}