using Backend.Data.Models;
using Backend.Dto.Agenda;
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AgendaDto>>> GetAgendas()
    {
        var agendas = await _context.Agendas
            .Select(agenda => new AgendaDto
            {
                Id = agenda.Id,
                Name = agenda.Name,
                Description = agenda.Description
            })
            .ToListAsync();

        return Ok(agendas);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaDto>> GetAgenda(Guid id)
    {
        var agenda = await _context.Agendas
            .Where(agenda => agenda.Id == id)
            .Select(agenda => new AgendaDto
            {
                Id = agenda.Id,
                Name = agenda.Name,
                Description = agenda.Description
            })
            .FirstOrDefaultAsync();

        if (agenda == null)
        {
            return NotFound();
        }

        return Ok(agenda);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaDto>> CreateAgenda(
        AgendaDto agendaDto)
    {
        var agenda = new Agenda
        {
            Id = agendaDto.Id == Guid.Empty
                ? Guid.NewGuid()
                : agendaDto.Id,
            Name = agendaDto.Name,
            Description = agendaDto.Description
        };

        _context.Agendas.Add(agenda);

        await _context.SaveChangesAsync();

        var createdAgenda = new AgendaDto
        {
            Id = agenda.Id,
            Name = agenda.Name,
            Description = agenda.Description
        };

        return CreatedAtAction(
            nameof(GetAgenda),
            new { id = agenda.Id },
            createdAgenda);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAgenda(
        Guid id,
        AgendaDto agendaDto)
    {
        if (id != agendaDto.Id)
        {
            return BadRequest();
        }

        var agenda = await _context.Agendas.FindAsync(id);

        if (agenda == null)
        {
            return NotFound();
        }

        agenda.Name = agendaDto.Name;
        agenda.Description = agendaDto.Description;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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