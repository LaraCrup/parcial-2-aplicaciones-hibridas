Nombre y Apellido: Lara Crupnicoff
Nombre de la materia: Aplicaciones Híbridas
Nombre del docente: Jonathan Emanuel Cruz
Comisión: DWT4AV

---

# Recetario Argentino

Este proyecto es una aplicación web para la gestión y consulta de recetas típicas argentinas. Permite a los usuarios explorar recetas, filtrar por distintos criterios, y a los administradores gestionar usuarios, ingredientes y recetas (ABM).

## Tecnologías utilizadas
- **Frontend:** ReactJS (Vite)
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB

## Estructura del proyecto
- `/frontend`: Contiene el código del cliente (React)
- `/backend`: Contiene el servidor Express y la API

## Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd parcial-2
```

### 2. Configurar el backend

1. Ir a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Agregar el archivo `.env` (enviado por separado) en la carpeta del backend.

4. Iniciar el backend:
   ```bash
   npm run dev
   ```
   El backend estará disponible en `http://localhost:3000`.

### 3. Configurar el frontend

1. Ir a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el frontend:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Funcionalidades principales
- Visualización y filtrado de recetas por nombre, tipo, dificultad y tiempo de cocción.
- ABM de usuarios, recetas e ingredientes (requiere login).
- Registro e inicio de sesión de usuarios.
- Visualización de detalles de cada receta.

## Notas
- El login es requerido para acceder a las rutas de administración.

---