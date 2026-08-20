"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Agenda = {
    id?: string;
    name?: string | null;
};

type AgendaFilterProps = {
    agendas: Agenda[];
};

export default function AgendaFilter({
    agendas,
}: AgendaFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedAgenda =
        searchParams.get("agenda") ?? "";

    function handleChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const value = event.target.value;

        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set("agenda", value);
        } else {
            params.delete("agenda");
        }

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname
        );
    }

    return (
        <div className="flex items-center gap-3">
            <label
                htmlFor="agenda-filter"
                className="text-sm font-medium text-muted"
            >
                Agenda
            </label>

            <select
                id="agenda-filter"
                value={selectedAgenda}
                onChange={handleChange}
                className="min-w-48 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
                <option value="">
                    Alle agenda's
                </option>

                {agendas.map((agenda) => (
                    <option
                        key={agenda.id}
                        value={agenda.id}
                    >
                        {agenda.name || "Naamloze agenda"}
                    </option>
                ))}
            </select>
        </div>
    );
}