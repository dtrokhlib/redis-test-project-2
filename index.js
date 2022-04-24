import express from 'express';
import path from 'path';
import { redis } from './redis-client.js';
import { rateLimiter } from './rate-limiter.js';

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.post(
  '/api1',
  rateLimiter({ secondsWindow: 10, allowedHits: 4 }),
  async (req, res) => {
    try {
      res.send({
        response: 'ok',
        callsInAMinute: req.requests,
        ttl: req.ttl,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

app.post(
  '/api2',
  rateLimiter({ secondsWindow: 10, allowedHits: 4 }),
  async (req, res) => {
    try {
      res.send({
        response: 'ok',
        callsInAMinute: req.requests,
        ttl: req.ttl,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

app.post(
  '/api3',
  rateLimiter({ secondsWindow: 10, allowedHits: 4 }),
  async (req, res) => {
    try {
      res.send({
        response: 'ok',
        callsInAMinute: req.requests,
        ttl: req.ttl,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);
