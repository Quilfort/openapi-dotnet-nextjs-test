import Link from "next/link";

import type { UserDto } from "@/generated/models";

type UserListProps = {
    users: UserDto[];
};

export default function UserList({
    users,
}: UserListProps) {
    if (users.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen medewerkers gevonden
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Er zijn momenteel geen medewerkers beschikbaar.
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
                                Naam
                            </th>

                            <th className="px-6 py-4 font-medium">
                                E-mail
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Afdeling
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                            >
                                <td className="px-6 py-5">
                                    <Link
                                        href={`/settings/users/${user.id}`}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {user.name ||
                                            "Naamloze medewerker"}
                                    </Link>
                                </td>

                                <td className="px-6 py-5 text-sm text-muted">
                                    {user.email || "—"}
                                </td>

                                <td className="px-6 py-5">
                                    {user.departmentId ? (
                                        <span className="text-sm text-foreground">
                                            Afdeling gekoppeld
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted">
                                            Geen afdeling
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
