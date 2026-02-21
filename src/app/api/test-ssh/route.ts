import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(request: Request) {
    const ssh = new NodeSSH();
    try {
        const body = await request.json();
        const { host, port, username, authType, password, privateKey } = body;

        if (!host || !port || !username) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const sshConfig: any = {
            host,
            port: parseInt(port, 10),
            username,
        };

        if (authType === 'password') {
            sshConfig.password = password;
        } else {
            sshConfig.privateKey = privateKey;
        }

        await ssh.connect(sshConfig);

        // Check for sudo privileges
        const privilegeCheck = await ssh.execCommand('whoami && sudo -n true 2>/dev/null && echo "SUDO_OK" || echo "SUDO_NO"');
        const output = privilegeCheck.stdout.trim().split('\n');
        const whoami = output[0];
        const sudoStatus = output[output.length - 1]; // Use last line in case of motd noise

        const isRoot = whoami === 'root';
        const canSudoWithoutPassword = sudoStatus === 'SUDO_OK';

        await ssh.dispose();

        return NextResponse.json({
            success: true,
            message: 'SSH Connection successful!',
            isRoot,
            canSudoWithoutPassword
        });
    } catch (error: any) {
        console.error('SSH Connection Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'SSH Connection failed. Please check your credentials and network.'
        }, { status: 500 });
    }
}
