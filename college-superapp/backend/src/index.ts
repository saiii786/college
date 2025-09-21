import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://postgres:postgres@db:5432/college`
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// Demo login (replace with Keycloak later)
app.post('/auth/login', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const token = jwt.sign({ sub: username, role: 'student' }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' });
  res.json({ token });
});

// Protected sample
app.get('/student/summary', async (req, res) => {
  // naive auth for demo
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev');
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`select '75%' as attendance, 8.4 as gpa, 3500 as dues`);
    res.json(rows[0]);
  } finally {
    client.release();
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`backend listening on ${port}`));
