using Backend.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/agenda-items")]
public class AgendaItemController : ControllerBase
{
    private readonly AppDbContext _context;

    public AgendaItemController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AgendaItem>>> GetAgendaItems()
    {
        return await _context.AgendaItems
            .Include(e => e.Agenda)
            .OrderBy(e => e.StartDate)
            .ThenBy(e => e.StartTime)
            .ToListAsync();
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaItem>> GetAgendaItem(Guid id)
    {
        var agendaItem = await _context.AgendaItems
            .Include(e => e.Agenda)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (agendaItem == null)
        {
            return NotFound();
        }

        return agendaItem;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaItem>> CreateAgendaItem(
        AgendaItem agendaItem)
    {
        var validationError = await ValidateAgendaItem(agendaItem);

        if (validationError != null)
        {
            return BadRequest(validationError);
        }

        var agenda = await _context.Agendas
            .FirstOrDefaultAsync(e => e.Id == agendaItem.AgendaId);

        if (agenda == null)
        {
            return BadRequest("The specified agenda does not exist.");
        }

        _context.AgendaItems.Add(agendaItem);
        await _context.SaveChangesAsync();

        agendaItem.Agenda = agenda;

        return CreatedAtAction(
            nameof(GetAgendaItem),
            new { id = agendaItem.Id },
            agendaItem);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAgendaItem(
        Guid id,
        AgendaItem agendaItem)
    {
        if (id != agendaItem.Id)
        {
            return BadRequest();
        }

        var validationError = await ValidateAgendaItem(agendaItem);

        if (validationError != null)
        {
            return BadRequest(validationError);
        }

        var agendaExists = await _context.Agendas
            .AnyAsync(e => e.Id == agendaItem.AgendaId);

        if (!agendaExists)
        {
            return BadRequest("The specified agenda does not exist.");
        }

        _context.Entry(agendaItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.AgendaItems.AnyAsync(e => e.Id == id))
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
    public async Task<IActionResult> DeleteAgendaItem(Guid id)
    {
        var agendaItem = await _context.AgendaItems.FindAsync(id);

        if (agendaItem == null)
        {
            return NotFound();
        }

        _context.AgendaItems.Remove(agendaItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<string?> ValidateAgendaItem(AgendaItem agendaItem)
    {
        if (string.IsNullOrWhiteSpace(agendaItem.Name))
        {
            return "Name is required.";
        }

        if (agendaItem.AgendaId == Guid.Empty)
        {
            return "Agenda is required.";
        }

        var today = DateOnly.FromDateTime(DateTime.Now);

        if (agendaItem.StartDate < today)
        {
            return "Start date cannot be in the past.";
        }

        if (agendaItem.EndDate.HasValue &&
            agendaItem.EndDate.Value < agendaItem.StartDate)
        {
            return "End date cannot be before start date.";
        }

        if (agendaItem.StartDate == today &&
            agendaItem.StartTime.HasValue &&
            agendaItem.StartTime.Value < TimeOnly.FromDateTime(DateTime.Now))
        {
            return "Start time cannot be in the past.";
        }

        if (agendaItem.EndDate.HasValue &&
            agendaItem.EndDate.Value == agendaItem.StartDate &&
            agendaItem.StartTime.HasValue &&
            agendaItem.EndTime.HasValue &&
            agendaItem.EndTime.Value < agendaItem.StartTime.Value)
        {
            return "End time cannot be before start time.";
        }

        var agendaExists = await _context.Agendas
            .AnyAsync(e => e.Id == agendaItem.AgendaId);

        if (!agendaExists)
        {
            return "The specified agenda does not exist.";
        }

        return null;
    }
}