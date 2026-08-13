import Link from "next/link";
import { getApiAgendas } from "@/generated/api";

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
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium text-muted">
              Resource
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Agendas
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Een overzicht van alle agenda&apos;s die beschikbaar zijn
              via de API.
            </p>
          </div>
        </section>

        {/* Agenda overview */}
        <section className="flex-1 pb-16">
          {agendas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                Geen agenda&apos;s gevonden
              </h2>

              <p className="mt-2 text-sm text-muted">
                Er zijn momenteel geen agenda&apos;s beschikbaar.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {agendas.map((agenda) => (
                <article
                  key={agenda.id}
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted">
                        Agenda
                      </p>

                      <h2 className="mt-1 text-xl font-semibold text-foreground">
                        {agenda.name}
                      </h2>
                    </div>

                    <span className="text-xl text-muted transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  {agenda.description && (
                    <p className="mt-4 text-sm leading-6 text-muted">
                      {agenda.description}
                    </p>
                  )}
                </article>
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