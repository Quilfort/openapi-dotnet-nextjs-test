namespace Backend.Dtos.Users;

public class UserDto
{
    public Guid Id { get; set; }

    public string? EntraUserId { get; set; }

    public string? Role { get; set; }

    public string? Email { get; set; }

    public string? Name { get; set; }

    public Guid? DepartmentId { get; set; }
}
