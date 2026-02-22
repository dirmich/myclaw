# MyClaw 🤖

MyClaw es un instalador y gestor basado en web diseñado para ayudarte a configurar y gestionar fácilmente **OpenClaw** en servidores remotos. Se conecta a tu servidor a través de SSH para configurar y desplegar automáticamente una puerta de enlace OpenClaw basada en Docker.

[English](./README.md) | [한국어](./README-ko.md) | [日本語](./README-jp.md) | [简体中文](./README-cn.md)

## ✨ Características principales

- **Instalación remota SSH**: Instala fácilmente desde una interfaz web introduciendo los detalles del servidor, sin comandos complejos de terminal.
- **Despliegue basado en Docker**: Configura automáticamente Docker y Docker Compose para asegurar un entorno de ejecución consistente.
- **Optimización de configuración automática**: Genera automáticamente `openclaw.json` y aplica los ajustes óptimos para prevenir errores de esquema del canal de Telegram.
- **Autenticación de seguridad integrada**: Soporta la autogeneración de `gatewayToken` y flujos de autenticación para el acceso al panel de control.
- **Monitoreo de registros en tiempo real**: Monitorea el proceso de instalación en tiempo real y analiza los registros si ocurre algún problema.

## 🚀 Empezando

### Requisitos previos
- Entorno local: [Bun](https://bun.sh) o Node.js (v18 o superior)
- Servidor remoto: Un servidor Linux con acceso SSH (se recomienda Ubuntu) y privilegios de Sudo.

### Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dirmich/myclaw.git
   cd myclaw
   ```

2. **Instalar dependencias**
   ```bash
   bun install
   # o npm install
   ```

3. **Ejecutar el servidor de desarrollo**
   ```bash
   bun dev
   ```

4. **Acceso**
   Abre `http://localhost:3000` en tu navegador.

## 🛠 Cómo usar

1. **Introducir información del servidor**: Ingresa la IP, puerto, nombre de usuario y contraseña (o clave SSH) del servidor remoto.
2. **Ajustes de IA**: Ingresa la clave API para el modelo de IA que deseas usar (OpenAI, Anthropic, etc.).
3. **Ajustes de Telegram (Opcional)**: Introducir tu Token de Bot de Telegram lo configurará automáticamente para una comunicación inmediata.
4. **Iniciar instalación**: Haz clic en el botón 'Instalar' para proceder automáticamente con la instalación de Docker y la ejecución de OpenClaw en el servidor remoto.
5. **Acceder al panel de control**: Una vez completada la instalación, usa el enlace proporcionado para ir directamente a la pantalla de control de OpenClaw.

## ☁️ Guía de despliegue (Información sobre GitHub Pages)

> [!WARNING]
> **MyClaw no puede ejecutarse directamente en GitHub Pages.**
> 
> GitHub Pages solo puede alojar archivos **estáticos**. MyClaw requiere un **backend de Node.js (API Routes)** para la conexión SSH y el control remoto. Por lo tanto, recomendamos el despliegue a través de plataformas como:
> - **Vercel**: La forma más fácil de desplegar un proyecto Next.js.
> - **VPS Privado**: Puedes alojarlo directamente en tu propio servidor usando Docker, etc.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
