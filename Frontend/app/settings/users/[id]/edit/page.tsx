import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    getApiUsersId,
    getApiDepartments,
    putApiUsersId,
} from "@/generated/api";

import UserForm from "@/app/components/User/UserForm";

type EditUserPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditUserPage({
    params,
}: EditUserPageProps) {
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

    async function updateUser(updatedUser: typeof user) {
        "use server";

        const response = await putApiUsersId(
            id,
            updatedUser
        );

        if (response.status !== 204) {
            throw new Error(
                "De medewerker kon niet worden bijgewerkt."
            );
        }

        revalidatePath("/settings/users");
        revalidatePath(`/settings/users/${id}`);

        redirect(`/settings/users/${id}`);
    }

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Back navigation */}
                <Link
                    href={`/settings/users/${id}`}
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Medewerker
                </Link>

                {/* Header */}
                <section className="mt-10">
                    <p className="text-sm font-medium text-accent">
                        Instellingen
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                        Medewerker bewerken
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                        Pas de gegevens van deze medewerker
                        aan.
                    </p>
                </section>

                {/* Form */}
                <section className="mt-12">
                    <UserForm
                        departments={departments}
                        initialData={user}
                        onSubmit={updateUser}
                        submitLabel="Wijzigingen opslaan"
                    />
                </section>
            </div>
        </main>
    );
}