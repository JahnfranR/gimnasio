import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MiembrosForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    documento: '',
    estado: 'activo'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (esEdicion) fetchMiembro()
  }, [id])

  async function fetchMiembro() {
    setLoading(true)
    const { data } = await supabase.from('miembros').select('*').eq('id', id).single()
    if (data) setForm(data)
    setLoading(false)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (esEdicion) {
      const { error } = await supabase.from('miembros').update(form).eq('id', id)
      if (error) { alert('Error: ' + error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('miembros').insert([form])
      if (error) { alert('Error: ' + error.message); setLoading(false); return }
    }

    setLoading(false)
    navigate('/')
  }

  return (
    <div>
      <h2>{esEdicion ? 'Editar Miembro' : 'Nuevo Miembro'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nombre *</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Documento *</label>
          <input type="text" name="documento" value={form.documento} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
