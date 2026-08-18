import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    deleteApiDepartmentsId,
    getApiDepartmentsId,
} from "@/generated/api";

import EditButton from "@/app/components/EditButton";
import DeleteButton from "@/app/components/DeleteButton";

type DepartmentPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function DepartmentPage({
    params,
}: DepartmentPageProps) {
    const { id } = await params;

    const response = await getApiDepartmentsId(id);

    if (response.status !== 200) {
        notFound();
    }

    const department = response.data;

    async function deleteDepartment() {
        "use server";

        const response = await deleteApiDepartmentsId(id);

        if (response.status !== 204) {
            throw new Error(
                "De afdeling kon niet worden verwijderd."
            );
        }

        revalidatePath("/settings/departments");

        redirect("/settings/departments");
    }

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Back navigation */}
                <Link
                    href="/settings/departments"
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Alle afdelingen
                </Link>

                {/* Header */}
                <section className="mt-10">
                    <div className="flex max-w-5xl items-start justify-between gap-8">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-accent">
                                Afdeling
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {department.name ||
                                    "Naamloze afdeling"}
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Beheer de afdeling en de
                                bijbehorende medewerkers.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-3">
                            <EditButton
                                href={`/settings/departments/${id}/edit`}
                            />

                            <DeleteButton
                                onDelete={deleteDepartment}
                                title="Afdeling verwijderen?"
                                description="Weet je zeker dat je deze afdeling wilt verwijderen? De afdeling wordt verwijderd. Gebruikers die aan deze afdeling gekoppeld zijn, blijven bestaan maar verliezen hun afdeling."
                            />
                        </div>
                    </div>
                </section>

                {/* Department details */}
                <section className="mt-12 max-w-3xl">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    </div>
                </section>

                {/* Users */}
                <section className="mt-16">
                    <div className="mb-5">
                        <p className="text-sm font-medium text-muted">
                            Organisatie
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            Medewerkers
                        </h2>

                        <p className="mt-2 text-sm text-muted">
                            Medewerkers die aan deze afdeling
                            gekoppeld zijn.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                        <h3 className="text-lg font-semibold text-foreground">
                            Nog geen medewerkers
                        </h3>

                        <p className="mt-2 text-sm text-muted">
                            Het koppelen van medewerkers aan
                            afdelingen komt hier beschikbaar.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}