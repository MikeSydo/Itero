import cors from 'cors';
import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get('/', (_req, res) => {
  res.json({ message: 'server started' });
});

app.use('/', routes);

export default app;