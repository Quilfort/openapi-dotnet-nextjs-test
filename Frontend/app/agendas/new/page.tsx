import Link from "next/link";
import { redirect } from "next/navigation";

import { postApiAgendas } from "@/generated/api";
import AgendaForm from "@/app/components/AgendaForm";
import PageHeader from "@/app/components/PageHeader";

export default function NewAgendaPage() {
    async function createAgenda(data: {
        name?: string;
        description?: string | null;
    }) {
        "use server";

        if (!data.name?.trim()) {
            throw new Error("Een naam is verplicht.");
        }

        const response = await postApiAgendas({
            name: data.name.trim(),
            description: data.description?.trim() || null,
        });

        if (response.status !== 201) {
            throw new Error("De agenda kon niet worden aangemaakt.");
        }

        redirect(`/agendas/${response.data.id}`);
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border pb-6">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
                    >
                        Agenda Management
                    </Link>

                    <Link
                        href="/agendas"
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Agendas
                    </Link>
                </header>

                {/* Content */}
                <section className="py-16">
                    <PageHeader
                        eyebrow="Nieuwe agenda"
                        title="Agenda maken"
                        description="Maak een nieuwe agenda aan door een naam en eventueel een beschrijving in te vullen."
                    />

                    <div className="mt-10 max-w-2xl">
                        <AgendaForm onSubmit={createAgenda} />
                    </div>
                </section>
            </div>
        </main>
    );
}