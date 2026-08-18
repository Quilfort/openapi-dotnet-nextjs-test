using Backend.Data.Models;
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
    public async Task<ActionResult<IEnumerable<AgendaTask>>> GetAgendaTasks()
    {
        return await _context.AgendaTasks
            .Include(e => e.AgendaItem)
            .ToListAsync();
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaTask>> GetAgendaTask(Guid id)
    {
        var agendaTask = await _context.AgendaTasks
            .Include(e => e.AgendaItem)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (agendaTask == null)
        {
            return NotFound();
        }

        return agendaTask;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaTask>> CreateAgendaTask(
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

        return CreatedAtAction(
            nameof(GetAgendaTask),
            new { id = agendaTask.Id },
            agendaTask);
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