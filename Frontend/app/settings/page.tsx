import Link from "next/link";

const organizationSettings = [
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

const agendaSettings = [
    {
        title: "Agenda's",
        description:
            "Beheer de agenda's die binnen de organisatie worden gebruikt.",
        href: "/settings/agendas",
    },
];

function SettingsCard({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/20 hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
        >
            <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-foreground">
                        {title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                        {description}
                    </p>
                </div>

                <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-muted transition-transform group-hover:translate-x-1"
                >
                    →
                </span>
            </div>
        </Link>
    );
}

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
                        Beheer de organisatie en de inrichting
                        van Agenda Management.
                    </p>
                </section>

                {/* Organization */}
                <section className="mt-14">
                    <div className="border-b border-border pb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                            Organisatie
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            Beheer de structuur en medewerkers van
                            de organisatie.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {organizationSettings.map(
                            (setting) => (
                                <SettingsCard
                                    key={setting.href}
                                    {...setting}
                                />
                            )
                        )}
                    </div>
                </section>

                {/* Agenda configuration */}
                <section className="mt-14">
                    <div className="border-b border-border pb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                            Agenda-inrichting
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            Beheer de agenda's die binnen de
                            organisatie beschikbaar zijn.
                        </p>
                    </div>

                    <div className="mt-6 max-w-3xl">
                        {agendaSettings.map((setting) => (
                            <SettingsCard
                                key={setting.href}
                                {...setting}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}