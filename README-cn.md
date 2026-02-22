# MyClaw 🤖

MyClaw 是一个基于 Web 的安装和管理程序，旨在帮助您在远程服务器上轻松设置和管理 **OpenClaw**。 它通过 SSH 连接到您的服务器，自动配置并部署基于 Docker 的 OpenClaw 网关。

[English](./README.md) | [한국어](./README-ko.md) | [日本語](./README-jp.md) | [Español](./README-es.md)

## ✨ 主要功能

- **远程 SSH 安装**: 无需复杂的终端命令，只需在 Web UI 中输入服务器详情即可轻松安装。
- **基于 Docker 的部署**: 自动配置 Docker 和 Docker Compose，以确保一致的运行环境。
- **自动配置优化**: 自动生成 `openclaw.json` 并应用最佳设置，以防止 Telegram 频道架构错误。
- **集成安全认证**: 支持自动生成 `gatewayToken` 和身份验证流，以便访问控制面板。
- **实时日志监控**: 实时监控安装过程，并在出现问题时分析日志。

## 🚀 入门指南

### 准备工作
- 本地环境: [Bun](https://bun.sh) 或 Node.js (v18 或更高版本)
- 远程服务器: 具有 SSH 访问权限的 Linux 服务器（推荐使用 Ubuntu）和 Sudo 权限

### 安装与运行

1. **克隆仓库**
   ```bash
   git clone https://github.com/dirmich/myclaw.git
   cd myclaw
   ```

2. **安装依赖项**
   ```bash
   bun install
   # 或 npm install
   ```

3. **运行开发服务器**
   ```bash
   bun dev
   ```

4. **访问**
   在浏览器中打开 `http://localhost:3000`。

## 🛠 使用方法

1. **输入服务器信息**: 输入远程服务器的 IP、端口、用户名和密码（或 SSH 密钥）。
2. **AI 设置**: 输入您要使用的 AI 模型（OpenAI、Anthropic 等）的 API 密钥。
3. **Telegram 设置（可选）**: 输入您的 Telegram Bot Token 将自动进行配置，以便立即进行通信。
4. **开始安装**: 点击“安装”按钮，自动在远程服务器上进行 Docker 安装和 OpenClaw 运行。
5. **访问控制面板**: 安装完成后，使用提供的链接直接进入 OpenClaw 控制屏幕。

## ☁️ 部署指南 (关于 GitHub Pages 的信息)

> [!WARNING]
> **MyClaw 无法直接在 GitHub Pages 上运行。**
> 
> GitHub Pages 只能托管 **静态（Static）** 文件。 MyClaw 需要 **Node.js 后端（API Routes）** 来进行 SSH 连接和远程控制。 因此，我们建议通过以下平台进行部署：
> - **Vercel**: 部署 Next.js 项目最简单的方法。
> - **私有 VPS**: 您可以使用 Docker 等在您自己的服务器上直接进行托管。

## 📄 许可证
本项目采用 MIT 许可证。
