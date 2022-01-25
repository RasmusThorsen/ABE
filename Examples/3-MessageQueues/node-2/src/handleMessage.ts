import { Channel, connect } from "amqplib";

export default class HandleMessage {
    mainChannel: Channel | null = null;
    queueName = "second_queue";
    exhangeName = "direct_exchange"

    async initialize() {
        console.log("Initializing...");
        
        try {
            const connection = await connect(
                process.env.RABBIT_MQ_CONNECTION || "amqp://localhost"
            );
            this.mainChannel = await connection.createChannel();
            
            this.mainChannel.assertExchange(this.exhangeName, 'direct', {
                durable: false,
                autoDelete: true,
                arguments: null
            });

            // Make sure there is a queue before using it.
            this.mainChannel.assertQueue(this.queueName, {
                durable: false, // If rabbitmq crashes the queue is not lost
                autoDelete: true,
            });

            this.mainChannel.bindQueue(this.queueName, this.exhangeName, "second-bind");

            // Dont send messages before the previous are handled and acked.
            // Prefetch 1 allows one unacked message at a time.
            this.mainChannel.prefetch(1);
        } catch(error) {
            console.log(error);
        }

        this.mainChannel.consume(this.queueName, (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true,
        })

        console.log("Done...");
    }
}