# TaskFlow UI

Este es el proyecto frontend oficial para la [TaskFlow API](https://github.com/JuancaSterba/taskflow-api). Se trata de una aplicación full-stack para la gestión de proyectos y tareas, construida con un enfoque en prácticas de desarrollo modernas, seguridad y una experiencia de usuario clara.

La aplicación permite a los usuarios registrarse, gestionar sus proyectos y tareas, con un sistema de permisos basado en roles de `USER` y `ADMIN`.

## ✨ Características Principales

Esta aplicación implementa un flujo de trabajo completo para la gestión de datos, incluyendo:

#### Gestión de Autenticación y Roles
* **Registro e Inicio de Sesión:** Flujo completo de autenticación de usuarios contra la API.
* **Sistema de Roles:** La UI reacciona a los roles de usuario (`USER` y `ADMIN`), mostrando u ocultando funcionalidades específicas.
* **Protección de Rutas:** Uso de Guardianes de Ruta (`AuthGuard`) para proteger secciones de la aplicación que requieren autenticación.
* **Manejo de Sesión Automático:** Un `HttpInterceptor` se encarga de:
    * Añadir el token JWT a todas las peticiones a endpoints protegidos.
    * Detectar cuando un token ha expirado (errores 401) para cerrar la sesión del usuario automáticamente.

#### Gestión de Proyectos (CRUD Completo)
* **Creación, Lectura y Actualización** de proyectos a través de un formulario reactivo reutilizable.
* **Borrado Lógico (Archivado):** Los usuarios pueden archivar sus proyectos.
* **Borrado Físico (Hard Delete):** Funcionalidad exclusiva para administradores.
* **Lógica de Permisos:** Solo el dueño del proyecto o un `ADMIN` pueden editar, archivar o eliminar un proyecto.

#### Gestión de Tareas (CRUD Completo)
* **Creación de Tareas** dentro de un proyecto.
* **Edición de Tareas en Línea:** Modificación del título y descripción directamente en la lista.
* **Marcar Tareas como Completadas:** Cambio de estado con un solo clic.
* **Eliminación de Tareas.**
* **Lógica de Negocio:** Las tareas completadas no se pueden editar ni eliminar, deshabilitando las acciones en la UI.

#### Experiencia de Usuario (UI/UX)
* **Notificaciones "Toast":** Feedback visual inmediato para el usuario tras realizar acciones (éxito o error), gracias a `ngx-toastr`.
* **Navegación Intuitiva:** Enlaces de "Volver", redirección automática y una ruta raíz inteligente.

## 🚀 Stack Tecnológico y Conceptos Clave

Este proyecto está construido con las siguientes tecnologías y conceptos de Angular:

* **Angular v18:** Utilizando la arquitectura moderna de **Componentes Standalone**.
* **Tailwind CSS:** Para el diseño y los estilos de la interfaz de usuario.
* **TypeScript:** Para un código más robusto y mantenible.
* **Formularios Reactivos de Angular (`ReactiveFormsModule`)**: Para la gestión de formularios complejos y con validaciones.
* **RxJS:** Para la programación asíncrona y el manejo de flujos de datos (Observables, pipe, map, switchMap, catchError).
* **Librerías Externas:**
    * `ngx-toastr` para notificaciones.
    * `jwt-decode` para la gestión de tokens en el cliente.

## 📋 Prerrequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:
* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* [Angular CLI](https://angular.io/cli) (v18 o superior)

## ⚙️ Guía de Instalación y Puesta en Marcha

Sigue estos pasos para tener una copia del proyecto corriendo en tu máquina local.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/JuancaSterba/taskflow-ui.git](https://github.com/JuancaSterba/taskflow-ui.git)
    cd taskflow-ui
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el backend:**
    **Importante:** Esta aplicación es un cliente. Para que funcione correctamente, la [TaskFlow API](https://github.com/JuancaSterba/taskflow-api) debe estar ejecutándose al mismo tiempo.

4.  **Iniciar el servidor de desarrollo de Angular:**
    ```bash
    ng serve -o
    ```
    El comando anterior levantará la aplicación en `http://localhost:4200/` y la abrirá automáticamente en tu navegador.