require('dotenv').config();
const createApp = require('./src/app');
const { cfg } = require('./src/config/env');

const app = createApp();
const PORT = cfg.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
