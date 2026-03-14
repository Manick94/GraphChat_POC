import express from 'express';
import cors from 'cors';
import conversations from './routes/conversations';
import scenarios from './routes/scenarios';
import './db';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/conversations', conversations);
app.use('/api/scenarios', scenarios);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
