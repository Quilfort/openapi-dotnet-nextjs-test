import Link from "next/link";

const navigation = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Kalender",
        href: "/agenda-items",
    },
    {
        name: "Agenda's",
        href: "/agendas",
    },
    {
        name: "Werk Items",
        href: "#",
        disabled: true,
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
                       Quilfort Frederiks
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

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
                <p className="text-xs text-blue-200">
                    Agenda Management
                </p>
            </div>
        </aside>
    );
}