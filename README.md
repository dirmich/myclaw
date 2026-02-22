# MyClaw 🤖

MyClaw is a web-based installer and manager designed to help you easily set up and manage **OpenClaw** on remote servers. It connects to your server via SSH to automatically configure and deploy a Docker-based OpenClaw gateway.

[한국어](./README-ko.md) | [日本語](./README-jp.md) | [简体中文](./README-cn.md) | [Español](./README-es.md)

## ✨ Key Features

- **Remote SSH Installation**: Install easily from a web UI by entering server details, without complex terminal commands.
- **Docker-based Deployment**: Automatically configures Docker and Docker Compose to ensure a consistent execution environment.
- **Auto-configuration Optimization**: Automatically generates `openclaw.json` and applies optimal settings to prevent Telegram channel schema errors.
- **Integrated Security Authentication**: Supports `gatewayToken` auto-generation and authentication flows for dashboard access.
- **Real-time Log Monitoring**: Monitor the installation process in real-time and analyze logs if any issues occur.

## 🚀 Getting Started

### Prerequisites
- Local Environment: [Bun](https://bun.sh) or Node.js (v18 or higher)
- Remote Server: A Linux server with SSH access (Ubuntu recommended) and Sudo privileges.

### Installation and Execution

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dirmich/myclaw.git
   cd myclaw
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Run the Development Server**
   ```bash
   bun dev
   ```

4. **Access**
   Open `http://localhost:3000` in your browser.

## 🛠 How to Use

1. **Enter Server Info**: Input the IP, port, username, and password (or SSH key) of the remote server.
2. **AI Settings**: Enter the API key for the AI model you want to use (OpenAI, Anthropic, etc.).
3. **Telegram Settings (Optional)**: Entering your Telegram Bot Token will automatically configure it for immediate communication.
4. **Start Installation**: Click the 'Install' button to automatically proceed with Docker installation and OpenClaw execution on the remote server.
5. **Access Dashboard**: Once installation is complete, use the provided link to go directly to the OpenClaw control screen.

## ☁️ Deployment Guide (GitHub Pages Info)

> [!WARNING]
> **MyClaw cannot be run directly on GitHub Pages.**
> 
> GitHub Pages can only host **static** files. MyClaw requires a **Node.js backend (API Routes)** for SSH connection and remote control. Therefore, we recommend deployment through platforms such as:
> - **Vercel**: The easiest way to deploy a Next.js project.
> - **Private VPS**: You can host it directly on your own server using Docker, etc.

## 📄 License
This project is licensed under the MIT License.
