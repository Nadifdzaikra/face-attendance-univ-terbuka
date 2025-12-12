'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>✅ Test Page Working!</h1>
      <p>Jika halaman ini muncul, Next.js berjalan dengan baik.</p>
      <p>
        <a href="/dashboard" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Coba Akses Dashboard
        </a>
      </p>
    </div>
  );
}
