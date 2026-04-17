const redis = require('redis');
const { cfg } = require('./env');

const redisClient = redis.createClient({
  url: cfg.redis
});

redisClient.on('error', (err) => console.error('🔴 Redis Client Error:', err.message));
redisClient.on('connect', () => console.log('🟢 Redis Connected Successfully'));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('🔴 Redis Initial Connection Failed:', err.message);
  }
})();

module.exports = redisClient;