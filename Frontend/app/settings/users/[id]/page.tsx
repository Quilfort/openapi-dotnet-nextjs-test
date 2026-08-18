import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    deleteApiUsersId,
    getApiUsersId,
    getApiDepartments,
} from "@/generated/api";

import EditButton from "@/app/components/EditButton";
import DeleteButton from "@/app/components/DeleteButton";

type UserPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function UserPage({
    params,
}: UserPageProps) {
    const { id } = await params;

    const [userResponse, departmentsResponse] =
        await Promise.all([
            getApiUsersId(id),
            getApiDepartments(),
        ]);

    if (userResponse.status !== 200) {
        notFound();
    }

    if (departmentsResponse.status !== 200) {
        throw new Error(
            "De afdelingen konden niet worden opgehaald."
        );
    }

    const user = userResponse.data;
    const departments = departmentsResponse.data;

    const department = user.departmentId
        ? departments.find(
              (department) =>
                  department.id === user.departmentId
          )
        : undefined;

    async function deleteUser() {
        "use server";

        const response = await deleteApiUsersId(id);

        if (response.status !== 204) {
            throw new Error(
                "De medewerker kon niet worden verwijderd."
            );
        }

        revalidatePath("/settings/users");

        redirect("/settings/users");
    }

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Back navigation */}
                <Link
                    href="/settings/users"
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Alle medewerkers
                </Link>

                {/* Header */}
                <section className="mt-10">
                    <div className="flex max-w-5xl items-start justify-between gap-8">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-accent">
                                Medewerker
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {user.name ||
                                    "Naamloze medewerker"}
                            </h1>

                            {user.email && (
                                <p className="mt-4 text-lg text-muted">
                                    {user.email}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-3">
                            <EditButton
                                href={`/settings/users/${id}/edit`}
                            />

                            <DeleteButton
                                onDelete={deleteUser}
                                title="Medewerker verwijderen?"
                                description="Weet je zeker dat je deze medewerker wilt verwijderen? Deze actie kan niet ongedaan worden."
                            />
                        </div>
                    </div>
                </section>

                {/* Details */}
                <section className="mt-12 max-w-3xl">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                        <dl className="divide-y divide-border">
                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Naam
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {user.name || "Geen naam"}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    E-mail
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {user.email || "Geen e-mail"}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Rol
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {user.role || "Geen rol"}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Afdeling
                                </dt>

                                <dd className="text-sm sm:col-span-2">
                                    {department ? (
                                        <Link
                                            href={`/settings/departments/${department.id}`}
                                            className="font-medium text-foreground hover:underline"
                                        >
                                            {department.name ||
                                                "Naamloze afdeling"}
                                        </Link>
                                    ) : (
                                        <span className="text-muted">
                                            Geen afdeling
                                        </span>
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Entra User ID
                                </dt>

                                <dd className="break-all text-sm text-muted sm:col-span-2">
                                    {user.entraUserId ||
                                        "Niet gekoppeld"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>
        </main>
    );
}