using System;
using System.Text;
using RabbitMQ.Client;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {
            var exchangeName = "direct_exchange";

            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    channel.ExchangeDeclare(
                        exchange: exchangeName,
                        type: "direct",
                        durable: false,
                        autoDelete: true,
                        arguments: null
                    );

                    string message = "Hello World!";
                    var body = Encoding.UTF8.GetBytes(message);

                    channel.BasicPublish(exchange: exchangeName,
                                        routingKey: "first-bind",
                                        basicProperties: null,
                                        body: body);
                    Console.WriteLine(" [x] Sent {0}", message);
                }
            }
        }
    }
}
