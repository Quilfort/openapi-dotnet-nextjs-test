using Backend.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/agendas")]
public class AgendaController : ControllerBase
{
    private readonly AppDbContext _context;

    public AgendaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Agenda>>> GetAgendas()
    {
        return await _context.Agendas.ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Agenda>> GetAgenda(Guid id)
    {
        var agenda = await _context.Agendas.FindAsync(id);

        if (agenda == null)
        {
            return NotFound();
        }

        return agenda;
    }

    [HttpPost]
    public async Task<ActionResult<Agenda>> CreateAgenda(Agenda agenda)
    {
        _context.Agendas.Add(agenda);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAgenda),
            new { id = agenda.Id },
            agenda);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAgenda(
        Guid id,
        Agenda agenda)
    {
        if (id != agenda.Id)
        {
            return BadRequest();
        }

        _context.Entry(agenda).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Agendas.AnyAsync(e => e.Id == id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAgenda(Guid id)
    {
        var agenda = await _context.Agendas.FindAsync(id);

        if (agenda == null)
        {
            return NotFound();
        }

        _context.Agendas.Remove(agenda);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}