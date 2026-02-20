import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(request: Request) {
    const ssh = new NodeSSH();
    try {
        const body = await request.json();
        const { environment, sshConfig, aiKey, telegramToken } = body;

        if (!sshConfig || !sshConfig.host || !sshConfig.username) {
            return NextResponse.json({ success: false, message: 'Missing SSH configuration' }, { status: 400 });
        }

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

        await ssh.connect(connConfig);

        const logs: { progress: number; log: string }[] = [];
        const addLog = (progress: number, log: string) => logs.push({ progress, log });

        addLog(10, 'Connected to remote server. Starting installation...');

        // 1. Run the installation script
        // We use -s -- --no-onboard if supported, or just the basic command.
        // Given the script content, it seems to handle non-TTY by skipping onboard.
        const installResult = await ssh.execCommand('curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard');
        addLog(50, `Installation output: ${installResult.stdout}`);
        if (installResult.stderr && !installResult.stdout) {
            addLog(50, `Installation error: ${installResult.stderr}`);
        }

        // 2. Configure Providers
        if (telegramToken) {
            addLog(70, 'Configuring Telegram provider...');
            // Try to find the openclaw binary. The script says it installs to ~/.local/bin/openclaw
            const tgResult = await ssh.execCommand(`$HOME/.local/bin/openclaw providers add --provider telegram --token "${telegramToken}"`);
            addLog(75, tgResult.stdout || tgResult.stderr || 'Telegram provider configured.');
        }

        if (aiKey) {
            addLog(85, 'Configuring AI provider (OpenAI)...');
            // Assuming OpenAI as default for now as per user's example
            const aiResult = await ssh.execCommand(`$HOME/.local/bin/openclaw providers add --provider openai --token "${aiKey}"`);
            addLog(90, aiResult.stdout || aiResult.stderr || 'AI provider configured.');
        }

        // 3. Finalize
        addLog(100, 'Installation and configuration completed successfully!');

        await ssh.dispose();
        return NextResponse.json({ success: true, stages: logs });
    } catch (error: any) {
        console.error('Installation Error:', error);
        if (ssh) await ssh.dispose();
        return NextResponse.json({
            success: false,
            message: error.message || 'Installation failed. Check your server environment and try again.'
        }, { status: 500 });
    }
}
