import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getApiAgendaItems,
    getApiAgendasId,
} from "@/generated/api";

import AgendaItemList from "@/app/components/AgendaItem/AgendaItemList";
import EditButton from "@/app/components/EditButton";
import PageHeader from "@/app/components/PageHeader";

type AgendaPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function SettingsAgendaPage({
    params,
}: AgendaPageProps) {
    const { id } = await params;

    const [agendaResponse, agendaItemsResponse] =
        await Promise.all([
            getApiAgendasId(id),
            getApiAgendaItems(),
        ]);

    if (agendaResponse.status !== 200) {
        notFound();
    }

    if (agendaItemsResponse.status !== 200) {
        throw new Error(
            "Agenda items konden niet worden opgehaald."
        );
    }

    const agenda = agendaResponse.data;

    const agendaItems =
        agendaItemsResponse.data.filter(
            (agendaItem) =>
                agendaItem.agendaId === id
        );

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Breadcrumb */}
                <Link
                    href="/settings/agendas"
                    className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                    ← Agenda's
                </Link>

                {/* Header */}
                <section className="mt-8">
                    <div className="flex items-start justify-between gap-6">
                        <PageHeader
                            eyebrow="Instellingen · Agenda"
                            title={
                                agenda.name ||
                                "Naamloze agenda"
                            }
                            description={
                                agenda.description ||
                                "Beheer deze agenda en bekijk de gekoppelde agenda items."
                            }
                        />

                        <EditButton
                            href={`/settings/agendas/${id}/edit`}
                        />
                    </div>
                </section>

                {/* Overview */}
                <section className="mt-10">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-border bg-surface px-5 py-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Agenda items
                            </p>

                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                                {agendaItems.length}
                            </p>

                            <p className="mt-1 text-sm text-muted">
                                Gekoppeld aan deze agenda
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-surface px-5 py-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Type
                            </p>

                            <p className="mt-2 text-base font-semibold text-foreground">
                                Organisatieagenda
                            </p>

                            <p className="mt-1 text-sm text-muted">
                                Beschikbaar voor planning en filtering
                            </p>
                        </div>
                    </div>
                </section>

                {/* Agenda items */}
                <section className="mt-12">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            Agenda items
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            De items die momenteel aan deze agenda
                            gekoppeld zijn.
                        </p>
                    </div>

                    <AgendaItemList
                        agendaItems={agendaItems}
                        showAgenda={false}
                    />
                </section>
            </div>
        </main>
    );
}