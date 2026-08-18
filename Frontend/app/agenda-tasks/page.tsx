import { getApiAgendaTasks } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import AgendaTaskList from "@/app/components/AgendaTaskList";

export default async function AgendaTasksPage() {
    const response = await getApiAgendaTasks();

    if (response.status !== 200) {
        throw new Error(
            "De taken konden niet worden opgehaald."
        );
    }

    const agendaTasks = [...response.data];

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                <section className="py-16">
                    <div className="mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted">
                                Werk
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Taken
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Een overzicht van alle taken die aan
                                agenda items zijn gekoppeld.
                            </p>
                        </div>

                        <CreateButton href="/agenda-tasks/new">
                            Nieuwe taak
                        </CreateButton>
                    </div>

                    <AgendaTaskList
                        agendaTasks={agendaTasks}
                    />
                </section>
            </div>
        </main>
    );
}