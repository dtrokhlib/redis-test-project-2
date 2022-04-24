import { redis } from './redis-client.js';

export function rateLimiter({ secondsWindow, allowedHits }) {
  return async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const requests = await redis.incr(ip);
    let ttl;
    console.log(requests);
    if (requests == 1) {
      await redis.expire(ip, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redis.ttl(ip);
    }

    if (requests > allowedHits) {
      return res.status(503).send({
        response: 'Api Rate Limit reached',
        callsInAMinute: requests,
        ttl,
      });
    }

    req.requests = requests;
    req.ttl = ttl;
    next();
  };
};
