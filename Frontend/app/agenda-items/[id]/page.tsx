import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    deleteApiAgendaItemsId,
    getApiAgendaItemsId,
    getApiAgendaTasks,
} from "@/generated/api";

import EditButton from "@/app/components/EditButton";
import DeleteButton from "@/app/components/DeleteButton";
import CreateButton from "@/app/components/CreateButton";
import AgendaTaskList from "@/app/components/AgendaTask/AgendaTaskList";

function formatDateRange(
    startDate?: string,
    endDate?: string | null
): string {
    if (!startDate) {
        return "Geen datum";
    }

    const start = new Date(startDate);

    if (!endDate || startDate === endDate) {
        return start.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    const end = new Date(endDate);

    return `${start.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })} – ${end.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })}`;
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) {
        return "Geen tijd opgegeven";
    }

    if (startTime && endTime) {
        return `${startTime.slice(0, 5)} – ${endTime.slice(0, 5)}`;
    }

    if (startTime) {
        return `Vanaf ${startTime.slice(0, 5)}`;
    }

    return `Tot ${endTime?.slice(0, 5)}`;
}

type AgendaItemPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AgendaItemPage({
    params,
}: AgendaItemPageProps) {
    const { id } = await params;

    const [
        agendaItemResponse,
        agendaTasksResponse,
    ] = await Promise.all([
        getApiAgendaItemsId(id),
        getApiAgendaTasks(),
    ]);

    if (agendaItemResponse.status !== 200) {
        notFound();
    }

    if (agendaTasksResponse.status !== 200) {
        throw new Error(
            "De taken konden niet worden opgehaald."
        );
    }

    const agendaItem = agendaItemResponse.data;

    const agendaTasks =
        agendaTasksResponse.data.filter(
            (agendaTask) =>
                agendaTask.agendaItemId === id
        );

    async function deleteAgendaItem() {
        "use server";

        const response =
            await deleteApiAgendaItemsId(id);

        if (response.status !== 204) {
            throw new Error(
                "Het agenda item kon niet worden verwijderd."
            );
        }

        revalidatePath("/");
        revalidatePath("/agenda-items");
        revalidatePath("/agenda-tasks");

        if (agendaItem.agendaId) {
            revalidatePath(
                `/settings/agendas/${agendaItem.agendaId}`
            );
        }

        redirect("/agenda-items");
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
                        href="/agenda-items"
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Agenda items
                    </Link>
                </header>

                {/* Content */}
                <section className="py-16">
                    {/* Agenda item header */}
                    <div className="flex max-w-4xl items-start justify-between gap-8">
                        <div className="min-w-0">
                            <p className="mb-3 text-sm font-medium text-muted">
                                Agenda item
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {agendaItem.name ||
                                    "Naamloos agenda item"}
                            </h1>

                            {agendaItem.description && (
                                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                                    {
                                        agendaItem.description
                                    }
                                </p>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <EditButton
                                href={`/agenda-items/${id}/edit`}
                            />

                            <DeleteButton
                                onDelete={
                                    deleteAgendaItem
                                }
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mt-12 max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface">
                        <dl className="divide-y divide-border">
                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Datum
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {formatDateRange(
                                        agendaItem.startDate,
                                        agendaItem.endDate
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Tijd
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {formatTimeRange(
                                        agendaItem.startTime,
                                        agendaItem.endTime
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Agenda
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {agendaItem.agenda ? (
                                        <Link
                                            href={`/settings/agendas/${agendaItem.agenda.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {
                                                agendaItem
                                                    .agenda
                                                    .name
                                            }
                                        </Link>
                                    ) : (
                                        <span className="text-muted">
                                            Onbekende agenda
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Tasks */}
                    <section className="mt-16">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted">
                                    Taken
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                    Taken voor dit agenda item
                                </h2>

                                <p className="mt-2 text-sm text-muted">
                                    Taken die aan dit agenda item
                                    zijn gekoppeld.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-4">
                                <span className="text-sm text-muted">
                                    {agendaTasks.length}{" "}
                                    {agendaTasks.length ===
                                    1
                                        ? "taak"
                                        : "taken"}
                                </span>

                                <CreateButton
                                    href={`/agenda-tasks/new?agendaItemId=${encodeURIComponent(
                                        id
                                    )}`}
                                >
                                    Nieuwe taak
                                </CreateButton>
                            </div>
                        </div>

                        <AgendaTaskList
                            agendaTasks={agendaTasks}
                            showAgendaItem={false}
                        />
                    </section>
                </section>
            </div>
        </main>
    );
}