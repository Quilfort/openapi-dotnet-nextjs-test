import { getApiAgendaItems, getApiAgendas } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import AgendaItemList from "@/app/components/AgendaItem/AgendaItemList";
import AgendaFilter from "@/app/components/Agenda/AgendaFilter";
import PageHeader from "@/app/components/PageHeader";

type AgendaItemsPageProps = {
    searchParams: Promise<{
        agenda?: string;
    }>;
};

export default async function AgendaItemsPage({
    searchParams,
}: AgendaItemsPageProps) {
    const { agenda: selectedAgenda } =
        await searchParams;

    const [agendaItemsResponse, agendasResponse] =
        await Promise.all([
            getApiAgendaItems(),
            getApiAgendas(),
        ]);

    if (agendaItemsResponse.status !== 200) {
        throw new Error(
            "Agenda items konden niet worden opgehaald."
        );
    }

    if (agendasResponse.status !== 200) {
        throw new Error(
            "Agenda's konden niet worden opgehaald."
        );
    }

    const agendas = [...agendasResponse.data];

    const agendaItems = agendaItemsResponse.data.filter(
        (agendaItem) => {
            if (!selectedAgenda) {
                return true;
            }

            return (
                agendaItem.agendaId === selectedAgenda
            );
        }
    );

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Header */}
                <section>
                    <div className="flex items-end justify-between gap-6">
                        <PageHeader
                            eyebrow="Planning"
                            title="Kalender"
                            description="Bekijk alle geplande items en ontdek wat er wanneer op de planning staat."
                        />

                        <CreateButton href="/agenda-items/new">
                            Nieuw agenda item
                        </CreateButton>
                    </div>
                </section>

                {/* Toolbar */}
                <section className="mt-10">
                    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Agenda items
                            </p>

                            <p className="mt-0.5 text-xs text-muted">
                                {agendaItems.length}{" "}
                                {agendaItems.length === 1
                                    ? "item"
                                    : "items"}{" "}
                                weergegeven
                            </p>
                        </div>

                        <AgendaFilter
                            agendas={agendas}
                        />
                    </div>
                </section>

                {/* Results */}
                <section className="mt-6">
                    <AgendaItemList
                        agendaItems={agendaItems}
                    />
                </section>
            </div>
        </main>
    );
}