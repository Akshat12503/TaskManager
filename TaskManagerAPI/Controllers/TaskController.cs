using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Protects all endpoints in this controller with JWT
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        // Helper method to extract User ID from JWT Claims
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        // GET: api/task (Retrieve all tasks belonging to the authenticated user)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            int userId = GetUserId();
            var tasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            return Ok(tasks);
        }

        // POST: api/task (Create a new task)
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask([FromBody] TaskCreateDto dto)
        {
            int userId = GetUserId();

            var taskItem = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Stage = "Todo", // Initial state defaults to Todo
                UserId = userId
            };

            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();

            return Ok(taskItem);
        }

        // PUT: api/task/{id} (Update task text, description, or change stage)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateDto dto)
        {
            int userId = GetUserId();
            var taskItem = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (taskItem == null)
            {
                return NotFound("Task not found or unauthorized access.");
            }

            taskItem.Title = dto.Title;
            taskItem.Description = dto.Description;
            taskItem.Stage = dto.Stage; // "Todo", "In Progress", "Done"

            _context.Tasks.Entry(taskItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(taskItem);
        }

        // DELETE: api/task/{id} (Remove a task permanently)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            int userId = GetUserId();
            var taskItem = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (taskItem == null)
            {
                return NotFound("Task not found or unauthorized access.");
            }

            _context.Tasks.Remove(taskItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully." });
        }
    }

    public class TaskCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class TaskUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Stage { get; set; } = "Todo";
    }
}           
