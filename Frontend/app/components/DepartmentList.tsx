import Link from "next/link";

import type { DepartmentDto } from "@/generated/models";

type DepartmentListProps = {
    departments: DepartmentDto[];
};

export default function DepartmentList({
    departments,
}: DepartmentListProps) {
    const sortedDepartments = [...departments].sort((a, b) =>
        (a.name ?? "").localeCompare(
            b.name ?? "",
            "nl",
            {
                sensitivity: "base",
            }
        )
    );

    if (sortedDepartments.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen afdelingen gevonden
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Er zijn momenteel geen afdelingen beschikbaar.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="divide-y divide-border">
                {sortedDepartments.map((department) => (
                    <div
                        key={department.id}
                        className="flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-background"
                    >
                        <div className="min-w-0">
                            <h2 className="font-medium text-foreground">
                                {department.name ||
                                    "Naamloze afdeling"}
                            </h2>
                        </div>

                        <Link
                            href={`/settings/departments/${department.id}/edit`}
                            className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-foreground hover:underline"
                        >
                            Bewerken
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}