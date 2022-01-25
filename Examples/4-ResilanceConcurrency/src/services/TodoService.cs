using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Resiliance.Models;

namespace Resiliance.Services
{
    public class TodoService : ITodoService
    {
        private readonly HttpClient _httpClient;
        private string _endpoint = "https://jsonplaceholder.typicode.com/todos";

        public TodoService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Todo>> FetchAll()
        {
            Console.WriteLine("Sending FetchAll request");
            
            var response = await _httpClient.GetAsync(_endpoint);
            // response.EnsureSuccessStatusCode();
            try
            {
                return await response.Content.ReadAsAsync<IEnumerable<Todo>>();
            }
            catch (System.Exception)
            {
                Console.WriteLine("HTTP Response was invalid or could not be deserialised.");
            }

            return null;
        }

        public async Task<Todo> FetchOne(int id) {
            Console.WriteLine("Sending FetchOne request");

            var response = await _httpClient.GetAsync($"{_endpoint}/{id}");
            // response.EnsureSuccessStatusCode();

            try
            {
                return await response.Content.ReadAsAsync<Todo>();
            }
            catch (System.Exception)
            {
                Console.WriteLine("HTTP Response was invalid or could not be deserialised.");
            }

            return null;
        }
    }
}

