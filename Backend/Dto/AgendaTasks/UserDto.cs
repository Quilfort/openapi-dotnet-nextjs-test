namespace Backend.Dtos.AgendaTasks;

public class UserDto
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public Guid? DepartmentId { get; set; }
}