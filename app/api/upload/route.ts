import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('foto') as File
    const id   = form.get('id') as string

    if (!file) return NextResponse.json({ error: 'File tidak ada' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Harus file gambar' }, { status: 400 })
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'Maks 2MB' }, { status: 400 })

    const buffer  = Buffer.from(await file.arrayBuffer())
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    if (id) {
      const db = sql()
      await db`UPDATE siswa SET foto_url = ${dataUrl} WHERE id = ${parseInt(id)}`
    }

    return NextResponse.json({ url: dataUrl })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 })
  }
}
