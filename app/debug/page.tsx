'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch('/api/test');
        const data = await res.json();
        setApiTest(data);
      } catch (err) {
        setApiTest({ error: String(err) });
      }
    };

    // Check cookie
    const tokenFromCookie = document.cookie
      .split(';')
      .find(c => c.includes('token'));
    setToken(tokenFromCookie || 'No token found');

    checkToken();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Token dari Cookie:</h3>
        <pre>{token}</pre>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>API Test Response:</h3>
        <pre>{JSON.stringify(apiTest, null, 2)}</pre>
      </div>

      <button 
        onClick={() => {
          document.cookie = 'token=; max-age=0';
          window.location.href = '/login';
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        Logout & Go to Login
      </button>
    </div>
  );
}
