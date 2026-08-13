import Link from "next/link";
import { notFound } from "next/navigation";

import { getApiAgendasId } from "@/generated/api";
import EditButton from "@/app/components/EditButton";

type AgendaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgendaPage({
  params,
}: AgendaPageProps) {
  const { id } = await params;

  const response = await getApiAgendasId(id);

  if (response.status !== 200) {
    notFound();
  }

  const agenda = response.data;

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
            ← Alle agenda's
          </Link>
        </header>

        {/* Content */}
        <section className="py-16">
          <div className="flex max-w-4xl items-start justify-between gap-8">
            <div>
              <p className="mb-3 text-sm font-medium text-muted">
                Agenda
              </p>

              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {agenda.name}
              </h1>
            </div>

            <EditButton href={`/agendas/${id}/edit`} />
          </div>

          {/* Description */}
          <div className="mt-12 max-w-3xl border-t border-border pt-8">
            <h2 className="text-sm font-medium text-muted">
              Beschrijving
            </h2>

            {agenda.description ? (
              <p className="mt-3 text-lg leading-8 text-foreground">
                {agenda.description}
              </p>
            ) : (
              <p className="mt-3 text-lg leading-8 text-muted">
                Deze agenda heeft nog geen beschrijving.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}