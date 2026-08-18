namespace Backend.Dtos.AgendaTasks;

public class AgendaItemDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public Guid AgendaId { get; set; }
}