# t3_act8_eq10 — EduControl

Mini sistema en React (Vite) que simula un login real con la API de DummyJSON y muestra una tabla de alumnos con filtros, paginación reflejada en la URL y acciones CRUD.

## Integrantes (Equipo 10)

- Martínez Pacheco Cristian
- Mendoza Lucero Hasiel Isai

## APIs utilizadas

- **Login:** DummyJSON Auth — `POST https://dummyjson.com/auth/login`
- **Tabla de datos:** DummyJSON Users — `https://dummyjson.com/users`, presentados como la lista de alumnos del sistema.
  - Listado: `GET /users?limit=0`
  - Agregar: `POST /users/add`
  - Editar: `PUT /users/{id}`
  - Eliminar: `DELETE /users/{id}`

DummyJSON simula las escrituras, así que cada acción primero hace la petición real a la API y después refleja el cambio en el estado local (`useState`).

Usuario de prueba: `emilys` / `emilyspass` (también se puede entrar con el correo del usuario).

## Proyecto desplegado

http://68.155.155.10/t3_act8_eq10/

## Funcionalidades

- Login con validación de campos vacíos y mensaje de error con credenciales incorrectas.
- Vista del sistema protegida: sin sesión solo se muestra el login.
- Sidebar con Inicio, Alumnos, Materias y Reportes; navbar con foto, nombre de usuario y botón de cerrar sesión.
- Tabla con búsqueda por nombre, filtro por género, paginación y selector de 10, 20, 40 o 50 registros.
- Vista, página, límite y filtros en la URL (`?view=alumnos&page=2&limit=20`), compatibles con el botón de regresar del navegador.
- Indicador de carga y mensaje de error con botón de reintentar.
- Agregar, editar (con confirmación) y eliminar (con confirmación).

## Estructura

```
src/
├── api/            # httpClient, authService, studentsService
├── components/
│   ├── Layout/     # Sidebar, Navbar
│   ├── Login/
│   ├── Modal/      # Modal, ConfirmDialog
│   ├── Students/   # StudentForm
│   └── Table/      # DataTable, TableFilters, Pagination
├── constants/
├── hooks/          # useStudents, useUrlParams
└── pages/          # Dashboard, HomePage, StudentsPage, PlaceholderPage
```

## Ejecutar en local

```bash
npm install
npm run dev
```

## Despliegue en el VPS

```bash
npm run build
scp -r dist/* azureuser@68.155.155.10:/var/www/html/t3_act8_eq10/
```

El `base` de `vite.config.js` ya está configurado como `/t3_act8_eq10/`.
