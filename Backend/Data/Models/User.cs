using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data.Models;

[Table("users")]
public partial class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("entra_user_id")]
    public string? EntraUserId { get; set; }

    [Column("role")]
    public string? Role { get; set; }

    [Column("email")]
    public string? Email { get; set; }
}
