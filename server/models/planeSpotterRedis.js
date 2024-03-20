import { createClient } from 'redis';

const client = createClient({
    url: 'redis://plane-spotter-redis.rrsknq.ng.0001.apse2.cache.amazonaws.com:6379',
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

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