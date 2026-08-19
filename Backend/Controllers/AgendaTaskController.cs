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
                    },

                DepartmentId = e.DepartmentId,

                Department = e.Department == null
                    ? null
                    : new DepartmentDto
                    {
                        Id = e.Department.Id,
                        Name = e.Department.Name
                    },

                UserId = e.UserId,

                User = e.User == null
                    ? null
                    : new UserDto
                    {
                        Id = e.User.Id,
                        Name = e.User.Name,
                        Email = e.User.Email,
                        DepartmentId = e.User.DepartmentId
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
                    },

                DepartmentId = e.DepartmentId,

                Department = e.Department == null
                    ? null
                    : new DepartmentDto
                    {
                        Id = e.Department.Id,
                        Name = e.Department.Name
                    },

                UserId = e.UserId,

                User = e.User == null
                    ? null
                    : new UserDto
                    {
                        Id = e.User.Id,
                        Name = e.User.Name,
                        Email = e.User.Email,
                        DepartmentId = e.User.DepartmentId
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

        var departmentExists = true;

        if (agendaTask.DepartmentId.HasValue)
        {
            departmentExists = await _context.Departments
                .AnyAsync(e => e.Id == agendaTask.DepartmentId.Value);

            if (!departmentExists)
            {
                return BadRequest(
                    "The specified department does not exist."
                );
            }
        }

        if (agendaTask.UserId.HasValue)
        {
            var user = await _context.Users
                .Where(e => e.Id == agendaTask.UserId.Value)
                .Select(e => new
                {
                    e.Id,
                    e.DepartmentId
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(
                    "The specified user does not exist."
                );
            }

            if (!agendaTask.DepartmentId.HasValue)
            {
                agendaTask.DepartmentId = user.DepartmentId;
            }
            else if (user.DepartmentId != agendaTask.DepartmentId)
            {
                return BadRequest(
                    "The specified user does not belong to the specified department."
                );
            }
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
                    },

                DepartmentId = e.DepartmentId,

                Department = e.Department == null
                    ? null
                    : new DepartmentDto
                    {
                        Id = e.Department.Id,
                        Name = e.Department.Name
                    },

                UserId = e.UserId,

                User = e.User == null
                    ? null
                    : new UserDto
                    {
                        Id = e.User.Id,
                        Name = e.User.Name,
                        Email = e.User.Email,
                        DepartmentId = e.User.DepartmentId
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

        var agendaTaskExists = await _context.AgendaTasks
            .AnyAsync(e => e.Id == id);

        if (!agendaTaskExists)
        {
            return NotFound();
        }

        var agendaItemExists = await _context.AgendaItems
            .AnyAsync(e => e.Id == agendaTask.AgendaItemId);

        if (!agendaItemExists)
        {
            return BadRequest(
                "The specified agenda item does not exist."
            );
        }

        if (agendaTask.DepartmentId.HasValue)
        {
            var departmentExists = await _context.Departments
                .AnyAsync(e => e.Id == agendaTask.DepartmentId.Value);

            if (!departmentExists)
            {
                return BadRequest(
                    "The specified department does not exist."
                );
            }
        }

        if (agendaTask.UserId.HasValue)
        {
            var user = await _context.Users
                .Where(e => e.Id == agendaTask.UserId.Value)
                .Select(e => new
                {
                    e.Id,
                    e.DepartmentId
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(
                    "The specified user does not exist."
                );
            }

            if (!agendaTask.DepartmentId.HasValue)
            {
                agendaTask.DepartmentId = user.DepartmentId;
            }
            else if (user.DepartmentId != agendaTask.DepartmentId)
            {
                return BadRequest(
                    "The specified user does not belong to the specified department."
                );
            }
        }

        _context.Entry(agendaTask).State =
            EntityState.Modified;

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
        var agendaTask = await _context.AgendaTasks
            .FindAsync(id);

        if (agendaTask == null)
        {
            return NotFound();
        }

        _context.AgendaTasks.Remove(agendaTask);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}