import Link from "next/link";
import { redirect } from "next/navigation";

import {
    getApiAgendas,
    getApiAgendaItems,
    getApiDepartments,
    getApiUsers,
    postApiAgendaTasks,
} from "@/generated/api";

import type { AgendaTask } from "@/generated/models";

import AgendaTaskForm from "@/app/components/AgendaTask/AgendaTaskForm";

export default async function NewAgendaTaskPage() {
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
                        href="/agenda-tasks"
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Taken
                    </Link>
                </header>

                <section className="py-16">
                    <div className="mb-10 max-w-3xl">
                        <p className="mb-3 text-sm font-medium text-muted">
                            Nieuwe taak
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            Taak aanmaken
                        </h1>

                        <p className="mt-4 text-lg leading-8 text-muted">
                            Maak een nieuwe taak aan en koppel deze
                            aan een agenda item.
                        </p>
                    </div>

                    <AgendaTaskForm
                        agendas={agendas}
                        agendaItems={agendaItems}
                        departments={departments}
                        users={users}
                        onSubmit={createAgendaTask}
                        submitLabel="Taak aanmaken"
                    />
                </section>
            </div>
        </main>
    );
}