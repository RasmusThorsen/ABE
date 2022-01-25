using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Resiliance.Models;
using Resiliance.Services;

namespace Resiliance.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<IEnumerable<Todo>> Get()
        {
           return await _todoService.FetchAll();
        }

        [HttpGet("{id}")]
        public async Task<Todo> GetOne([FromRoute] int id)
        {
           return await _todoService.FetchOne(id);
        }
    }
}