## Vereisten

Zorg dat de volgende software lokaal is geïnstalleerd:

- .NET 10.0
- Bijbehorende NuGet pakketten. Deze worden automatisch geïnstalleerd bij het bouwen van de applicatie.

## Aan de slag

Vul eerst de DefaultConnection string in de `appsettings.Development.json` bestand in. Deze string is nodig om verbinding te maken met de database.

## Database migratie

Als je een database hebt aangemaakt en de DefaultConnection string hebt ingevuld, kun je de database migratie uitvoeren met het volgende commando in de terminal:

```dotnet ef dbcontext scaffold "Name=ConnectionStrings:DefaultConnection" Npgsql.EntityFrameworkCore.PostgreSQL -o Data/Models -c AppDbContext --data-annotations --no-onconfiguring```

Door dit commando uit te voeren, worden de database tabellen gescaffoldd naar C# klassen in de `Data/Models` map. De `AppDbContext` klasse wordt ook aangemaakt en bevat de DbSet properties voor de tabellen.