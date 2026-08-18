import Link from "next/link";
import type { DepartmentDto } from "@/generated/models";

type DepartmentListProps = {
    departments: DepartmentDto[];
};

export default function DepartmentList({
    departments,
}: DepartmentListProps) {
    if (departments.length === 0) {
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
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-border text-sm text-muted">
                            <th className="px-6 py-4 font-medium">
                                Afdeling
                            </th>

                            <th className="px-6 py-4 font-medium">
                                ID
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((department) => (
                            <tr
                                key={department.id}
                                className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                            >
                                <td className="px-6 py-5">
                                    {department.id ? (
                                        <Link
                                            href={`/settings/departments/${department.id}`}
                                            className="font-medium text-foreground hover:underline"
                                        >
                                            {department.name ||
                                                "Naamloze afdeling"}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-foreground">
                                            {department.name ||
                                                "Naamloze afdeling"}
                                        </span>
                                    )}
                                </td>

                                <td className="break-all px-6 py-5 text-sm text-muted">
                                    {department.id || "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}