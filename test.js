const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const redis = require('./redis-client');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/post', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const requests = await redis.incr(ip);
  requests.expire(ip, 2);
  if (requests < 10) {
    return res.send({
      status: 'ok',
    });
  }
  if (requests <= 15) {
    return res.send({
      status: 'about-to-rate-limit',
    });
  }

  return res.send({
    status: 'about-to-rate-limit',
  });
});

app.listen(process.env.PUBLIC_PORT);
