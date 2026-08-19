import Link from "next/link";

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
        name: "Agenda's",
        href: "/agendas",
        disabled: false,
    },
    {
        name: "Taken",
        href: "/agenda-tasks",
        disabled: false,
    },
];

export default function Sidebar() {
    return (
        <aside
            aria-label="Hoofdnavigatie"
            className="hidden w-64 shrink-0 bg-[#172554] text-white md:flex md:min-h-screen md:flex-col"
        >
            {/* Brand */}
            <div className="border-b border-white/10 px-6 py-6">
                <Link
                    href="/"
                    className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172554]"
                >
                    <span className="block text-lg font-semibold tracking-tight">
                        Agenda Management
                    </span>

                    <span className="mt-1 block text-sm text-blue-200">
                        For your Productivity
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav
                aria-label="Hoofdnavigatie"
                className="flex-1 px-4 py-6"
            >
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            {item.disabled ? (
                                <span
                                    aria-disabled="true"
                                    className="flex cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200/60"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Settings */}
            <div className="px-4 pb-3">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 shrink-0"
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
            <div className="border-t border-white/10 px-6 py-4">
                <p className="text-xs text-blue-200">
                    by Quilfort Frederiks
                </p>
            </div>
        </aside>
    );
}
