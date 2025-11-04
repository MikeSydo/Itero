import app from './app';

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Itero API server running on http://localhost:${PORT}`);
});
