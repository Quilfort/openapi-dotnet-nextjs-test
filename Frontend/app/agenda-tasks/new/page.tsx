import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
    getApiAgendas,
    getApiAgendaItems,
    getApiDepartments,
    getApiUsers,
    postApiAgendaTasks,
} from "@/generated/api";

import type { AgendaTask } from "@/generated/models";

import AgendaTaskForm from "@/app/components/AgendaTask/AgendaTaskForm";

type NewAgendaTaskPageProps = {
    searchParams: Promise<{
        agendaItemId?: string;
    }>;
};

export default async function NewAgendaTaskPage({
    searchParams,
}: NewAgendaTaskPageProps) {
    const params = await searchParams;

    const agendaItemId =
        params.agendaItemId ?? "";

    const [
        agendasResponse,
        agendaItemsResponse,
        departmentsResponse,
        usersResponse,
    ] = await Promise.all([
        getApiAgendas(),
        getApiAgendaItems(),
        getApiDepartments(),
        getApiUsers(),
    ]);

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

    if (departmentsResponse.status !== 200) {
        throw new Error(
            "De afdelingen konden niet worden opgehaald."
        );
    }

    if (usersResponse.status !== 200) {
        throw new Error(
            "De gebruikers konden niet worden opgehaald."
        );
    }

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

    const departments = [
        ...departmentsResponse.data,
    ].sort((a, b) =>
        (a.name ?? "").localeCompare(
            b.name ?? "",
            "nl",
            {
                sensitivity: "base",
            }
        )
    );

    const users = [...usersResponse.data].sort(
        (a, b) =>
            (a.name ?? "").localeCompare(
                b.name ?? "",
                "nl",
                {
                    sensitivity: "base",
                }
            )
    );

    /*
     * Contextual create
     *
     * When an agenda item ID is supplied, make sure
     * that the agenda item actually exists.
     */
    let contextAgendaId: string | undefined;
    let contextAgendaItemName: string | undefined;

    if (agendaItemId) {
        const agendaItem = agendaItems.find(
            (item) => item.id === agendaItemId
        );

        if (!agendaItem) {
            notFound();
        }

        contextAgendaId =
            agendaItem.agendaId ?? undefined;

        contextAgendaItemName =
            agendaItem.name ??
            "Naamloos agenda item";
    }

    async function createAgendaTask(
        agendaTask: AgendaTask
    ) {
        "use server";

        const response = await postApiAgendaTasks(
            agendaTask
        );

        if (response.status !== 201) {
            console.error(
                "Agenda task creation failed:",
                response.data
            );

            throw new Error(
                "De taak kon niet worden aangemaakt."
            );
        }

        redirect(
            `/agenda-tasks/${response.data.id}`
        );
    }

    const isContextualCreate = Boolean(
        agendaItemId
    );

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                <header className="flex items-center justify-between border-b border-border pb-6">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
                    >
                        Agenda Management
                    </Link>

                    <Link
                        href={
                            isContextualCreate
                                ? `/agenda-items/${agendaItemId}`
                                : "/agenda-tasks"
                        }
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        {isContextualCreate
                            ? "← Agenda item"
                            : "← Taken"}
                    </Link>
                </header>

                <section className="py-16">
                    <div className="mb-10 max-w-3xl">
                        <p className="mb-3 text-sm font-medium text-muted">
                            {isContextualCreate
                                ? "Taak toevoegen"
                                : "Nieuwe taak"}
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            {isContextualCreate
                                ? "Nieuwe taak"
                                : "Taak aanmaken"}
                        </h1>

                        {isContextualCreate ? (
                            <p className="mt-4 text-lg leading-8 text-muted">
                                Maak een taak aan voor{" "}
                                <span className="font-medium text-foreground">
                                    {contextAgendaItemName}
                                </span>
                                .
                            </p>
                        ) : (
                            <p className="mt-4 text-lg leading-8 text-muted">
                                Maak een nieuwe taak aan en
                                koppel deze aan een agenda item.
                            </p>
                        )}
                    </div>

                    <AgendaTaskForm
                        agendas={agendas}
                        agendaItems={agendaItems}
                        departments={departments}
                        users={users}
                        initialAgendaId={
                            contextAgendaId
                        }
                        initialAgendaItemId={
                            agendaItemId || undefined
                        }
                        lockRelations={
                            isContextualCreate
                        }
                        onSubmit={createAgendaTask}
                        submitLabel="Taak aanmaken"
                    />
                </section>
            </div>
        </main>
    );
}