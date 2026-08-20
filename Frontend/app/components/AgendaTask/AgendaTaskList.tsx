import Link from "next/link";

import type { getApiAgendaTasks } from "@/generated/api";

type AgendaTask = Awaited<
    ReturnType<typeof getApiAgendaTasks>
> extends infer Response
    ? Response extends { status: 200; data: infer Data }
        ? Data extends readonly (infer Task)[]
            ? Task
            : never
        : never
    : never;

type AgendaTaskListProps = {
    agendaTasks: AgendaTask[];
    showAgendaItem?: boolean;
};

function formatDeadline(date?: string | null): string {
    if (!date) {
        return "Geen deadline";
    }

    return new Date(date).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function AgendaTaskList({
    agendaTasks,
    showAgendaItem = true,
}: AgendaTaskListProps) {
    const sortedAgendaTasks = [...agendaTasks].sort((a, b) => {
        const dateA = a.deadlineDate ?? "";
        const dateB = b.deadlineDate ?? "";

        return dateA.localeCompare(dateB);
    });

    if (sortedAgendaTasks.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen taken gevonden
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Er zijn momenteel geen taken beschikbaar.
                </p>
            </div>
        );
    }

    return (
        <div
            className="overflow-x-auto rounded-2xl border border-border bg-surface"
            role="region"
            aria-labelledby="agenda-task-list-caption"
            tabIndex={0}
        >
            <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
                <caption
                    id="agenda-task-list-caption"
                    className="sr-only"
                >
                    Overzicht van agenda taken
                </caption>

                <colgroup>
                    <col className={showAgendaItem ? "w-[30%]" : "w-[38%]"} />

                    <col className="w-[120px]" />

                    {showAgendaItem && (
                        <col className="w-[24%]" />
                    )}

                    <col className="w-[20%]" />

                    <col className="w-[20%]" />
                </colgroup>

                <thead>
                    <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted">
                        <th
                            scope="col"
                            className="px-5 py-3 font-medium"
                        >
                            Taak
                        </th>

                        <th
                            scope="col"
                            className="px-5 py-3 font-medium"
                        >
                            Deadline
                        </th>

                        {showAgendaItem && (
                            <th
                                scope="col"
                                className="px-5 py-3 font-medium"
                            >
                                Agenda item
                            </th>
                        )}

                        <th
                            scope="col"
                            className="px-5 py-3 font-medium"
                        >
                            Afdeling
                        </th>

                        <th
                            scope="col"
                            className="px-5 py-3 font-medium"
                        >
                            Medewerker
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {sortedAgendaTasks.map((agendaTask) => (
                        <tr
                            key={agendaTask.id}
                            className="group transition-colors hover:bg-background"
                        >
                            {/* Taak */}
                            <th
                                scope="row"
                                className="px-5 py-3.5 font-normal"
                            >
                                <Link
                                    href={`/agenda-tasks/${agendaTask.id}`}
                                    className="block min-w-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                                >
                                    <span
                                        title={
                                            agendaTask.name ||
                                            "Naamloze taak"
                                        }
                                        className="block line-clamp-2 font-medium text-foreground group-hover:text-accent"
                                    >
                                        {agendaTask.name ||
                                            "Naamloze taak"}
                                    </span>

                                    {agendaTask.description && (
                                        <span
                                            title={
                                                agendaTask.description
                                            }
                                            className="mt-0.5 block truncate text-xs text-muted"
                                        >
                                            {agendaTask.description}
                                        </span>
                                    )}
                                </Link>
                            </th>

                            {/* Deadline */}
                            <td className="whitespace-nowrap px-5 py-3.5 text-sm text-foreground">
                                {formatDeadline(
                                    agendaTask.deadlineDate
                                )}
                            </td>

                            {/* Agenda item */}
                            {showAgendaItem && (
                                <td className="px-5 py-3.5">
                                    {agendaTask.agendaItem ? (
                                        <Link
                                            href={`/agenda-items/${agendaTask.agendaItem.id}`}
                                            title={
                                                agendaTask
                                                    .agendaItem
                                                    .name ||
                                                "Naamloos agenda item"
                                            }
                                            className="block truncate text-sm text-foreground hover:text-accent hover:underline"
                                        >
                                            {
                                                agendaTask
                                                    .agendaItem
                                                    .name
                                            }
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-muted">
                                            —
                                        </span>
                                    )}
                                </td>
                            )}

                            {/* Afdeling */}
                            <td className="px-5 py-3.5">
                                {agendaTask.department ? (
                                    <Link
                                        href={`/settings/departments/${agendaTask.department.id}`}
                                        title={
                                            agendaTask.department.name ||
                                            "Naamloze afdeling"
                                        }
                                        className="block truncate text-sm text-foreground hover:text-accent hover:underline"
                                    >
                                        {agendaTask.department.name ||
                                            "Naamloze afdeling"}
                                    </Link>
                                ) : (
                                    <span className="text-sm text-muted">
                                        —
                                    </span>
                                )}
                            </td>

                            {/* Medewerker */}
                            <td className="px-5 py-3.5">
                                {agendaTask.user ? (
                                    <Link
                                        href={`/settings/users/${agendaTask.user.id}`}
                                        title={
                                            agendaTask.user.name ||
                                            "Naamloze medewerker"
                                        }
                                        className="block truncate text-sm text-foreground hover:text-accent hover:underline"
                                    >
                                        {agendaTask.user.name ||
                                            "Naamloze medewerker"}
                                    </Link>
                                ) : (
                                    <span className="text-sm text-muted">
                                        —
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}