# Control de Asistencia - Gimnasio

Sistema de control de asistencia para gimnasio desarrollado con React y Supabase.

## Caracteristicas

- Gestion de miembros (crear, consultar, actualizar, eliminar)
- Visualizacion de planes disponibles
- Registro de asistencias con hora de entrada y salida
- Interfaz responsiva y facil de usar

## Tecnologias

- **Frontend:** React 19 + Vite
- **Base de datos:** Supabase (PostgreSQL)
- **Routing:** React Router DOM
- **Estilos:** CSS personalizado

## Requisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta en Supabase

## Instalacion

1. Clonar el repositorio:
```bash
git clone https://github.com/JahnfranR/gimnasio.git
cd gimnasio
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear archivo `.env` en la raiz del proyecto
   - Agregar las siguientes variables:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. Ejecutar el proyecto:
```bash
npm run dev
```

## Base de Datos

El proyecto utiliza 3 tablas principales:

- **miembros:** Informacion de los miembros del gimnasio
- **planes:** Planes de membresia disponibles
- **asistencias:** Registro de entradas y salidas

Para crear las tablas, ejecuta el script SQL ubicado en `src/sql/queries.sql` en el SQL Editor de Supabase.

## Estructura del Proyecto

```
gimnasio/
├── public/
├── src/
│   ├── components/
│   │   ├── MiembrosList.jsx
│   │   ├── MiembrosForm.jsx
│   │   └── MiembrosDetail.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── sql/
│   │   └── queries.sql
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

## Autor

JahnfranR
