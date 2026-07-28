import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MiembrosList() {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMiembros()
  }, [])

  async function fetchMiembros() {
    setLoading(true)
    const { data, error } = await supabase
      .from('miembros')
      .select('*')
      .order('id', { ascending: true })
    if (data) setMiembros(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return
    const { error } = await supabase.from('miembros').delete().eq('id', id)
    if (!error) fetchMiembros()
  }

  if (loading) return <p>Cargando miembros...</p>

  return (
    <div>
      <div className="header">
        <h2>Miembros del Gimnasio</h2>
        <Link to="/miembros/nuevo" className="btn btn-primary">+ Nuevo Miembro</Link>
      </div>
      {miembros.length === 0 ? (
        <p>No hay miembros registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {miembros.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.email}</td>
                <td>{m.telefono}</td>
                <td>{m.documento}</td>
                <td><span className={`badge badge-${m.estado}`}>{m.estado}</span></td>
                <td>
                  <Link to={`/asistencias/registrar/${m.id}`} className="btn btn-small btn-primary">Registrar Entrada</Link>
                  <Link to={`/miembros/${m.id}`} className="btn btn-small">Ver</Link>
                  <Link to={`/miembros/${m.id}/editar`} className="btn btn-small btn-secondary">Editar</Link>
                  <button onClick={() => handleDelete(m.id)} className="btn btn-small btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
