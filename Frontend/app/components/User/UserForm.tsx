"use client";

import { FormEvent, useState } from "react";

import type {
    DepartmentDto,
    User,
    UserDto,
} from "@/generated/models";

type UserFormProps = {
    departments: DepartmentDto[];
    initialData?: UserDto;
    onSubmit: (user: User) => Promise<void>;
    submitLabel?: string;
};

export default function UserForm({
    departments,
    initialData,
    onSubmit,
    submitLabel = "Medewerker aanmaken",
}: UserFormProps) {
    const [name, setName] = useState(
        initialData?.name ?? ""
    );

    const [email, setEmail] = useState(
        initialData?.email ?? ""
    );

    const [entraUserId, setEntraUserId] = useState(
        initialData?.entraUserId ?? ""
    );

    const [role, setRole] = useState(
        initialData?.role ?? ""
    );

    const [departmentId, setDepartmentId] = useState(
        initialData?.departmentId ?? ""
    );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState<string | null>(
        null
    );

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedEntraUserId =
            entraUserId.trim();
        const trimmedRole = role.trim();

        if (!trimmedName) {
            setError("Naam is verplicht.");
            return;
        }

        if (!trimmedEmail) {
            setError("E-mail is verplicht.");
            return;
        }

        const user: User = {
            id: initialData?.id ?? crypto.randomUUID(),
            name: trimmedName,
            email: trimmedEmail || null,
            entraUserId:
                trimmedEntraUserId || null,
            role: trimmedRole || null,
            departmentId:
                departmentId || null,
        };

        try {
            setIsSubmitting(true);

            await onSubmit(user);
        } catch {
            setError(
                "Er is iets misgegaan bij het opslaan van de medewerker."
            );

            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-8"
        >
            {/* Employee */}
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Medewerker
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Vul de gegevens van de medewerker in.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-foreground"
                        >
                            Naam
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Bijvoorbeeld: Jan Jansen"
                            required
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-foreground"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="naam@gemeente.nl"
                            required
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Organisation */}
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Organisatie
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Koppel de medewerker aan een afdeling
                        en geef eventueel een rol op.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    {/* Department */}
                    <div>
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-foreground"
                        >
                            Afdeling
                        </label>

                        <select
                            id="department"
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(
                                    event.target.value
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="">
                                Geen afdeling
                            </option>

                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name ||
                                            "Naamloze afdeling"}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-foreground"
                        >
                            Rol
                        </label>

                        <input
                            id="role"
                            type="text"
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            placeholder="Bijvoorbeeld: Beheerder"
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Entra */}
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Microsoft Entra ID
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Optioneel: koppel de medewerker aan een
                        Entra ID gebruiker.
                    </p>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="entra-user-id"
                        className="block text-sm font-medium text-foreground"
                    >
                        Entra User ID
                    </label>

                    <input
                        id="entra-user-id"
                        type="text"
                        value={entraUserId}
                        onChange={(event) =>
                            setEntraUserId(
                                event.target.value
                            )
                        }
                        placeholder="Bijvoorbeeld: 12345678-..."
                        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                    {error}
                </div>
            )}

            {/* Submit */}
            <div className="border-t border-border pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Opslaan..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
}