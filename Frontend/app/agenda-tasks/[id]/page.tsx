import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    deleteApiAgendaTasksId,
    getApiAgendaTasksId,
} from "@/generated/api";

import EditButton from "@/app/components/EditButton";
import DeleteButton from "@/app/components/DeleteButton";
import PageHeader from "@/app/components/PageHeader";

type AgendaTaskPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatDate(date?: string): string {
    if (!date) {
        return "Geen deadline";
    }

    return new Date(date).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default async function AgendaTaskPage({
    params,
}: AgendaTaskPageProps) {
    const { id } = await params;

    const response = await getApiAgendaTasksId(id);

    if (response.status !== 200) {
        notFound();
    }

    const agendaTask = response.data;

    async function deleteAgendaTask() {
        "use server";

        const response = await deleteApiAgendaTasksId(id);

        if (response.status !== 204) {
            throw new Error(
                "De taak kon niet worden verwijderd."
            );
        }

        revalidatePath("/agenda-tasks");
        revalidatePath("/agenda-items");

        redirect("/agenda-tasks");
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                {/* Header */}
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

                {/* Content */}
                <section className="py-16">
                    <div className="mb-12 flex max-w-3xl items-start justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted">
                                Taak
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {agendaTask.name}
                            </h1>

                            {agendaTask.description && (
                                <p className="mt-6 text-lg leading-8 text-muted">
                                    {agendaTask.description}
                                </p>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <EditButton
                                href={`/agenda-tasks/${id}/edit`}
                            />

                            <DeleteButton
                                onDelete={deleteAgendaTask}
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface">
                        <dl className="divide-y divide-border">
                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Deadline
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {formatDate(
                                        agendaTask.deadlineDate
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Agenda item
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {agendaTask.agendaItem ? (
                                        <Link
                                            href={`/agenda-items/${agendaTask.agendaItem.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {agendaTask.agendaItem.name}
                                        </Link>
                                    ) : (
                                        "Onbekend agenda item"
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>
        </main>
    );
}