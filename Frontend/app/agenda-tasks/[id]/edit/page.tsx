import { notFound, redirect } from "next/navigation";

import {
    getApiAgendaTasksId,
    getApiAgendas,
    getApiAgendaItems,
    putApiAgendaTasksId,
} from "@/generated/api";

import AgendaTaskForm from "@/app/components/AgendaTaskForm";
import PageHeader from "@/app/components/PageHeader";

type AgendaTaskEditPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AgendaTaskEditPage({
    params,
}: AgendaTaskEditPageProps) {
    const { id } = await params;

    const [
        agendaTaskResponse,
        agendasResponse,
        agendaItemsResponse,
    ] = await Promise.all([
        getApiAgendaTasksId(id),
        getApiAgendas(),
        getApiAgendaItems(),
    ]);

    if (agendaTaskResponse.status !== 200) {
        notFound();
    }

    if (agendasResponse.status !== 200) {
        throw new Error(
            "De agenda's konden niet worden opgehaald."
        );
    }

    if (agendaItemsResponse.status !== 200) {
        throw new Error(
            "De agenda items konden niet worden opgehaald."
        );
    }

    const agendaTask = agendaTaskResponse.data;

    const agendas = [...agendasResponse.data].sort(
        (a, b) =>
            (a.name ?? "").localeCompare(
                b.name ?? "",
                "nl",
                {
                    sensitivity: "base",
                }
            )
    );

    const agendaItems = [...agendaItemsResponse.data].sort(
        (a, b) =>
            (a.name ?? "").localeCompare(
                b.name ?? "",
                "nl",
                {
                    sensitivity: "base",
                }
            )
    );

    async function updateAgendaTask(
        updatedAgendaTask: Parameters<
            typeof putApiAgendaTasksId
        >[1]
    ) {
        "use server";

        const response = await putApiAgendaTasksId(
            id,
            updatedAgendaTask
        );

        if (response.status !== 204) {
            throw new Error(
                "De taak kon niet worden bijgewerkt."
            );
        }

        redirect(`/agenda-tasks/${id}`);
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                <section className="py-16">
                    <PageHeader
                        eyebrow="Taak bewerken"
                        title={agendaTask.name}
                        description="Pas de gegevens van deze taak aan."
                    />

                    <div className="mt-12">
                        <AgendaTaskForm
                            agendas={agendas}
                            agendaItems={agendaItems}
                            initialData={agendaTask}
                            onSubmit={updateAgendaTask}
                            submitLabel="Wijzigingen opslaan"
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}