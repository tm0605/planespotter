import { createClient } from 'redis';

const client = createClient({
    url: 'planespotter-redis.rrsknq.clustercfg.apse2.cache.amazonaws.com:6379',
});

const demoRedis = async (redisClient) => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Redis Error:', error);
    }
}

demoRedis(client).catch(console.error);

const scan = async (redisClient, key) => {
    await redisClient.connect();

    const value = await redisClient.get(key);
    await redisClient.quit();

    if (value) return value;

    else return null;
}

const set = async (redisClient, key, value) => {
    await redisClient.connect();

    await redisClient.set(key, value);
}