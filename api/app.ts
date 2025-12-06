import cors from 'cors';
import express from 'express';
import routes from './routes';
import path from 'path';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  res.json({ message: 'server started' });
});

app.use('/', routes);

export default app;