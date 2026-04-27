import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = sql()
    await db`DELETE FROM siswa WHERE id = ${parseInt(params.id)}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = sql()
    const { foto_url } = await req.json()
    const rows = await db`
      UPDATE siswa SET foto_url = ${foto_url}
      WHERE id = ${parseInt(params.id)}
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal update foto' }, { status: 500 })
  }
}
