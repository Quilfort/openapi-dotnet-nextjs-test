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
        AgendaTask agendaTask)
    {
        var agendaItemExists = await _context.AgendaItems
            .AnyAsync(e => e.Id == agendaTask.AgendaItemId);

        if (!agendaItemExists)
        {
            return BadRequest(
                "The specified agenda item does not exist."
            );
        }

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
        AgendaTask agendaTask)
    {
        if (id != agendaTask.Id)
        {
            return BadRequest();
        }

        var agendaItemExists = await _context.AgendaItems
            .AnyAsync(e => e.Id == agendaTask.AgendaItemId);

        if (!agendaItemExists)
        {
            return BadRequest(
                "The specified agenda item does not exist."
            );
        }

        _context.Entry(agendaTask).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.AgendaTasks.AnyAsync(e => e.Id == id))
            {
                return NotFound();
            }

            throw;
        }

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