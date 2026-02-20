import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { environment, sshConfig } = body;

        // Simulate different installation stages and logs
        const stages = [
            { progress: 10, log: 'Initializing installation environment...' },
            { progress: 20, log: `Connecting to ${sshConfig.host}:${sshConfig.port}...` },
            { progress: 30, log: 'Connection established. Verifying prerequisites...' },
            { progress: 40, log: 'Updating system packages (apt-get update)...' },
            { progress: 50, log: 'Installing Docker and dependencies...' },
            { progress: 60, log: 'Downloading OpenClaw container images...' },
            { progress: 80, log: 'Configuring OpenClaw services...' },
            { progress: 90, log: 'Starting OpenClaw dashboard...' },
            { progress: 100, log: 'Installation completed successfully!' },
        ];

        // Since this is a simple mock, we just return the full sequence or handle it via polling.
        // To make it interactive for the UI, let's just return the stages and let the client simulate the timing.
        return NextResponse.json({ success: true, stages });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Start installation failed' }, { status: 500 });
    }
}
