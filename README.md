# SDE Intern Starter

This project contains setup files only. It has no application logic.
During the session you will write all of the application yourself.

## What you need
- Node.js 18 or newer (22 recommended)
- A code editor
- Your AI tool(s), logged in and ready, with a backup option if possible
- The database connection string we sent you (yours alone)

## Setup (please do this at least one day before)
1. Clone or unzip this project and open it in your editor.
2. Install dependencies:
   ```
   npm install
   ```
3. Create your environment file:
   ```
   cp .env.example .env
   ```
   (On Windows PowerShell: `copy .env.example .env`)
   Then open `.env` and paste your connection string as `DATABASE_URL`.
4. Run the setup check:
   ```
   npm run check
   ```
   Every line should say PASS.
5. Optional: start the server with `npm run dev` and open http://localhost:3000.

If anything fails, send us a screenshot of the output. We will help you fix it
before the session, or give you a cloud environment instead.

## No local setup possible?
Open this project in GitHub Codespaces (or any similar cloud editor) using the
included `.devcontainer`. Then follow steps 3 to 4 above.

## During the session
- You may keep this structure, change it, or replace the stack entirely.
  You own whatever you choose, and the clock does not stop for setup problems.
- You may delete the `SetupCheck` model in `prisma/schema.prisma` and design your own.
  After changing the schema, run `npm run db:push`
  (add `-- --accept-data-loss` if it warns about removing the SetupCheck table).
- Write all application logic during the session. Do not bring code written in advance.

## Useful commands
| Command | What it does |
| --- | --- |
| `npm run check` | Verifies your setup |
| `npm run dev` | Starts the server with auto-restart |
| `npm run db:push` | Applies your Prisma schema to the database |
| `npm run db:studio` | Opens a browser view of your data |
# test
