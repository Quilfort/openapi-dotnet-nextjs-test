import Link from "next/link";
import { getApiAgendas } from "@/generated/api";
import AgendaCard from "@/app/components/AgendaCard";
import PageHeader from "@/app/components/PageHeader";

export default async function AgendasPage() {
  const response = await getApiAgendas();
  const agendas = response.data;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border pb-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            Agenda Management
          </Link>

          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            API Demo
          </span>
        </header>

        {/* Page header */}
        <section className="py-16 lg:py-20">
          <PageHeader
            eyebrow="Resource"
            title="Agendas"
            description="Een overzicht van alle agenda's die beschikbaar zijn via de API."
          />
        </section>

        {/* Agenda overview */}
        <section className="flex-1 pb-16">
          {agendas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                Geen agenda's gevonden
              </h2>

              <p className="mt-2 text-sm text-muted">
                Er zijn momenteel geen agenda's beschikbaar.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {agendas.map((agenda) => (
                <AgendaCard
                  key={agenda.id}
                  agenda={agenda}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-sm text-muted">
          OpenAPI → Generated client → Next.js
        </footer>
      </div>
    </main>
  );
}