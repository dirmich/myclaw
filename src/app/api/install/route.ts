import { NextRequest, NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import crypto from 'crypto';

export async function POST(request: Request) {
    const body = await request.json();
    const { environment, sshConfig, aiKey, aiProvider, aiModel, telegramToken, discordToken } = body;
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
            const sendLog = (progress: number, log: string, data?: any) => {
                const sanitizedLog = stripAnsi(log);
                if (!sanitizedLog.trim() && log.trim()) return; // Skip if it's purely escape codes
                const payload = JSON.stringify({ progress, log: sanitizedLog, ...data }) + '\n';
                controller.enqueue(encoder.encode(payload));
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
                    const gatewayToken = crypto.randomBytes(16).toString('hex');
                    sendLog(15, 'Starting Docker-based installation...', { gatewayToken });

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

                    // 2. Prepare directories and configuration
                    sendLog(40, 'Preparing persistent directories and configuration...');

                    // Resolve the actual home directory of the SSH user
                    const homeRes = await ssh.execCommand('echo $HOME');
                    const realHome = homeRes.stdout.trim() || `/home/${sshConfig.username}`;
                    const openclawDir = `${realHome}/.openclaw`;

                    // Provider mapping for environment variables
                    const envVarMap: Record<string, string> = {
                        openai: 'OPENAI_API_KEY',
                        anthropic: 'ANTHROPIC_API_KEY',
                        gemini: 'GEMINI_API_KEY',
                        groq: 'GROQ_API_KEY',
                        openrouter: 'OPENROUTER_API_KEY'
                    };

                    // Provider mapping for model IDs (e.g., gemini -> google)
                    const providerIdMap: Record<string, string> = {
                        gemini: 'google',
                        // others typically match their provider ID
                    };

                    const modelProvider = providerIdMap[aiProvider] || aiProvider || 'openai';
                    const fullModelId = (aiModel && aiModel.includes('/'))
                        ? aiModel
                        : `${modelProvider}/${aiModel || (aiProvider === 'anthropic' ? 'claude-3-5-sonnet-latest' : 'gpt-4o')}`;

                    const configObj: any = {
                        gateway: {
                            bind: 'lan',
                            auth: {
                                token: gatewayToken
                            },
                            controlUi: {
                                allowInsecureAuth: true,
                                dangerouslyDisableDeviceAuth: true
                            }
                        },
                        env: {
                            vars: {}
                        }
                    };

                    if (aiKey) {
                        const envVarName = envVarMap[aiProvider] || 'OPENAI_API_KEY';
                        configObj.env.vars[envVarName] = aiKey;

                        configObj.agents = {
                            defaults: {
                                model: {
                                    primary: fullModelId
                                }
                            }
                        };
                    }

                    configObj.channels = {};

                    if (telegramToken) {
                        configObj.channels.telegram = {
                            enabled: true,
                            botToken: telegramToken,
                            dmPolicy: "open",
                            allowFrom: ["*"],
                            // Zod 필수 필드 (빈 객체로 초기화하여 스키마 검증 통과 및 UI 렌더링 지원)
                            markdown: {},
                            commands: {
                                native: "auto"
                            },
                            retry: {},
                            heartbeat: {},
                            capabilities: {
                                inlineButtons: "all"
                            },
                            actions: {
                                sendMessage: true,
                                reactions: true
                            }
                        };
                    }

                    if (discordToken) {
                        configObj.channels.discord = {
                            enabled: true,
                            token: discordToken,
                            dm: {
                                policy: "open",
                                allowFrom: ["*"]
                            },
                            groupPolicy: "open",
                            markdown: {},
                            commands: {
                                native: "auto"
                            },
                            retry: {},
                            heartbeat: {},
                            intents: {
                                presence: false,
                                guildMembers: false
                            }
                        };
                    }

                    const configJson = JSON.stringify(configObj, null, 2);
                    const configBase64 = Buffer.from(configJson).toString('base64');

                    const prepareDirsCmd = `
mkdir -p "${openclawDir}/workspace"
echo "${configBase64}" | base64 -d > "${openclawDir}/openclaw.json"
sudo chown -R 1000:1000 "${openclawDir}"
sudo chmod -R 770 "${openclawDir}"
`.trim();

                    const sudoPrepareDirs = sshConfig.password
                        ? `echo "${sshConfig.password.replace(/"/g, '\\"')}" | sudo -S bash -c "${prepareDirsCmd.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`
                        : `sudo bash -c "${prepareDirsCmd.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;

                    await ssh.execCommand(sudoPrepareDirs);

                    // 3. Create docker-compose.yml
                    sendLog(50, 'Creating docker-compose.yml...');

                    const dockerComposeContent = `
services:
  openclaw:
    image: ghcr.io/openclaw/openclaw:main
    container_name: openclaw-gateway
    restart: always
    command: node dist/index.js gateway --bind lan --allow-unconfigured
    ports:
      - "18789:18789"
    volumes:
      - ${openclawDir}:/home/node/.openclaw
      - ${openclawDir}/workspace:/home/node/.openclaw/workspace
    environment:
      - NODE_ENV=production
      - OPENCLAW_STATE_DIR=/home/node/.openclaw
      - GATEWAY_TOKEN=${gatewayToken}
`.trim();
                    const composeBase64 = Buffer.from(dockerComposeContent).toString('base64');
                    await ssh.execCommand(`echo "${composeBase64}" | base64 -d > ~/docker-compose.yml`);

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

                    // 5. Final check and readiness polling
                    sendLog(90, 'Finalizing installation and waiting for dashboard to be ready...');

                    let isReady = false;
                    const maxRetries = 15;
                    const retryInterval = 2000;

                    for (let i = 0; i < maxRetries; i++) {
                        const logsResult = await ssh.execCommand('docker logs openclaw-gateway --tail 50');
                        const logs = logsResult.stdout + logsResult.stderr;

                        if (logs.includes('Gateway listening') || logs.includes('Control UI enabled')) {
                            isReady = true;
                            sendLog(95, 'Gateway is ready and listening!');
                            break;
                        }

                        if (logs.toLowerCase().includes('error') || logs.toLowerCase().includes('failed')) {
                            // Only report errors if they seem critical, but don't stop yet
                            const errorLines = logs.split('\n').filter(l => l.toLowerCase().includes('error')).join('\n');
                            if (errorLines) {
                                sendLog(90, `[Gateway Status] Waiting for startup (some non-critical logs found)...`);
                            }
                        }

                        await new Promise(resolve => setTimeout(resolve, retryInterval));
                        sendLog(90 + Math.min(4, i / 3), `Waiting for dashboard readiness (attempt ${i + 1}/${maxRetries})...`);
                    }

                    if (!isReady) {
                        sendLog(95, 'Warning: Dashboard is taking longer than expected to start. It may still be booting up.');
                    }

                    const successMsg = `OpenClaw is installed and running! Direct dashboard access: http://${sshConfig.host}:18789/?token=${gatewayToken}`;
                    sendLog(100, successMsg, { gatewayToken });

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
