'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { navigateTo } from '../../lib/navigation';

export default function DebugPage() {
    const [status, setStatus] = useState<any>({});
    const [logs, setLogs] = useState<string[]>([]);

    const log = (msg: string) => setLogs(prev => [...prev, msg + ' (' + new Date().toISOString().split('T')[1] + ')']);

    useEffect(() => {
        const runDebug = async () => {
            log('Starting Debug...');

            // 1. Check Session
            const { data: { session } } = await supabase.auth.getSession();
            log(`Session: ${session ? 'Active' : 'None'}`);

            if (!session?.user) {
                setStatus({ error: 'Not Logged In' });
                return;
            }

            const userId = session.user.id;
            const userEmail = session.user.email;
            log(`User: ${userEmail} (${userId})`);

            // 2. Direct Query to user_roles
            log('Querying user_roles table...');
            const { data: roles, error: roleError } = await supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', userId);

            if (roleError) {
                log(`ERROR Querying Roles: ${roleError.message}`);
            } else {
                log(`Roles Found: ${roles?.length || 0}`);
                if (roles && roles.length > 0) {
                    log(`Role Data: ${JSON.stringify(roles)}`);
                }
            }

            // 3. Check Policy / Table Existence
            // Try to insert a dummy record to see if table exists? No, too risky.
            // Just displaying the result is enough.

            setStatus({
                user: session.user,
                roles: roles,
                roleError: roleError
            });
        };

        runDebug();
    }, []);

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>

            <div className="bg-gray-100 p-4 rounded mb-4">
                <h2 className="font-bold">Logs:</h2>
                {logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>

            <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
                {JSON.stringify(status, null, 2)}
            </pre>

            <div className="mt-4">
                <button onClick={() => navigateTo('/apiary-selection')} className="text-blue-600 underline bg-transparent border-none cursor-pointer p-0">Back to App</button>
            </div>
        </div>
    );
}
