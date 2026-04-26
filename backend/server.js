require('dotenv').config();
const createApp = require('./src/app');
const { cfg } = require('./src/config/env');

const { startEmailWorker } = require('./src/workers/emailWorker');

const app = createApp();
const PORT = cfg.port;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Start RabbitMQ Email Worker
    await startEmailWorker();
});
