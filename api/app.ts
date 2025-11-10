import cors from 'cors';
import express from 'express';
import routes from './routes';

const app = express();
const CLIENT_PORT = process.env.CLIENT_PORT || '3001';

app.use(express.json());

app.use(
  cors({
    origin: [
      `http://localhost:${CLIENT_PORT}`,
      `http://127.0.0.1:${CLIENT_PORT}`,
    ],
    credentials: true,
  }),
);

app.get('/', (_req, res) => {
  res.json({ message: 'server started' });
});

app.use('/', routes);

export default app;