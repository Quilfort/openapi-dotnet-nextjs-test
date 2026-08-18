namespace Backend.Dtos.AgendaTasks;

public class AgendaTaskDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateOnly DeadlineDate { get; set; }

    public Guid AgendaItemId { get; set; }

    public AgendaItemDto? AgendaItem { get; set; }
}