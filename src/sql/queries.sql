-- ============================================
-- SCRIPT SQL - Control de Asistencia Gimnasio
-- ============================================

-- 1. CREAR TABLA MIEMBROS
CREATE TABLE IF NOT EXISTS miembros (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  documento VARCHAR(20) UNIQUE NOT NULL,
  fecha_registro DATE DEFAULT CURRENT_DATE,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR TABLA PLANES
CREATE TABLE IF NOT EXISTS planes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  duracion_dias INT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR TABLA ASISTENCIAS
CREATE TABLE IF NOT EXISTS asistencias (
  id SERIAL PRIMARY KEY,
  miembro_id INT NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,
  hora_entrada TIME DEFAULT CURRENT_TIME,
  hora_salida TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONSULTAS SQL REQUERIDAS
-- ============================================

-- 4. INSERT - Registrar un miembro
INSERT INTO miembros (nombre, email, telefono, documento)
VALUES ('Carlos Garcia', 'carlos@email.com', '3101234567', '10987654321');

-- 5. INSERT - Registrar un plan
INSERT INTO planes (nombre, precio, duracion_dias, descripcion)
VALUES ('Plan Mensual Basico', 45000.00, 30, 'Acceso ilimitado a maquinas y cardio');

-- 6. SELECT con condicion - Buscar miembros activos
SELECT * FROM miembros WHERE estado = 'activo';

-- 7. SELECT con condicion - Buscar asistencias de hoy con datos del miembro
SELECT a.id, a.fecha, a.hora_entrada, a.hora_salida, m.nombre, m.documento
FROM asistencias a
INNER JOIN miembros m ON a.miembro_id = m.id
WHERE a.fecha = CURRENT_DATE;

-- 8. UPDATE - Cambiar estado de un miembro
UPDATE miembros SET estado = 'suspendido' WHERE id = 1;

-- 9. UPDATE - Registrar hora de salida
UPDATE asistencias SET hora_salida = CURRENT_TIME WHERE id = 1;

-- 10. DELETE - Eliminar una asistencia
DELETE FROM asistencias WHERE id = 1;

-- 11. DELETE - Eliminar un miembro (cascade elimina sus asistencias)
DELETE FROM miembros WHERE id = 1;
