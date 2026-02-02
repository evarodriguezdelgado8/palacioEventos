# Palacio de Eventos - Gestión Integral de Reservas

**Palacio de Eventos** es una aplicación web *Full Stack* diseñada para la gestión y reserva de espacios exclusivos para eventos (bodas, conferencias, teatros). Este proyecto moderniza la experiencia de usuario ofreciendo una interfaz elegante, rápida y totalmente responsive, respaldada por una arquitectura robusta de servidor y base de datos.

Este desarrollo forma parte de la asignatura **Diseño de Interfaces Web** en el **Campus Cámara de Comercio de Sevilla**.

---

## 🚀 Tecnologías (Tech Stack)

La aplicación ha sido construida utilizando el stack **MEAN/MERN** (con MySQL), priorizando el rendimiento, la escalabilidad y la mantenibilidad del código.

### Frontend (Cliente)
*   **Framework**: [Angular v16.2.16](https://angular.io/) - SPA (Single Page Application).
*   **Estilos**: SCSS (Sass) con arquitectura BEM y diseño Responsive.
*   **Iconografía**: SVG optimizados e integrados vía CSS.
*   **Comunicación**: Servicios HTTP con Observables (RxJS).

### Backend (Servidor)
*   **Entorno**: [Node.js](https://nodejs.org/) (Runtime).
*   **Framework**: [Express.js v4.22](https://expressjs.com/) - API RESTful.
*   **Seguridad**:
    *   `jsonwebtoken` (JWT) para autenticación de sesiones.
    *   `bcryptjs` para el hashing seguro de contraseñas.
    *   `cors` para gestión de orígenes cruzados.

### Base de Datos
*   **Motor**: MySQL.
*   **Driver**: `mysql2` para conexiones asíncronas eficientes.
*   **Diseño**: Relacional (Usuarios, Salas, Reservas) con integridad referencial.

---

## ✨ Características Principales

1.  **Catálogo Interactivo**: Visualización dinámica de salas (Real, Modernista, Escénica, Jardín) con imágenes y detalles de capacidad.
2.  **Motor de Reservas**: Formulario inteligente con validaciones en tiempo real (Reactive Forms) y selector de fechas.
3.  **Gestión de Usuarios**:
    *   Registro y Login seguro.
    *   Panel privado ("Mis Reservas") donde el usuario puede consultar el estado de sus solicitudes.
4.  **Panel de Administración (Backoffice)**: Funcionalidades CRUD para editar o cancelar reservas (según roles).
5.  **Experiencia de Usuario (UX)**:
    *   Notificaciones tipo "Toast" para feedback visual.
    *   Diseño totalmente adaptado a móviles (Mobile First).
    *   Cargas asíncronas con feedback visual (Spinners).

---

## 🛠️ Instalación y Despliegue

Sigue estos pasos para desplegar el proyecto en tu entorno local.

### Prerrequisitos
*   Node.js (v16+ recomendado) y npm.
*   Servidor MySQL (ej. XAMPP, MySQL Workbench) corriendo en el puerto 3306.

### 1. Base de Datos
1.  Abre tu gestor de base de datos (phpMyAdmin o Workbench).
2.  Importa el script `database.sql` ubicado en la raíz del proyecto. Esto creará la BD `palacio_eventos` y las tablas necesarias.

### 2. Backend (API)
```bash
cd backend
npm install        # Instalar dependencias (Express, MySQL, etc.)
npm start          # Iniciar el servidor (por defecto en puerto 3000)
```
*El servidor escuchará en `http://localhost:3000`.*

### 3. Frontend (Angular App)
En una nueva terminal:
```bash
cd frontend
npm install        # Instalar dependencias de Angular
npm start          # Arrancar servidor de desarrollo (ng serve)
```
*Abre tu navegador en `http://localhost:4200` para ver la aplicación.*

---

## 📂 Estuctura del Proyecto

```
palacioEventos/
├── backend/            # Lógica del servidor (Node.js/Express)
│   ├── controllers/    # Lógica de negocio (endpoint handlers)
│   ├── routes/         # Definición de rutas API
│   ├── server.js       # Punto de entrada
│   └── database.sql    # Script de creación de BD
│
├── frontend/           # Aplicación Cliente (Angular)
│   ├── src/app/
│   │   ├── components/ # Vistas (Home, Reservas, Navbar...)
│   │   ├── services/   # Comunicación con Backend
│   │   └── shared/     # Elementos reutilizables
│   └── assets/         # Imágenes y recursos estáticos
│
└── README.md           # Documentación del proyecto
```

---

## 👥 Autores

Proyecto desarrollado con ❤️ por:

*   **Fernando Collantes de Terán Gómez**
*   **Francisco García Partida**
*   **Eva Rodríguez Delgado**

---

> **Nota**: Este proyecto es de carácter académico. Las imágenes y textos tienen fines demostrativos.
