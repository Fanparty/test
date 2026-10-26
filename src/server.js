// Minimal server so you can confirm everything runs.
// All application logic is for you to write during the session.
require('dotenv').config();
const path = require('path');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, database: 'unreachable', error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starter running on http://localhost:${port}`));
