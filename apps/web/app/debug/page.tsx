'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `${timestamp}: ${msg}`]);
        console.log(msg);
    };

    useEffect(() => {
        addLog('✅ Page loaded');
        addLog(`User Agent: ${navigator.userAgent}`);
        addLog(`localStorage available: ${typeof localStorage !== 'undefined'}`);
        addLog(`URL: ${window.location.href}`);

        // Test localStorage
        try {
            localStorage.setItem('test', 'value');
            const val = localStorage.getItem('test');
            addLog(`✅ localStorage test: ${val === 'value' ? 'WORKS' : 'FAILED'}`);
            localStorage.removeItem('test');
        } catch (e: any) {
            addLog(`❌ localStorage error: ${e.message}`);
        }
    }, []);

    const testLogin = async () => {
        addLog('🔵 Starting login test...');

        try {
            addLog('📡 Calling Supabase signIn...');
            const { error, data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                addLog(`❌ Supabase error: ${error.message}`);
                return;
            }

            addLog(`✅ Login successful!`);
            addLog(`Session: ${data.session ? 'Created' : 'None'}`);
            addLog(`User ID: ${data.user?.id || 'None'}`);

            // Check if session was stored
            addLog('🔍 Checking session storage...');
            const { data: sessionCheck } = await supabase.auth.getSession();
            addLog(`Session in storage: ${sessionCheck.session ? 'YES ✅' : 'NO ❌'}`);

        } catch (err: any) {
            addLog(`💥 CRASH: ${err.message}`);
            addLog(`Stack: ${err.stack}`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>🐝 WebView Debug Page</h1>

            <div style={{ marginBottom: '20px', padding: '10px', border: '2px solid #333', backgroundColor: '#f0f0f0' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Login Test</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <button
                    onClick={testLogin}
                    style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
                >
                    Test Login
                </button>
            </div>

            <div style={{ padding: '10px', border: '2px solid #333', backgroundColor: '#000', color: '#0f0', maxHeight: '500px', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#0f0' }}>Debug Log</h2>
                {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '5px', fontFamily: 'monospace' }}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
