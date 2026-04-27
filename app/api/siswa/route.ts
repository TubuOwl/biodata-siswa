import { NextRequest, NextResponse } from 'next/server'
import { sql, initTable } from '@/lib/db'

export async function GET() {
  try {
    const db = sql()
    await initTable()
    const rows = await db`SELECT * FROM siswa ORDER BY nama ASC`
    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = sql()
    await initTable()
    const { nama, nim, whatsapp } = await req.json()

    if (!nama || !nim || !whatsapp) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    // Normalkan nomor WA → hanya angka, awalan 62
    let wa = whatsapp.replace(/\D/g, '')
    if (wa.startsWith('0')) wa = '62' + wa.slice(1)
    else if (!wa.startsWith('62')) wa = '62' + wa

    const rows = await db`
      INSERT INTO siswa (nama, nim, whatsapp)
      VALUES (${nama.trim()}, ${nim.trim()}, ${wa})
      RETURNING *
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
