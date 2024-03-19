import { createClient } from 'redis';

const client = createClient({
    url: 'planespotter-redis.rrsknq.clustercfg.apse2.cache.amazonaws.com:6379',
});

// const demoRedis = async (redisClient) => {
//     try {
//         await redisClient.connect();
//     } catch (error) {
//         console.error('Redis Error:', error);
//     }
// }

// demoRedis(client).catch(console.error);

const scan = async (key) => {
    try {
      const value = await client.get(key);

      return value || null;
      
    } catch (error) {
      console.error('Redis Error', error);

      return null;
    }
}

const set = async (key, value) => {
  try {
    await client.set(key, value);

    return true;
    
  } catch (error) {
    console.error('Redis Error', error);

    return false;
  }
}

export { scan, set };