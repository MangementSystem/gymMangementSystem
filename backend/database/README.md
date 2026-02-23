# Database Notes

## Schema alignment migration

The backend entities were aligned with the active Neon database used by `backend/.env`.

Migration file:

- `backend/database/migrations/2026-02-23-align-with-backend.sql`

It is non-destructive:

- Adds missing columns expected by the backend entities
- Backfills new columns from legacy columns where possible
- Keeps legacy columns/tables/views intact

## Run migration manually

From `backend/`:

```powershell
@'
require('dotenv').config({ path: './.env' });
const fs = require('fs');
const { Client } = require('pg');
(async () => {
  const sql = fs.readFileSync('./database/migrations/2026-02-23-align-with-backend.sql', 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('Migration applied successfully.');
})();
'@ | node -
```
