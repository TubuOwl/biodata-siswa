'use client'

import { useState, useEffect, useRef } from 'react'

interface Siswa {
  id: number
  nama: string
  nim: string
  whatsapp: string
  foto_url: string | null
}

export default function Page() {
  const [list, setList]         = useState<Siswa[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy]         = useState(false)
  const [toast, setToast]       = useState('')
  const [search, setSearch]     = useState('')
  const [form, setForm]         = useState({ nama: '', nim: '', whatsapp: '' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/siswa')
      setList(await r.json())
    } finally { setLoading(false) }
  }

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function tambah(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama || !form.nim || !form.whatsapp) return notify('Semua field wajib diisi')
    setBusy(true)
    const r = await fetch('/api/siswa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setBusy(false)
    if (r.ok) {
      notify('Data berhasil ditambahkan')
      setForm({ nama: '', nim: '', whatsapp: '' })
      setShowForm(false)
      load()
    } else {
      const d = await r.json()
      notify(d.error || 'Gagal menyimpan')
    }
  }

  async function hapus(id: number, nama: string) {
    if (!confirm('Hapus ' + nama + '?')) return
    await fetch('/api/siswa/' + id, { method: 'DELETE' })
    notify('Data dihapus')
    load()
  }

  const filtered = list.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nim.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Biodata Rombel 3</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 2 }}>Mata Pelajaran PPKN</p>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 999,
          background: '#1e293b', color: '#fff',
          padding: '0.6rem 1rem', borderRadius: 8,
          fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>{toast}</div>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out',
        }}>
          <img src={lightbox} alt="Foto siswa" style={{
            maxWidth: '90vw', maxHeight: '90vh',
            borderRadius: 12, objectFit: 'contain',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }} />
          <button onClick={() => setLightbox(null)} style={{
            position: 'fixed', top: 16, right: 16,
            background: 'rgba(255,255,255,0.2)', border: 'none',
            color: '#fff', width: 36, height: 36,
            borderRadius: '50%', fontSize: '1rem', cursor: 'pointer',
          }}>X</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Cari nama / NIM..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 180, padding: '0.5rem 0.75rem',
            border: '1px solid #cbd5e1', borderRadius: 6,
            fontSize: '0.88rem', background: '#fff', outline: 'none',
          }}
        />
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '0.5rem 1rem',
          background: showForm ? '#64748b' : '#2563eb',
          color: '#fff', border: 'none',
          borderRadius: 6, fontWeight: 600, fontSize: '0.85rem',
        }}>
          {showForm ? 'X Batal' : '+ Tambah'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, padding: '1rem', marginBottom: '1rem',
        }}>
          <form onSubmit={tambah} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <Field label="Nama Lengkap" placeholder="Contoh: Budi Santoso"
              value={form.nama} onChange={v => setForm({ ...form, nama: v })} />
            <Field label="NIM" placeholder="Contoh: 2023001"
              value={form.nim} onChange={v => setForm({ ...form, nim: v })} />
            <Field label="Nomor WhatsApp" placeholder="Contoh: 08123456789"
              value={form.whatsapp} onChange={v => setForm({ ...form, whatsapp: v })} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 4 }}>
              <button type="button" onClick={() => setShowForm(false)} style={btnSec}>Batal</button>
              <button type="submit" disabled={busy} style={btnPri}>
                {busy ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
        {loading ? 'Memuat...' : filtered.length + ' siswa'}
      </p>

      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Memuat data...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <p>Belum ada data siswa</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((s, i) => (
            <KartuSiswa key={s.id} siswa={s} no={i + 1}
              onHapus={() => hapus(s.id, s.nama)}
              onRefresh={load}
              onLihatFoto={() => s.foto_url && setLightbox(s.foto_url)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function KartuSiswa({ siswa, no, onHapus, onRefresh, onLihatFoto }: {
  siswa: Siswa; no: number
  onHapus: () => void; onRefresh: () => void; onLihatFoto: () => void
}) {
  const fileRef    = useRef<HTMLInputElement>(null)
  const [up, setUp] = useState(false)

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return alert('Foto maks 2MB')
    setUp(true)
    const fd = new FormData()
    fd.append('foto', file)
    fd.append('id', String(siswa.id))
    await fetch('/api/upload', { method: 'POST', body: fd })
    setUp(false)
    onRefresh()
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 10, padding: '0.75rem',
    }}>
      <span style={{ fontSize: '0.75rem', color: '#94a3b8', minWidth: 18, textAlign: 'right' }}>
        {no}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
        <div
          onClick={siswa.foto_url ? onLihatFoto : undefined}
          title={siswa.foto_url ? 'Klik untuk lihat foto' : 'Belum ada foto'}
          style={{
            width: 100, height: 100, borderRadius: 10,
            border: '1px solid #e2e8f0', background: '#f8fafc',
            overflow: 'hidden',
            cursor: siswa.foto_url ? 'zoom-in' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {up ? (
            <span style={{ fontSize: '1.4rem' }}>⏳</span>
          ) : siswa.foto_url ? (
            <img src={siswa.foto_url} alt={siswa.nama}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '2.2rem' }}>👤</span>
          )}
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          style={{
            fontSize: '0.68rem', padding: '2px 8px',
            background: '#f1f5f9', border: '1px solid #cbd5e1',
            borderRadius: 4, color: '#475569', cursor: 'pointer',
          }}
        >
          📷 {siswa.foto_url ? 'Ganti' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={uploadFoto} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {siswa.nama}
        </p>
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 5 }}>
          NIM: {siswa.nim}
        </p>
        <a href={'https://wa.me/' + siswa.whatsapp} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: '#25D366', color: '#fff',
            padding: '3px 10px', borderRadius: 20,
            fontSize: '0.75rem', fontWeight: 600,
          }}
        >
          <WaIcon /> {siswa.whatsapp}
        </a>
      </div>

      <button onClick={onHapus} title="Hapus" style={{
        background: 'none', border: '1px solid #fca5a5',
        borderRadius: 6, color: '#ef4444',
        width: 30, height: 30, fontSize: '0.85rem', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>X</button>
    </div>
  )
}

function Field({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      <input type="text" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '0.5rem 0.75rem',
          border: '1px solid #cbd5e1', borderRadius: 6,
          fontSize: '0.88rem', outline: 'none',
        }}
      />
    </div>
  )
}

function WaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

const btnPri: React.CSSProperties = {
  padding: '0.5rem 1.1rem', background: '#2563eb', color: '#fff',
  border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
}
const btnSec: React.CSSProperties = {
  padding: '0.5rem 1.1rem', background: '#f1f5f9', color: '#475569',
  border: '1px solid #cbd5e1', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
}
