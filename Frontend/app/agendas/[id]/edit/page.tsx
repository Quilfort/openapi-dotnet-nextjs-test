import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getApiAgendasId,
  putApiAgendasId,
} from "@/generated/api";

import AgendaForm from "@/app/components/Agenda/AgendaForm";

type EditAgendaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAgendaPage({
  params,
}: EditAgendaPageProps) {
  const { id } = await params;

  const response = await getApiAgendasId(id);

  if (response.status !== 200) {
    notFound();
  }

  const agenda = response.data;

  async function updateAgenda(
    updatedAgenda: typeof agenda,
  ) {
    "use server";

    await putApiAgendasId(id, updatedAgenda);

    redirect(`/agendas/${id}`);
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
            href={`/agendas/${id}`}
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            ← Agenda bekijken
          </Link>
        </header>

        {/* Content */}
        <section className="py-16">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium text-muted">
              Agenda bewerken
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {agenda.name}
            </h1>

            <p className="mt-4 text-lg leading-8 text-muted">
              Pas de naam of beschrijving van deze agenda aan.
            </p>
          </div>

          <AgendaForm
            initialData={agenda}
            onSubmit={updateAgenda}
          />
        </section>
      </div>
    </main>
  );
}