import { neon } from '@neondatabase/serverless'

export function sql() {
  return neon(process.env.DATABASE_URL!)
}

export async function initTable() {
  const db = sql()
  await db`
    CREATE TABLE IF NOT EXISTS siswa (
      id        SERIAL PRIMARY KEY,
      nama      VARCHAR(255) NOT NULL,
      nim       VARCHAR(100) NOT NULL,
      whatsapp  VARCHAR(30)  NOT NULL,
      foto_url  TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}
