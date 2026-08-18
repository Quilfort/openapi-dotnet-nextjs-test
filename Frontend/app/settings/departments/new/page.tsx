import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    postApiDepartments,
} from "@/generated/api";

import DepartmentForm from "@/app/components/Department/DepartmentForm";

export default function NewDepartmentPage() {
    async function createDepartment(
        department: Parameters<
            typeof postApiDepartments
        >[0]
    ) {
        "use server";

        const response = await postApiDepartments(
            department
        );

        if (response.status !== 201) {
            throw new Error(
                "De afdeling kon niet worden aangemaakt."
            );
        }

        revalidatePath("/settings/departments");

        redirect("/settings/departments");
    }

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                <Link
                    href="/settings/departments"
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Afdelingen
                </Link>

                <section className="mt-10">
                    <p className="text-sm font-medium text-accent">
                        Organisatie
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Nieuwe afdeling
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                        Voeg een nieuwe afdeling toe aan de
                        organisatie.
                    </p>
                </section>

                <section className="mt-12">
                    <DepartmentForm
                        onSubmit={createDepartment}
                    />
                </section>
            </div>
        </main>
    );
}
