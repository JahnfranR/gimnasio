import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MiembrosList from './components/MiembrosList'
import MiembrosForm from './components/MiembrosForm'
import MiembrosDetail from './components/MiembrosDetail'
import AsistenciaList from './components/AsistenciaList'
import AsistenciaForm from './components/AsistenciaForm'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-brand">Control de Asistencia - Gimnasio</Link>
          <div className="nav-links">
            <Link to="/">Miembros</Link>
            <Link to="/asistencias">Asistencias</Link>
          </div>
        </nav>
        <main className="container">
          <Routes>
            <Route path="/" element={<MiembrosList />} />
            <Route path="/miembros/nuevo" element={<MiembrosForm />} />
            <Route path="/miembros/:id" element={<MiembrosDetail />} />
            <Route path="/miembros/:id/editar" element={<MiembrosForm />} />
            <Route path="/asistencias" element={<AsistenciaList />} />
            <Route path="/asistencias/nueva" element={<AsistenciaForm />} />
            <Route path="/asistencias/:miembroId/nueva" element={<AsistenciaForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
