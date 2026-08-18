import Link from "next/link";

const settings = [
    {
        title: "Afdelingen",
        description:
            "Beheer de afdelingen binnen de organisatie.",
        href: "/settings/departments",
    },
    {
        title: "Medewerkers",
        description:
            "Beheer mensen en koppel ze aan een afdeling.",
        href: "/settings/users",
    },
];

export default function SettingsPage() {
    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Header */}
                <section>
                    <p className="text-sm font-medium text-accent">
                        Beheer
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Instellingen
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                        Beheer de afdelingen en mensen binnen
                        de organisatie.
                    </p>
                </section>

                {/* Settings */}
                <section className="mt-12">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {settings.map((setting) => (
                            <Link
                                key={setting.href}
                                href={setting.href}
                                className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/20 hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">
                                            {setting.title}
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-muted">
                                            {setting.description}
                                        </p>
                                    </div>

                                    <span
                                        aria-hidden="true"
                                        className="text-xl text-muted transition-transform group-hover:translate-x-1"
                                    >
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}