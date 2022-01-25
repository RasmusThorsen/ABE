using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System;

namespace API
{
    [Route("identity")]
    [Authorize(Policy = "ApiScope")]
    public class IdentityController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            Console.WriteLine("Received Request");
            return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
        }
    }
}
