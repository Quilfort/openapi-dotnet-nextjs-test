import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    getApiDepartments,
    postApiUsers,
} from "@/generated/api";

import UserForm from "@/app/components/User/UserForm";

export default async function NewUserPage() {
    const departmentsResponse =
        await getApiDepartments();

    if (departmentsResponse.status !== 200) {
        throw new Error(
            "De afdelingen konden niet worden opgehaald."
        );
    }

    const departments =
        departmentsResponse.data;

    async function createUser(user: Parameters<
        typeof postApiUsers
    >[0]) {
        "use server";

        const response = await postApiUsers(user);

        if (response.status !== 201) {
            throw new Error(
                "De medewerker kon niet worden aangemaakt."
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
                    <p className="text-sm font-medium text-accent">
                        Instellingen
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                        Medewerker toevoegen
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                        Voeg een nieuwe medewerker toe en
                        koppel deze eventueel aan een afdeling.
                    </p>
                </section>

                {/* Form */}
                <section className="mt-12">
                    <UserForm
                        departments={departments}
                        onSubmit={createUser}
                    />
                </section>
            </div>
        </main>
    );
}