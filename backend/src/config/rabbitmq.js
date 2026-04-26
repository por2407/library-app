const amqp = require('amqplib');
const { cfg } = require('./env');

let connection = null;
let channel = null;

async function connectRabbitMQ() {
    try {
        if (connection && channel) return { connection, channel };

        connection = await amqp.connect(cfg.rabbitmqUrl);
        channel = await connection.createChannel();

        console.log('Connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error', err);
            connection = null;
            channel = null;
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            connection = null;
            channel = null;
        });

        return { connection, channel };
    } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
        throw err;
    }
}

async function publishMessage(queue, message) {
    try {
        const { channel } = await connectRabbitMQ();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
        console.log(`Message sent to queue: ${queue}`);
    } catch (err) {
        console.error('Failed to publish message', err);
    }
}

module.exports = {
    connectRabbitMQ,
    publishMessage,
};
