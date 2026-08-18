using Backend.Dto.Agenda;

namespace Backend.Dto.AgendaItems;

public class AgendaItemDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public Guid AgendaId { get; set; }

    public AgendaDto? Agenda { get; set; }
}