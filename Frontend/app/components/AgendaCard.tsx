import Link from "next/link";
import type { Agenda } from "@/generated/models";

type AgendaCardProps = {
  agenda: Agenda;
};

export default function AgendaCard({ agenda }: AgendaCardProps) {
  return (
    <Link
      href={`/agendas/${agenda.id}`}
      className="group block rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
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
    </Link>
  );
}