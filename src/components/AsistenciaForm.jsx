import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AsistenciaForm() {
  const { miembroId } = useParams()
  const navigate = useNavigate()
  const [miembro, setMiembro] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState('entrada')

  useEffect(() => {
    fetchMiembro()
  }, [miembroId])

  async function fetchMiembro() {
    if (!miembroId) {
      setMiembro({ nombre: 'N/A', documento: 'N/A', estado: 'activo' })
      return
    }
    const { data, error } = await supabase.from('miembros').select('*').eq('id', miembroId).single()
    if (error) {
      alert('Error: Miembro no encontrado')
      navigate('/')
      return
    }
    if (data) setMiembro(data)
  }

  async function handleRegistrar(e) {
    e.preventDefault()
    setLoading(true)

    if (tipo === 'entrada') {
      const { error } = await supabase.from('asistencias').insert([{
        miembro_id: parseInt(miembroId),
        fecha: new Date().toISOString().split('T')[0],
        hora_entrada: new Date().toTimeString().split(' ')[0]
      }])
      if (error) { alert('Error: ' + error.message); setLoading(false); return }
    } else {
      const { data: asistenciaActiva } = await supabase
        .from('asistencias')
        .select('id')
        .eq('miembro_id', miembroId)
        .is('hora_salida', null)
        .order('fecha', { ascending: false })
        .limit(1)
        .single()

      if (asistenciaActiva) {
        const { error } = await supabase
          .from('asistencias')
          .update({ hora_salida: new Date().toTimeString().split(' ')[0] })
          .eq('id', asistenciaActiva.id)
        if (error) { alert('Error: ' + error.message); setLoading(false); return }
      } else {
        alert('No hay asistencia activa para registrar salida')
        setLoading(false)
        return
      }
    }

    setLoading(false)
    navigate(`/miembros/${miembroId}`)
  }

  if (!miembro) return <p>Cargando miembro...</p>

  return (
    <div>
      <h2>Registrar Asistencia</h2>
      <div className="detail-card">
        <p><strong>Miembro:</strong> {miembro.nombre}</p>
        <p><strong>Documento:</strong> {miembro.documento}</p>
        <p><strong>Estado:</strong> <span className={`badge badge-${miembro.estado}`}>{miembro.estado}</span></p>
      </div>

      <form onSubmit={handleRegistrar} className="form">
        <div className="form-group">
          <label>Tipo de Registro</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input type="text" value={new Date().toLocaleDateString()} disabled />
        </div>

        <div className="form-group">
          <label>Hora</label>
          <input type="text" value={new Date().toLocaleTimeString()} disabled />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
          </button>
          <button type="button" className="btn" onClick={() => navigate(`/miembros/${miembroId}`)}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
