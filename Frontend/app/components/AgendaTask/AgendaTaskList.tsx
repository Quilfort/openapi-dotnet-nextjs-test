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
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-border text-sm text-muted">
                            <th className="px-6 py-4 font-medium">
                                Taak
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Beschrijving
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Deadline
                            </th>

                            {showAgendaItem && (
                                <th className="px-6 py-4 font-medium">
                                    Agenda item
                                </th>
                            )}

                            <th className="px-6 py-4 font-medium">
                                Afdeling
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Medewerker
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedAgendaTasks.map((agendaTask) => (
                            <tr
                                key={agendaTask.id}
                                className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                            >
                                {/* Taak */}
                                <td className="px-6 py-5">
                                    <Link
                                        href={`/agenda-tasks/${agendaTask.id}`}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {agendaTask.name ||
                                            "Naamloze taak"}
                                    </Link>
                                </td>

                                {/* Beschrijving */}
                                <td className="max-w-md px-6 py-5">
                                    <span className="line-clamp-2 text-sm text-muted">
                                        {agendaTask.description || "—"}
                                    </span>
                                </td>

                                {/* Deadline */}
                                <td className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                                    {formatDeadline(
                                        agendaTask.deadlineDate
                                    )}
                                </td>

                                {/* Agenda item */}
                                {showAgendaItem && (
                                    <td className="px-6 py-5">
                                        {agendaTask.agendaItem ? (
                                            <Link
                                                href={`/agenda-items/${agendaTask.agendaItem.id}`}
                                                className="text-sm font-medium text-foreground hover:underline"
                                            >
                                                {
                                                    agendaTask
                                                        .agendaItem
                                                        .name
                                                }
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-muted">
                                                Onbekend agenda item
                                            </span>
                                        )}
                                    </td>
                                )}

                                {/* Afdeling */}
                                <td className="px-6 py-5">
                                    {agendaTask.department ? (
                                        <Link
                                            href={`/settings/departments/${agendaTask.department.id}`}
                                            className="text-sm font-medium text-foreground hover:underline"
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
                                <td className="px-6 py-5">
                                    {agendaTask.user ? (
                                        <Link
                                            href={`/settings/users/${agendaTask.user.id}`}
                                            className="text-sm font-medium text-foreground hover:underline"
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
        </div>
    );
}