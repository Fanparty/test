// Setup check. Run with: npm run check
// Confirms your machine is ready. It does not test your skills.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  require('dotenv').config();
} catch (err) {
  console.log('\nFAIL  Dependencies are not installed.\n      Run: npm install   and then run this check again.\n');
  process.exit(1);
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '\n      ' + detail : ''}`);
}

async function main() {
  console.log('\nSetup check\n');

  // 1. Node version
  const major = parseInt(process.versions.node.split('.')[0], 10);
  record(`Node version (${process.versions.node})`, major >= 18,
    major >= 18 ? '' : 'Please install Node 18 or newer (22 recommended): https://nodejs.org');

  // 2. Environment file
  const hasEnv = fs.existsSync(path.join(__dirname, '..', '.env'));
  record('.env file exists', hasEnv,
    hasEnv ? '' : 'Copy .env.example to .env and paste the connection string we sent you.');

  // 3. Connection string shape
  const url = process.env.DATABASE_URL || '';
  const urlOk = /^postgres(ql)?:\/\//.test(url) && !url.includes('USER:PASSWORD');
  record('DATABASE_URL looks valid', urlOk,
    urlOk ? '' : 'Paste the full connection string we sent you into .env as DATABASE_URL.');

  // 4. Prisma client generated
  let PrismaClient;
  try {
    ({ PrismaClient } = require('@prisma/client'));
    new PrismaClient();
    record('Prisma client generated', true);
  } catch (err) {
    record('Prisma client generated', false,
      'Run: npx prisma generate   (details: ' + String(err.message).split('\n')[0] + ')');
  }

  // 5-6. Database connection and write
  if (PrismaClient && urlOk) {
    const prisma = new PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1`;
      record('Database connection', true);
    } catch (err) {
      record('Database connection', false,
        'Could not reach the database. Check the connection string, your internet, and any firewall or VPN. (' +
        String(err.message).split('\n').filter(Boolean).pop() + ')');
      await prisma.$disconnect();
      return finish();
    }

    try {
      execSync('npx prisma db push --skip-generate', { stdio: 'pipe', timeout: 120000 });
      const row = await prisma.setupCheck.create({ data: {} });
      await prisma.setupCheck.delete({ where: { id: row.id } });
      record('Database write and delete', true);
    } catch (err) {
      const msg = String((err.stderr && err.stderr.toString()) || err.message).split('\n').filter(Boolean).slice(-2).join(' ');
      record('Database write and delete', false, 'Prisma could not create tables or write data. (' + msg + ')');
    }
    await prisma.$disconnect();
  } else {
    record('Database connection', false, 'Skipped: fix the items above first.');
  }

  finish();
}

function finish() {
  const failed = results.filter(r => !r.ok).length;
  console.log(failed === 0
    ? '\nAll checks passed. You are ready. Please also log in to your AI tool and keep it ready.\n'
    : `\n${failed} check(s) failed. Fix them, or message us with a screenshot of this output.\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => { console.error(err); process.exit(1); });
