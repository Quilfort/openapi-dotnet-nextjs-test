using Backend.Data.Models;
using Backend.Dtos.AgendaTasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/agenda-tasks")]
public class AgendaTaskController : ControllerBase
{
    private readonly AppDbContext _context;

    public AgendaTaskController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AgendaTaskDto>>> GetAgendaTasks()
    {
        var agendaTasks = await _context.AgendaTasks
            .Select(e => new AgendaTaskDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                DeadlineDate = e.DeadlineDate,
                AgendaItemId = e.AgendaItemId,

                AgendaItem = e.AgendaItem == null
                    ? null
                    : new AgendaItemDto
                    {
                        Id = e.AgendaItem.Id,
                        Name = e.AgendaItem.Name,
                        AgendaId = e.AgendaItem.AgendaId
                    }
            })
            .ToListAsync();

        return Ok(agendaTasks);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaTaskDto>> GetAgendaTask(Guid id)
    {
        var agendaTask = await _context.AgendaTasks
            .Where(e => e.Id == id)
            .Select(e => new AgendaTaskDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                DeadlineDate = e.DeadlineDate,
                AgendaItemId = e.AgendaItemId,

                AgendaItem = e.AgendaItem == null
                    ? null
                    : new AgendaItemDto
                    {
                        Id = e.AgendaItem.Id,
                        Name = e.AgendaItem.Name,
                        AgendaId = e.AgendaItem.AgendaId
                    }
            })
            .FirstOrDefaultAsync();

        if (agendaTask == null)
        {
            return NotFound();
        }

        return Ok(agendaTask);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaTaskDto>> CreateAgendaTask(
        AgendaTaskDto agendaTaskDto)
    {
        var agendaItemExists = await _context.AgendaItems
            .AnyAsync(e => e.Id == agendaTaskDto.AgendaItemId);

        if (!agendaItemExists)
        {
            return BadRequest(
                "The specified agenda item does not exist."
            );
        }

        var agendaTask = new AgendaTask
        {
            Id = agendaTaskDto.Id == Guid.Empty
                ? Guid.NewGuid()
                : agendaTaskDto.Id,

            Name = agendaTaskDto.Name,
            Description = agendaTaskDto.Description,
            DeadlineDate = agendaTaskDto.DeadlineDate,
            AgendaItemId = agendaTaskDto.AgendaItemId
        };

        _context.AgendaTasks.Add(agendaTask);

        await _context.SaveChangesAsync();

        var createdAgendaTask = await _context.AgendaTasks
            .Where(e => e.Id == agendaTask.Id)
            .Select(e => new AgendaTaskDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                DeadlineDate = e.DeadlineDate,
                AgendaItemId = e.AgendaItemId,

                AgendaItem = e.AgendaItem == null
                    ? null
                    : new AgendaItemDto
                    {
                        Id = e.AgendaItem.Id,
                        Name = e.AgendaItem.Name,
                        AgendaId = e.AgendaItem.AgendaId
                    }
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetAgendaTask),
            new { id = agendaTask.Id },
            createdAgendaTask);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAgendaTask(
        Guid id,
        AgendaTaskDto agendaTaskDto)
    {
        if (id != agendaTaskDto.Id)
        {
            return BadRequest();
        }

        var agendaItemExists = await _context.AgendaItems
            .AnyAsync(e => e.Id == agendaTaskDto.AgendaItemId);

        if (!agendaItemExists)
        {
            return BadRequest(
                "The specified agenda item does not exist."
            );
        }

        var agendaTask = await _context.AgendaTasks
            .FindAsync(id);

        if (agendaTask == null)
        {
            return NotFound();
        }

        agendaTask.Name = agendaTaskDto.Name;
        agendaTask.Description = agendaTaskDto.Description;
        agendaTask.DeadlineDate = agendaTaskDto.DeadlineDate;
        agendaTask.AgendaItemId = agendaTaskDto.AgendaItemId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAgendaTask(Guid id)
    {
        var agendaTask = await _context.AgendaTasks.FindAsync(id);

        if (agendaTask == null)
        {
            return NotFound();
        }

        _context.AgendaTasks.Remove(agendaTask);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}