import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    getApiDepartmentsId,
    putApiDepartmentsId,
} from "@/generated/api";

import DepartmentForm from "@/app/components/Department/DepartmentForm";

type EditDepartmentPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditDepartmentPage({
    params,
}: EditDepartmentPageProps) {
    const { id } = await params;

    const response = await getApiDepartmentsId(id);

    if (response.status !== 200) {
        notFound();
    }

    const department = response.data;

    async function updateDepartment(
        updatedDepartment: Parameters<
            typeof putApiDepartmentsId
        >[1]
    ) {
        "use server";

        const response = await putApiDepartmentsId(
            id,
            updatedDepartment
        );

        if (response.status !== 204) {
            throw new Error(
                "De afdeling kon niet worden bijgewerkt."
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
                        Afdeling bewerken
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                        Wijzig de gegevens van deze afdeling.
                    </p>
                </section>

                <section className="mt-12">
                    <DepartmentForm
                        initialData={department}
                        onSubmit={updateDepartment}
                        submitLabel="Wijzigingen opslaan"
                    />
                </section>
            </div>
        </main>
    );
}