const IORedis = require('ioredis');
const Logger = require('../Logger');
const log = new Logger('Server');

const redis = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});

redis.on('connect', () => log.log(`%cConnected to Redis`, 'font-family:monospace; color: green; font-size: 16px'));
redis.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redis;
