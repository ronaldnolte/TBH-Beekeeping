'use client';

export default function SuccessPage() {
    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ Login Successful!</h1>
            <p style={{ fontSize: '24px', color: '#666' }}>The WebView can navigate and display pages!</p>
            <p style={{ fontSize: '18px', marginTop: '40px' }}>
                This proves the crash is happening on a specific page, not during navigation.
            </p>
        </div>
    );
}
