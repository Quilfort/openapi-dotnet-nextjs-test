"use client";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

const UNASSIGNED_VALUE = "__unassigned__";

export type FilterOption = {
    id: string;
    name: string;
};

type AgendaTaskFilterProps = {
    agendaItems: FilterOption[];
    departments: FilterOption[];
    users: FilterOption[];
    resultCount: number;
    totalCount: number;
};

type FilterKey =
    | "agendaItem"
    | "department"
    | "user";

export default function AgendaTaskFilter({
    agendaItems,
    departments,
    users,
    resultCount,
    totalCount,
}: AgendaTaskFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedAgendaItem =
        searchParams.get("agendaItem") ?? "";

    const selectedDepartment =
        searchParams.get("department") ?? "";

    const selectedUser =
        searchParams.get("user") ?? "";

    const hasFilters =
        Boolean(selectedAgendaItem) ||
        Boolean(selectedDepartment) ||
        Boolean(selectedUser);

    function updateFilter(
        key: FilterKey,
        value: string
    ) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const queryString = params.toString();

        router.replace(
            queryString
                ? `${pathname}?${queryString}`
                : pathname
        );
    }

    function clearFilters() {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.delete("agendaItem");
        params.delete("department");
        params.delete("user");

        const queryString = params.toString();

        router.replace(
            queryString
                ? `${pathname}?${queryString}`
                : pathname
        );
    }

    return (
        <section
            aria-label="Taken filteren"
            className="mb-6 rounded-xl border border-border bg-surface px-4 py-3 sm:px-5"
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Filters */}
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                    {/* Agenda item */}
                    <div>
                        <label
                            htmlFor="agenda-task-filter-agenda-item"
                            className="sr-only"
                        >
                            Filter op agenda item
                        </label>

                        <select
                            id="agenda-task-filter-agenda-item"
                            value={selectedAgendaItem}
                            onChange={(event) =>
                                updateFilter(
                                    "agendaItem",
                                    event.target.value
                                )
                            }
                            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            <option value="">
                                Alle agenda items
                            </option>

                            {agendaItems.map(
                                (agendaItem) => (
                                    <option
                                        key={agendaItem.id}
                                        value={agendaItem.id}
                                    >
                                        {agendaItem.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Afdeling */}
                    <div>
                        <label
                            htmlFor="agenda-task-filter-department"
                            className="sr-only"
                        >
                            Filter op afdeling
                        </label>

                        <select
                            id="agenda-task-filter-department"
                            value={selectedDepartment}
                            onChange={(event) =>
                                updateFilter(
                                    "department",
                                    event.target.value
                                )
                            }
                            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            <option value="">
                                Alle afdelingen
                            </option>

                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Medewerker */}
                    <div>
                        <label
                            htmlFor="agenda-task-filter-user"
                            className="sr-only"
                        >
                            Filter op medewerker
                        </label>

                        <select
                            id="agenda-task-filter-user"
                            value={selectedUser}
                            onChange={(event) =>
                                updateFilter(
                                    "user",
                                    event.target.value
                                )
                            }
                            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            <option value="">
                                Alle medewerkers
                            </option>

                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result count / clear */}
                <div className="flex shrink-0 items-center justify-between gap-4 lg:justify-end">
                    <span
                        className="text-sm text-muted"
                        aria-live="polite"
                    >
                        {hasFilters ? (
                            <>
                                <span className="font-medium text-foreground">
                                    {resultCount}
                                </span>{" "}
                                van {totalCount}
                            </>
                        ) : (
                            <>
                                {totalCount}
                            </>
                        )}{" "}
                        {totalCount === 1
                            ? "taak"
                            : "taken"}
                    </span>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            Wis filters
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export { UNASSIGNED_VALUE };