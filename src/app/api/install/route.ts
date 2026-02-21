import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(request: Request) {
    const body = await request.json();
    const { environment, sshConfig, aiKey, aiProvider, aiModel, telegramToken } = body;
    const installType = 'docker'; // Force docker as requested

    if (!sshConfig || !sshConfig.host || !sshConfig.username) {
        return NextResponse.json({ success: false, message: 'Missing SSH configuration' }, { status: 400 });
    }

    const encoder = new TextEncoder();

    // Helper to strip ANSI escape codes
    const stripAnsi = (str: string) => {
        return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    };

    const stream = new ReadableStream({
        async start(controller) {
            const ssh = new NodeSSH();
            const sendLog = (progress: number, log: string) => {
                const sanitizedLog = stripAnsi(log);
                if (!sanitizedLog.trim() && log.trim()) return; // Skip if it's purely escape codes
                const data = JSON.stringify({ progress, log: sanitizedLog }) + '\n';
                controller.enqueue(encoder.encode(data));
            };

            try {
                const connConfig: any = {
                    host: sshConfig.host,
                    port: parseInt(sshConfig.port, 10) || 22,
                    username: sshConfig.username,
                };

                if (sshConfig.authType === 'password') {
                    connConfig.password = sshConfig.password;
                } else {
                    connConfig.privateKey = sshConfig.privateKey;
                }

                sendLog(5, 'Connecting to remote server...');
                await ssh.connect(connConfig);
                sendLog(10, 'Connection established. Preparing for installation...');

                // Phase 14: Handle APT locks before starting
                sendLog(12, 'Checking for system package locks (APT)...');
                const checkLockCmd = 'sudo fuser /var/lib/dpkg/lock-frontend /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock 2>/dev/null || echo "clear"';

                for (let i = 0; i < 5; i++) {
                    const lockStatus = await ssh.execCommand(checkLockCmd);
                    if (lockStatus.stdout.includes('clear')) break;
                    sendLog(12, `System is busy (APT lock detected). Waiting... (${i + 1}/5)`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }

                if (installType === 'docker') {
                    // --- DOCKER INSTALLATION PATH ---
                    sendLog(15, 'Starting Docker-based installation...');

                    // 1. Check/Install Docker
                    sendLog(20, 'Checking if Docker is installed...');
                    const dockerCheck = await ssh.execCommand('docker --version');
                    if (dockerCheck.code !== 0) {
                        sendLog(25, 'Docker not found. Attempting robust Docker installation...');

                        // Robust Docker installation script for Ubuntu/Debian, fallback for others
                        const installDockerScript = `
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    DISTRO=$VERSION_CODENAME
fi

if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ] || [ "$OS" = "raspbian" ]; then
    echo "Detected $OS ($DISTRO). Installing via APT..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release
    mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS $DISTRO stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    # Note: Explicitly avoid docker-model-plugin which is known to fail on some versions
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "Detected $OS. Using convenience script..."
    curl -fsSL https://get.docker.com | sh
fi
`.trim();

                        const sudoInstallDocker = sshConfig.password
                            ? `echo "${sshConfig.password.replace(/"/g, '\\"')}" | sudo -S bash -c "${installDockerScript.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`
                            : `sudo bash -c "${installDockerScript.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;

                        await ssh.exec(sudoInstallDocker, [], {
                            onStdout: (chunk) => sendLog(25, `[Docker Install] ${chunk.toString().trim()}`),
                            onStderr: (chunk) => {
                                const msg = chunk.toString().trim();
                                if (msg && !msg.toLowerCase().includes('password for')) {
                                    sendLog(25, `[ERROR] ${msg}`);
                                } else if (msg) {
                                    sendLog(25, `[SUDO] ${msg}`);
                                }
                            },
                        });

                        // Verify docker installation
                        const dockerVerify = await ssh.execCommand('docker --version');
                        if (dockerVerify.code !== 0) {
                            throw new Error('Docker installation failed. Please check the logs.');
                        }
                    }

                    // 2. Prepare directories
                    sendLog(40, 'Preparing persistent directories with correct permissions...');
                    // Create directories and ensure they are writable by the container's user (usually UID 1000)
                    const prepareDirsCmd = `
mkdir -p ~/.openclaw/workspace
# Pre-configure gateway.bind to 'lan' in openclaw.json if it doesn't exist
if [ ! -f ~/.openclaw/openclaw.json ]; then
  echo '{"gateway": {"bind": "lan"}}' > ~/.openclaw/openclaw.json
fi
sudo chown -R 1000:1000 ~/.openclaw
sudo chmod -R 770 ~/.openclaw
`.trim();
                    const sudoPrepareDirs = sshConfig.password
                        ? `echo "${sshConfig.password.replace(/"/g, '\\"')}" | sudo -S bash -c "${prepareDirsCmd.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`
                        : `sudo bash -c "${prepareDirsCmd.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;

                    await ssh.execCommand(sudoPrepareDirs);

                    // 3. Create docker-compose.yml
                    sendLog(50, 'Creating docker-compose.yml...');
                    const envVars = [];
                    if (aiKey) {
                        // Try to guess provider
                        let provider = 'openai';
                        if (aiKey.startsWith('sk-ant-')) provider = 'anthropic';
                        else if (aiKey.startsWith('sk-or-')) provider = 'openrouter';

                        envVars.push(`      - OPENAI_API_KEY=${aiKey}`);
                        envVars.push(`      - ANTHROPIC_API_KEY=${aiKey}`);
                    }
                    if (telegramToken) {
                        envVars.push(`      - TELEGRAM_TOKEN=${telegramToken}`);
                    }

                    const dockerComposeContent = `
services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:main
    container_name: openclaw-gateway
    restart: always
    command: gateway run --bind lan
    ports:
      - "18789:18789"
    volumes:
      - \${HOME}/.openclaw:/home/node/.openclaw
      - \${HOME}/.openclaw/workspace:/home/node/.openclaw/workspace
    environment:
      - NODE_ENV=production
${envVars.join('\n')}
`.trim();
                    // Use a safer way to create the file
                    await ssh.execCommand(`cat <<'EOF' > ~/docker-compose.yml\n${dockerComposeContent}\nEOF`);

                    // 4. Run Docker Compose
                    sendLog(60, 'Starting OpenClaw via Docker Compose...');
                    // We'll use a script to handle sudo and capture actual errors
                    const dockerUpCmd = 'docker compose up -d';
                    const runScript = sshConfig.password
                        ? `echo "${sshConfig.password.replace(/"/g, '\\"')}" | sudo -S ${dockerUpCmd} 2>&1`
                        : `sudo ${dockerUpCmd} 2>&1`;

                    const upResult = await ssh.execCommand(runScript);

                    // Filter out the sudo password prompt from stderr/stdout for clean logging
                    const cleanOutput = upResult.stdout.replace(/\[sudo\] password for .+: /g, '').trim();

                    if (upResult.code !== 0) {
                        throw new Error(`Docker Compose failed (code ${upResult.code}): ${cleanOutput || upResult.stderr}`);
                    }

                    if (cleanOutput) {
                        sendLog(70, `[Docker] ${cleanOutput}`);
                    }

                    // 5. Post-installation configuration (Set API Keys inside container)
                    if (aiKey || telegramToken) {
                        sendLog(95, 'Configuring API keys inside the container...');
                        // Wait a bit for the container to initialize
                        await new Promise(resolve => setTimeout(resolve, 5000));

                        if (aiKey) {
                            const provider = aiProvider || 'openai';
                            const model = aiModel || 'gpt-4o';
                            await ssh.execCommand(`docker exec openclaw-gateway openclaw providers add --provider ${provider} --token ${aiKey} --model ${model}`).catch(() => {
                                // Fallback if 'openclaw' command is not in path
                                return ssh.execCommand(`docker exec openclaw-gateway node dist/entry.js providers add --provider ${provider} --token ${aiKey} --model ${model}`);
                            });
                        }

                        if (telegramToken) {
                            await ssh.execCommand(`docker exec openclaw-gateway openclaw providers add --provider telegram --token ${telegramToken}`).catch(() => {
                                // Fallback
                                return ssh.execCommand(`docker exec openclaw-gateway node dist/entry.js providers add --provider telegram --token ${telegramToken}`);
                            });
                        }
                    }

                    // Fix: Set gateway.bind to 'lan' to allow external access (0.0.0.0)
                    sendLog(96, 'Configuring gateway to allow external access (binding to 0.0.0.0)...');
                    await ssh.execCommand(`docker exec openclaw-gateway openclaw config set gateway.bind lan`).catch(() => {
                        return ssh.execCommand(`docker exec openclaw-gateway node dist/entry.js config set gateway.bind lan`);
                    });

                    // Restart container to apply all changes (bind address and keys)
                    sendLog(97, 'Restarting OpenClaw to apply configuration changes...');
                    await ssh.execCommand('docker restart openclaw-gateway');

                    sendLog(98, 'Configuration changes applied and container restarted.');
                    sendLog(100, `[SUCCESS] Docker installation completed. Access the UI at http://${sshConfig.host}:18789`);

                } else {
                    throw new Error('Native installation is currently disabled. Please use Docker.');
                }
            } catch (error: any) {
                sendLog(100, `[ERROR] ${error.message || 'Installation failed.'}`);
            } finally {
                await ssh.dispose();
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
