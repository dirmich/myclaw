'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInstallStore } from '@/store/useInstallStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const sshSchema = z.object({
    host: z.string().min(1, 'Host is required'),
    port: z.number().min(1).max(65535, 'Invalid port'),
    username: z.string().min(1, 'Username is required'),
    authType: z.enum(['password', 'key']),
    password: z.string().optional(),
    privateKey: z.string().optional(),
}).refine((data) => {
    if (data.authType === 'password' && !data.password) {
        return false;
    }
    if (data.authType === 'key' && !data.privateKey) {
        return false;
    }
    return true;
}, {
    message: "Authentication credential is required",
    path: ["password"], // Path where the error will be attached
});

export default function SSHConnectionStep() {
    const { currentStep, setStep, setSSHConfig, sshConfig: defaultValues } = useInstallStore();
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const form = useForm<z.infer<typeof sshSchema>>({
        resolver: zodResolver(sshSchema),
        defaultValues: {
            host: defaultValues.host,
            port: defaultValues.port,
            username: defaultValues.username,
            authType: defaultValues.authType,
            password: defaultValues.password || '',
            privateKey: defaultValues.privateKey || '',
        },
    });

    const authType = form.watch('authType');

    async function onSubmit(values: z.infer<typeof sshSchema>) {
        setIsTesting(true);
        setTestResult(null);

        try {
            const res = await fetch('/api/test-ssh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            setTestResult(data);

            if (data.success) {
                setSSHConfig(values);
                setTimeout(() => {
                    setStep(3);
                }, 1500);
            }
        } catch (err) {
            setTestResult({ success: false, message: 'Network error occurred during test.' });
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <Card className="w-full mt-6 shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>SSH Connection Settings</CardTitle>
                <CardDescription>
                    Enter the SSH details to connect to your target environment.
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="host"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Host / IP Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="192.168.1.100 or example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="port"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Port</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="root, ubuntu, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Authentication Method</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="password" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    Password
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="key" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    SSH Private Key
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {authType === 'password' ? (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter SSH password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="privateKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Private Key</FormLabel>
                                        <FormControl>
                                            <textarea
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            We do not store your private key. It is only used for the installation session.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {testResult && (
                            <Alert variant={testResult.success ? 'default' : 'destructive'} className={testResult.success ? 'border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30' : ''}>
                                <AlertTitle>{testResult.success ? 'Success' : 'Connection Failed'}</AlertTitle>
                                <AlertDescription>
                                    {testResult.message}
                                </AlertDescription>
                            </Alert>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isTesting}>
                            Back
                        </Button>
                        <Button type="submit" disabled={isTesting} className={testResult?.success ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}>
                            {isTesting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Testing Connection...
                                </span>
                            ) : testResult?.success ? (
                                'Proceeding...'
                            ) : (
                                'Test Connection & Continue'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
