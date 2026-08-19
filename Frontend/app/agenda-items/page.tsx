import { getApiAgendaItems } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import AgendaItemList from "@/app/components/AgendaItem/AgendaItemList";
import PageHeader from "@/app/components/PageHeader";

export default async function AgendaItemsPage() {
    const response = await getApiAgendaItems();

    if (response.status !== 200) {
        throw new Error(
            "Agenda items konden niet worden opgehaald."
        );
    }

    const agendaItems = [...response.data];

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Page header */}
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

                {/* Agenda items */}
                <section className="mt-12">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Alle agenda items
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                {agendaItems.length}{" "}
                                {agendaItems.length === 1
                                    ? "item"
                                    : "items"}{" "}
                                gepland
                            </p>
                        </div>
                    </div>

                    <AgendaItemList agendaItems={agendaItems} />
                </section>
            </div>
        </main>
    );
}