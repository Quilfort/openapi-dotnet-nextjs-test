import { getApiAgendaTasks } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import AgendaTaskFilter, {
    UNASSIGNED_VALUE,
} from "@/app/components/AgendaTask/AgendaTaskFilter";
import AgendaTaskList from "@/app/components/AgendaTask/AgendaTaskList";

type AgendaTasksPageProps = {
    searchParams: Promise<{
        agendaItem?: string;
        department?: string;
        user?: string;
    }>;
};

type FilterOption = {
    id: string;
    name: string;
};

function createFilterOptions<
    T extends {
        id?: string;
        name?: string | null;
    },
>(
    values: (T | null | undefined)[],
    fallbackName: string
): FilterOption[] {
    return Array.from(
        new Map(
            values
                .filter(
                    (
                        value
                    ): value is T & {
                        id: string;
                    } => Boolean(value?.id)
                )
                .map((value) => [
                    value.id,
                    {
                        id: value.id,
                        name:
                            value.name ||
                            fallbackName,
                    },
                ])
        ).values()
    ).sort((a, b) =>
        a.name.localeCompare(b.name, "nl")
    );
}

export default async function AgendaTasksPage({
    searchParams,
}: AgendaTasksPageProps) {
    const response = await getApiAgendaTasks();

    if (response.status !== 200) {
        throw new Error(
            "De taken konden niet worden opgehaald."
        );
    }

    const agendaTasks = [...response.data];

    const params = await searchParams;

    const selectedAgendaItem =
        params.agendaItem ?? "";

    const selectedDepartment =
        params.department ?? "";

    const selectedUser =
        params.user ?? "";

    /*
     * --------------------------------------------------
     * Filteropties
     * --------------------------------------------------
     *
     * We bouwen de opties op basis van de data die
     * al door de API is opgehaald.
     *
     * Hierdoor zijn geen extra API-calls nodig.
     */

    const agendaItems = createFilterOptions(
        agendaTasks.map(
            (agendaTask) => agendaTask.agendaItem
        ),
        "Naamloos agenda item"
    );

    const departments = createFilterOptions(
        agendaTasks.map(
            (agendaTask) => agendaTask.department
        ),
        "Naamloze afdeling"
    );

    const users = createFilterOptions(
        agendaTasks.map(
            (agendaTask) => agendaTask.user
        ),
        "Naamloze medewerker"
    );

    /*
     * "Niet toegewezen" is geen echte medewerker.
     *
     * Het is een speciale filterwaarde waarmee we
     * taken zonder gekoppelde medewerker kunnen vinden.
     */
    users.unshift({
        id: UNASSIGNED_VALUE,
        name: "Niet toegewezen",
    });

    /*
     * --------------------------------------------------
     * Filter de taken
     * --------------------------------------------------
     */

    const filteredAgendaTasks =
        agendaTasks.filter((agendaTask) => {
            /*
             * Agenda item
             */
            if (selectedAgendaItem) {
                if (
                    agendaTask.agendaItemId !==
                    selectedAgendaItem
                ) {
                    return false;
                }
            }

            /*
             * Afdeling
             */
            if (selectedDepartment) {
                if (
                    agendaTask.departmentId !==
                    selectedDepartment
                ) {
                    return false;
                }
            }

            /*
             * Medewerker
             */
            if (selectedUser) {
                /*
                 * Speciale optie:
                 *
                 * "Niet toegewezen" betekent dat er
                 * helemaal geen user gekoppeld is.
                 *
                 * We controleren hier bewust de relation
                 * (agendaTask.user) in plaats van alleen
                 * userId.
                 */
                if (
                    selectedUser ===
                    UNASSIGNED_VALUE
                ) {
                    return agendaTask.user == null;
                }

                /*
                 * Normale medewerker-filter.
                 *
                 * Hier verwachten we een echte user ID
                 * uit de select.
                 */
                return (
                    agendaTask.userId ===
                    selectedUser
                );
            }

            /*
             * Geen user-filter actief.
             */
            return true;
        });

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                <section className="py-16">
                    {/* Page header */}
                    <div className="mb-8 flex items-end justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted">
                                Werk
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Taken
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Een overzicht van alle taken die
                                aan agenda items zijn gekoppeld.
                            </p>
                        </div>

                        <CreateButton href="/agenda-tasks/new">
                            Nieuwe taak
                        </CreateButton>
                    </div>

                    {/* Filters */}
                    <AgendaTaskFilter
                        agendaItems={agendaItems}
                        departments={departments}
                        users={users}
                        resultCount={
                            filteredAgendaTasks.length
                        }
                        totalCount={agendaTasks.length}
                    />

                    {/* Tasks */}
                    <AgendaTaskList
                        agendaTasks={
                            filteredAgendaTasks
                        }
                    />
                </section>
            </div>
        </main>
    );
}