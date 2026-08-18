using Backend.Data.Models;
using Backend.Dtos.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Select(e => new UserDto
            {
                Id = e.Id,
                EntraUserId = e.EntraUserId,
                Role = e.Role,
                Email = e.Email,
                Name = e.Name,
                DepartmentId = e.DepartmentId
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _context.Users
            .Where(e => e.Id == id)
            .Select(e => new UserDto
            {
                Id = e.Id,
                EntraUserId = e.EntraUserId,
                Role = e.Role,
                Email = e.Email,
                Name = e.Name,
                DepartmentId = e.DepartmentId
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser(User user)
    {
        if (user.DepartmentId.HasValue)
        {
            var departmentExists = await _context.Departments
                .AnyAsync(e => e.Id == user.DepartmentId.Value);

            if (!departmentExists)
            {
                return BadRequest(
                    "The specified department does not exist."
                );
            }
        }

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var createdUser = new UserDto
        {
            Id = user.Id,
            EntraUserId = user.EntraUserId,
            Role = user.Role,
            Email = user.Email,
            Name = user.Name,
            DepartmentId = user.DepartmentId
        };

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.Id },
            createdUser);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUser(
        Guid id,
        User user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }

        if (user.DepartmentId.HasValue)
        {
            var departmentExists = await _context.Departments
                .AnyAsync(e => e.Id == user.DepartmentId.Value);

            if (!departmentExists)
            {
                return BadRequest(
                    "The specified department does not exist."
                );
            }
        }

        var existingUser = await _context.Users
            .FindAsync(id);

        if (existingUser == null)
        {
            return NotFound();
        }

        existingUser.EntraUserId = user.EntraUserId;
        existingUser.Role = user.Role;
        existingUser.Email = user.Email;
        existingUser.Name = user.Name;
        existingUser.DepartmentId = user.DepartmentId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users
            .FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
