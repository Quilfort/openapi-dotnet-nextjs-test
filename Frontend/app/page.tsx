import Link from "next/link";

export default function Home() {
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

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Backend connected
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Agenda management,
              <br />
              built around an API.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              A simple demonstration project built with .NET, PostgreSQL,
              OpenAPI and Next.js. The frontend will consume an API generated
              from the OpenAPI specification.
            </p>
          </div>

          {/* Navigation cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <Link
              href="/agenda"
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Resource</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Agendas
                  </h2>
                </div>

                <span className="text-xl text-muted transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">
                View and manage agendas through the generated API client.
              </p>
            </Link>

            <Link
              href="/agenda-items"
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Resource</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Agenda Items
                  </h2>
                </div>

                <span className="text-xl text-muted transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">
                Manage individual items belonging to an agenda.
              </p>
            </Link>
          </div>

          {/* Technology */}
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted">
            <span>.NET 10</span>
            <span>PostgreSQL</span>
            <span>OpenAPI</span>
            <span>Next.js</span>
            <span>TypeScript</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-sm text-muted">
          OpenAPI → Generated client → Next.js
        </footer>
      </div>
    </main>
  );
}