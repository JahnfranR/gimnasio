import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AsistenciaList() {
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAsistencias()
  }, [fechaFiltro])

  async function fetchAsistencias() {
    setLoading(true)
    const { data, error } = await supabase
      .from('asistencias')
      .select(`
        id,
        fecha,
        hora_entrada,
        hora_salida,
        miembros (
          id,
          nombre,
          documento
        )
      `)
      .eq('fecha', fechaFiltro)
      .order('hora_entrada', { ascending: false })

    if (data) setAsistencias(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar esta asistencia?')) return
    const { error } = await supabase.from('asistencias').delete().eq('id', id)
    if (!error) fetchAsistencias()
  }

  if (loading) return <p>Cargando asistencias...</p>

  return (
    <div>
      <div className="header">
        <h2>Asistencias del Dia</h2>
        <Link to="/asistencias/nueva" className="btn btn-primary">+ Registrar Asistencia</Link>
      </div>

      <div className="filter-group">
        <label>Filtrar por fecha:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />
      </div>

      {asistencias.length === 0 ? (
        <p>No hay asistencias registradas para esta fecha.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Miembro</th>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Duracion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.miembros?.nombre}</td>
                <td>{a.miembros?.documento}</td>
                <td>{a.fecha}</td>
                <td>{a.hora_entrada}</td>
                <td>{a.hora_salida || '---'}</td>
                <td>
                  {a.hora_salida
                    ? calcularDuracion(a.hora_entrada, a.hora_salida)
                    : 'En curso'}
                </td>
                <td>
                  <Link to={`/miembros/${a.miembros?.id}`} className="btn btn-small">Ver Miembro</Link>
                  <button onClick={() => handleDelete(a.id)} className="btn btn-small btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="stats">
        <p><strong>Total asistencias:</strong> {asistencias.length}</p>
      </div>
    </div>
  )
}

function calcularDuracion(entrada, salida) {
  if (!entrada || !salida) return '---'
  const [hE, mE, sE] = entrada.split(':').map(Number)
  const [hS, mS, sS] = salida.split(':').map(Number)
  const diff = (hS * 3600 + mS * 60 + sS) - (hE * 3600 + mE * 60 + sE)
  const horas = Math.floor(diff / 3600)
  const minutos = Math.floor((diff % 3600) / 60)
  return `${horas}h ${minutos}m`
}
