using Backend.Data.Models;
using Backend.Dto.AgendaItems;
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
    public async Task<ActionResult<IEnumerable<AgendaItemDto>>> GetAgendaItems()
    {
        var agendaItems = await _context.AgendaItems
            .Select(agendaItem => new AgendaItemDto
            {
                Id = agendaItem.Id,
                Name = agendaItem.Name,
                Description = agendaItem.Description,
                StartDate = agendaItem.StartDate,
                EndDate = agendaItem.EndDate,
                StartTime = agendaItem.StartTime,
                EndTime = agendaItem.EndTime,
                AgendaId = agendaItem.AgendaId,

                Agenda = agendaItem.Agenda == null
                    ? null
                    : new Backend.Dto.Agenda.AgendaDto
                    {
                        Id = agendaItem.Agenda.Id,
                        Name = agendaItem.Agenda.Name,
                        Description = agendaItem.Agenda.Description
                    }
            })
            .ToListAsync();

        return Ok(agendaItems);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgendaItemDto>> GetAgendaItem(Guid id)
    {
        var agendaItem = await _context.AgendaItems
            .Where(e => e.Id == id)
            .Select(e => new AgendaItemDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                AgendaId = e.AgendaId,

                Agenda = e.Agenda == null
                    ? null
                    : new Backend.Dto.Agenda.AgendaDto
                    {
                        Id = e.Agenda.Id,
                        Name = e.Agenda.Name,
                        Description = e.Agenda.Description
                    }
            })
            .FirstOrDefaultAsync();

        if (agendaItem == null)
        {
            return NotFound();
        }

        return Ok(agendaItem);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgendaItemDto>> CreateAgendaItem(
        AgendaItemDto agendaItemDto)
    {
        var agendaExists = await _context.Agendas
            .AnyAsync(e => e.Id == agendaItemDto.AgendaId);

        if (!agendaExists)
        {
            return BadRequest(
                "The specified agenda does not exist."
            );
        }

        var agendaItem = new AgendaItem
        {
            Id = agendaItemDto.Id == Guid.Empty
                ? Guid.NewGuid()
                : agendaItemDto.Id,
            Name = agendaItemDto.Name,
            Description = agendaItemDto.Description,
            StartDate = agendaItemDto.StartDate,
            EndDate = agendaItemDto.EndDate,
            StartTime = agendaItemDto.StartTime,
            EndTime = agendaItemDto.EndTime,
            AgendaId = agendaItemDto.AgendaId
        };

        _context.AgendaItems.Add(agendaItem);

        await _context.SaveChangesAsync();

        var createdAgendaItem = await _context.AgendaItems
            .Where(e => e.Id == agendaItem.Id)
            .Select(e => new AgendaItemDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                AgendaId = e.AgendaId,

                Agenda = e.Agenda == null
                    ? null
                    : new Backend.Dto.Agenda.AgendaDto
                    {
                        Id = e.Agenda.Id,
                        Name = e.Agenda.Name,
                        Description = e.Agenda.Description
                    }
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetAgendaItem),
            new { id = agendaItem.Id },
            createdAgendaItem);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAgendaItem(
        Guid id,
        AgendaItemDto agendaItemDto)
    {
        if (id != agendaItemDto.Id)
        {
            return BadRequest();
        }

        var agendaExists = await _context.Agendas
            .AnyAsync(e => e.Id == agendaItemDto.AgendaId);

        if (!agendaExists)
        {
            return BadRequest(
                "The specified agenda does not exist."
            );
        }

        var agendaItem = await _context.AgendaItems
            .FindAsync(id);

        if (agendaItem == null)
        {
            return NotFound();
        }

        agendaItem.Name = agendaItemDto.Name;
        agendaItem.Description = agendaItemDto.Description;
        agendaItem.StartDate = agendaItemDto.StartDate;
        agendaItem.EndDate = agendaItemDto.EndDate;
        agendaItem.StartTime = agendaItemDto.StartTime;
        agendaItem.EndTime = agendaItemDto.EndTime;
        agendaItem.AgendaId = agendaItemDto.AgendaId;

        await _context.SaveChangesAsync();

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
}