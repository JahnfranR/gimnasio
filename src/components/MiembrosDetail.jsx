import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MiembrosDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [miembro, setMiembro] = useState(null)
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    const { data: miembroData } = await supabase.from('miembros').select('*').eq('id', id).single()
    const { data: asistenciasData } = await supabase
      .from('asistencias')
      .select('*')
      .eq('miembro_id', id)
      .order('fecha', { ascending: false })

    if (miembroData) setMiembro(miembroData)
    if (asistenciasData) setAsistencias(asistenciasData)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este miembro y todas sus asistencias?')) return
    const { error } = await supabase.from('miembros').delete().eq('id', id)
    if (!error) navigate('/')
  }

  if (loading) return <p>Cargando...</p>
  if (!miembro) return <p>Miembro no encontrado.</p>

  return (
    <div>
      <h2>Detalle del Miembro</h2>
      <div className="detail-card">
        <p><strong>ID:</strong> {miembro.id}</p>
        <p><strong>Nombre:</strong> {miembro.nombre}</p>
        <p><strong>Email:</strong> {miembro.email}</p>
        <p><strong>Teléfono:</strong> {miembro.telefono || 'N/A'}</p>
        <p><strong>Documento:</strong> {miembro.documento}</p>
        <p><strong>Estado:</strong> <span className={`badge badge-${miembro.estado}`}>{miembro.estado}</span></p>
        <p><strong>Fecha de registro:</strong> {miembro.fecha_registro}</p>
      </div>

      <div className="form-actions">
        <Link to={`/asistencias/${id}/nueva`} className="btn btn-primary">Registrar Asistencia</Link>
        <Link to={`/miembros/${id}/editar`} className="btn btn-secondary">Editar</Link>
        <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
        <Link to="/" className="btn">Volver</Link>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Historial de Asistencias</h3>
      {asistencias.length === 0 ? (
        <p>No hay asistencias registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.fecha}</td>
                <td>{a.hora_entrada}</td>
                <td>{a.hora_salida || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
