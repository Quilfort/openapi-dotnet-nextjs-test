using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data.Models;

[Table("agenda_tasks")]
public class AgendaTask
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("deadline_date")]
    public DateOnly DeadlineDate { get; set; }

    [Required]
    [Column("agenda_item_id")]
    public Guid AgendaItemId { get; set; }

    public AgendaItem? AgendaItem { get; set; }
}