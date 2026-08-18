import Link from "next/link";

import { getApiDepartments } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import DepartmentList from "@/app/components/DepartmentList";

export default async function DepartmentsPage() {
    const response = await getApiDepartments();

    if (response.status !== 200) {
        throw new Error(
            "De afdelingen konden niet worden opgehaald."
        );
    }

    const departments = response.data;

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Back navigation */}
                <Link
                    href="/settings"
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Instellingen
                </Link>

                {/* Header */}
                <section className="mt-10">
                    <div className="flex max-w-5xl items-start justify-between gap-8">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-accent">
                                Organisatie
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Afdelingen
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Beheer de afdelingen binnen de
                                organisatie.
                            </p>
                        </div>

                        <CreateButton href="/settings/departments/new">
                            Nieuwe afdeling
                        </CreateButton>
                    </div>
                </section>

                {/* Departments */}
                <section className="mt-12">
                    <div className="mb-5 flex items-end justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Alle afdelingen
                            </h2>

                            <p className="mt-2 text-sm text-muted">
                                {departments.length}{" "}
                                {departments.length === 1
                                    ? "afdeling"
                                    : "afdelingen"}
                            </p>
                        </div>
                    </div>

                    <DepartmentList
                        departments={departments}
                    />
                </section>
            </div>
        </main>
    );
}