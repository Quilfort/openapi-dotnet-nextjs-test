import { getApiUsers } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import UserList from "@/app/components/User/UserList";

export default async function UsersPage() {
    const response = await getApiUsers();

    if (response.status !== 200) {
        throw new Error(
            "De medewerkers konden niet worden opgehaald."
        );
    }

    const users = response.data;

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Header */}
                <section>
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-accent">
                                Instellingen
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                                Medewerkers
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Beheer medewerkers en hun
                                afdelingen.
                            </p>
                        </div>

                        <CreateButton href="/settings/users/new">
                            Medewerker toevoegen
                        </CreateButton>
                    </div>
                </section>

                {/* Users */}
                <section className="mt-12">
                    <div className="mb-5 flex items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-muted">
                                Organisatie
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                Alle medewerkers
                            </h2>

                            <p className="mt-2 text-sm text-muted">
                                Medewerkers die binnen Agenda
                                Management bekend zijn.
                            </p>
                        </div>

                        <span className="shrink-0 text-sm text-muted">
                            {users.length}{" "}
                            {users.length === 1
                                ? "medewerker"
                                : "medewerkers"}
                        </span>
                    </div>

                    <UserList users={users} />
                </section>
            </div>
        </main>
    );
}
