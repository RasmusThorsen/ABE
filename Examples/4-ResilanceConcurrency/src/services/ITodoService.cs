using System.Collections.Generic;
using System.Threading.Tasks;
using Resiliance.Models;

namespace Resiliance.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Todo>> FetchAll();
        Task<Todo> FetchOne(int id);
    }
}

