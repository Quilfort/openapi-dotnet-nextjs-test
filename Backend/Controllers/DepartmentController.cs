using Backend.Data.Models;
using Backend.Dtos.Departments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/departments")]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
    {
        var departments = await _context.Departments
            .Select(e => new DepartmentDto
            {
                Id = e.Id,
                Name = e.Name
            })
            .ToListAsync();

        return Ok(departments);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(Guid id)
    {
        var department = await _context.Departments
            .Where(e => e.Id == id)
            .Select(e => new DepartmentDto
            {
                Id = e.Id,
                Name = e.Name
            })
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound();
        }

        return Ok(department);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(
        Department department)
    {
        if (string.IsNullOrWhiteSpace(department.Name))
        {
            return BadRequest("Department name is required.");
        }

        department.Name = department.Name.Trim();

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        var createdDepartment = new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name
        };

        return CreatedAtAction(
            nameof(GetDepartment),
            new { id = department.Id },
            createdDepartment);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateDepartment(
        Guid id,
        Department department)
    {
        if (id != department.Id)
        {
            return BadRequest();
        }

        if (string.IsNullOrWhiteSpace(department.Name))
        {
            return BadRequest("Department name is required.");
        }

        var existingDepartment = await _context.Departments
            .FindAsync(id);

        if (existingDepartment == null)
        {
            return NotFound();
        }

        existingDepartment.Name = department.Name.Trim();

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteDepartment(Guid id)
    {
        var department = await _context.Departments
            .FindAsync(id);

        if (department == null)
        {
            return NotFound();
        }

        _context.Departments.Remove(department);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}