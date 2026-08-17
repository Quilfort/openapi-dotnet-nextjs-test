import Link from "next/link";

type AgendaCardProps = {
  agenda: {
    id?: string;
    name?: string | null;
    description?: string | null;
  };
};

export default function AgendaCard({
  agenda,
}: AgendaCardProps) {
  return (
    <Link
      href={`/agendas/${agenda.id}`}
      className="group block px-6 py-5 transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
              {agenda.name?.charAt(0).toUpperCase() || "A"}
            </span>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-foreground group-hover:text-accent">
                {agenda.name || "Naamloze agenda"}
              </h3>

              <p className="mt-0.5 text-sm text-muted">
                Agenda
              </p>
            </div>
          </div>

          {agenda.description && (
            <p className="mt-4 line-clamp-1 max-w-2xl text-sm text-muted">
              {agenda.description}
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          className="shrink-0 text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>
    </Link>
  );
}