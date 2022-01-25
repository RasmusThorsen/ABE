using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Resiliance.Services;
using Polly;
using System.Net.Http;
using Polly.Extensions.Http;
using Polly.Contrib.Simmy.Outcomes;
using Polly.Contrib.Simmy;
using System.Net;
using Polly.Wrap;

namespace Resiliance
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            HttpResponseMessage faultHttpResponseMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError)
	        {
                Content = new StringContent("Simmy swapped the Ok for an Internal Server Error")
            };
            
            var faultPolicy = MonkeyPolicy.InjectFaultAsync(
                faultHttpResponseMessage,
                injectionRate: .99,
                enabled: () => true 
            );

            services.AddControllers();

            AsyncPolicyWrap<HttpResponseMessage> faultAndRetryWrap = Policy.WrapAsync(GetRetryPolicy(), GetCircuitBreakerPolicy(), faultPolicy);

            services.AddHttpClient<ITodoService, TodoService>().AddPolicyHandler(faultAndRetryWrap);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        // private static readonly Random _random = new Random();
        static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy() => HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
            .WaitAndRetryAsync(5, retryAttempt => {
                Console.WriteLine($"Retrying: {retryAttempt}");
                return TimeSpan.FromSeconds(1); 
                // TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)); 
                // + TimeSpan.FromMilliseconds(_random.Next(1, 100))
                }
            );

        static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy() => HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
            .CircuitBreakerAsync(5, TimeSpan.FromSeconds(10), onBreak: (msg, time) => {
                Console.WriteLine("Circuit Broken");
            }, onReset: () => {
                Console.WriteLine("Resetting...");
            }, onHalfOpen: () => {
                Console.WriteLine("Half open");
            });
    }
}
