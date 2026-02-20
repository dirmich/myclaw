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
        const addLog = (progress: number, log: string) => {
            console.log(`[INSTALL LOG] ${log}`);
            logs.push({ progress, log });
        };

        addLog(10, 'Connection established. Starting real installation...');

        // 1. Run the installation script with sudo support
        // We use sudo -S to pass the password to the prompt if needed.
        const installCmd = 'curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard';

        let finalCmd = installCmd;
        let execOptions: any = {};

        if (sshConfig.authType === 'password') {
            // Use sudo -E to preserve environment, -S to read password from stdin
            // Actually, the install.sh itself calls sudo internally.
            // To handle that, we can try to run the WHOLE script with sudo if the user isn't root.
            finalCmd = `echo "${sshConfig.password}" | sudo -S bash -c "${installCmd.replace(/"/g, '\\"')}"`;
        } else {
            // For key-based, we hope sudo is passwordless or already root
            finalCmd = `bash -c "${installCmd.replace(/"/g, '\\"')}"`;
        }

        addLog(20, 'Executing OpenClaw installation script...');
        const installResult = await ssh.execCommand(finalCmd);

        if (installResult.stdout) {
            installResult.stdout.split('\n').filter(l => l.trim()).forEach(l => addLog(50, `[STDOUT] ${l}`));
        }
        if (installResult.stderr) {
            installResult.stderr.split('\n').filter(l => l.trim()).forEach(l => addLog(50, `[STDERR] ${l}`));
        }

        if (installResult.code !== 0) {
            throw new Error(`Installation failed with exit code ${installResult.code}`);
        }

        // 2. Verify Installation
        addLog(60, 'Verifying installation...');
        const verifyResult = await ssh.execCommand('ls -l $HOME/.local/bin/openclaw');
        if (verifyResult.code !== 0) {
            throw new Error('Verification failed: openclaw binary not found in ~/.local/bin/');
        }
        addLog(65, 'Verification successful: openclaw binary found.');

        // 3. Configure Providers
        const openclawBin = '$HOME/.local/bin/openclaw';

        if (telegramToken) {
            addLog(70, 'Configuring Telegram provider...');
            const tgResult = await ssh.execCommand(`"${openclawBin}" providers add --provider telegram --token "${telegramToken}"`);
            if (tgResult.stdout) addLog(75, tgResult.stdout);
            if (tgResult.stderr) addLog(75, `[STDERR] ${tgResult.stderr}`);
        }

        if (aiKey) {
            addLog(85, 'Configuring AI provider (OpenAI)...');
            const aiResult = await ssh.execCommand(`"${openclawBin}" providers add --provider openai --token "${aiKey}"`);
            if (aiResult.stdout) addLog(90, aiResult.stdout);
            if (aiResult.stderr) addLog(90, `[STDERR] ${aiResult.stderr}`);
        }

        // 4. Finalize
        addLog(100, 'Installation and configuration completed successfully!');

        await ssh.dispose();
        return NextResponse.json({ success: true, stages: logs });
    } catch (error: any) {
        console.error('Installation Error:', error);
        if (ssh) await ssh.dispose();
        const errorLogs = [
            { progress: 100, log: `[ERROR] ${error.message || 'Installation failed.'}` }
        ];
        return NextResponse.json({
            success: false,
            message: error.message || 'Installation failed.',
            stages: errorLogs
        }, { status: 500 });
    }
}
