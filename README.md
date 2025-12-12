# Sistem Absensi dengan Face Recognition

Aplikasi absensi modern menggunakan teknologi pengenalan wajah (Face Recognition) yang dibangun dengan Next.js 16 dan TypeScript.

## ✨ Fitur Utama

- 🎭 **Face Detection & Recognition** - Deteksi wajah real-time dengan validasi posisi
- 📸 **Multi-Capture Registration** - Registrasi dengan 3 foto wajah untuk akurasi tinggi
- 🔐 **Authentication System** - Login/Logout dengan session management
- 🌓 **Dark Mode Support** - Toggle antara light dan dark theme
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- ⚡ **Turbopack** - Build yang sangat cepat dengan Next.js 16

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Face Detection:** @vladmandic/face-api
- **HTTP Client:** Axios
- **Webcam:** react-webcam
- **Theme:** next-themes
- **Excel Generation:** ExcelJS

## 📋 Prerequisites

- Node.js 18+ 
- NPM atau Yarn
- Webcam (untuk fitur face detection)

## 🚀 Getting Started

### Installation

```bash
# Clone repository
git clone <repository-url>

# Masuk ke direktori project
cd absensi-nextjs

# Install dependencies
npm install
```

### Development

```bash
# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
# Build project
npm run build

# Jalankan production server
npm start
```

## 📁 Struktur Project

```
absensi-nextjs/
├── app/
│   ├── api/              # API routes
│   │   ├── login/
│   │   └── logout/
│   ├── components/       # Shared components
│   │   └── ThemeToggle.tsx
│   ├── dashboard/        # Dashboard pages
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/           # Login page
│   ├── register/        # Registration dengan face detection
│   ├── providers/       # Context providers
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── public/              # Static assets
├── proxy.ts             # Middleware untuk auth
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS config
└── tsconfig.json        # TypeScript config
```

## 🔑 Fitur-Fitur Detail

### 1. Registrasi dengan Face Detection

- Real-time face detection saat capture
- Validasi posisi wajah (menghadap depan, jarak tepat)
- Capture 3 foto dari angle berbeda
- Visual feedback dengan kotak deteksi wajah

### 2. Authentication

- Protected routes dengan middleware
- Cookie-based session
- Auto redirect ke login untuk halaman protected

### 3. Dark Mode

- Toggle seamless antara light/dark theme
- Persistent preference (localStorage)
- Support system preference

### 4. Excel Export

- Export data absensi ke file Excel (.xlsx) menggunakan ExcelJS
- Format profesional dengan header berwarna dan lebar kolom optimal
- Tersedia di halaman Check-In dan Check-Out dengan filter tanggal
- Fitur export juga ada di tabel ringkasan absensi

## 🌐 API Endpoints

Base URL: `https://api-face-inahef.layanancerdas.id`

### Register
```
POST /api/register
Body: {
  "name": "string",
  "images": ["base64", "base64", "base64"]
}
```

## 📝 Environment Variables

Tidak ada environment variables yang diperlukan untuk development. API URL sudah hardcoded dalam kode.

Untuk production, Anda bisa membuat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api-face-inahef.layanancerdas.id
```

## 🎨 Customization

### Mengubah Tema

Edit file `app/globals.css` untuk mengubah warna tema:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

html.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

### Mengubah API URL

Edit konstanta di file yang menggunakan API:
- `app/register/page.tsx`

## 🐛 Troubleshooting

### Face Detection tidak bekerja

1. Pastikan browser mendukung getUserMedia API
2. Berikan izin akses kamera di browser
3. Cek koneksi internet (models dimuat dari CDN)

### Build Error

```bash
# Hapus cache dan rebuild
rm -rf .next
npm run build
```

### Export Excel tidak bekerja

1. Pastikan browser mendukung Blob API dan download
2. Cek apakah ada popup blocker yang menghalangi download
3. Verifikasi data tidak kosong sebelum export
4. Pastikan ExcelJS sudah ter-install dengan benar: `npm install exceljs`

## 📄 License

MIT License - Silakan gunakan untuk keperluan pribadi atau komersial.

## 👥 Contributing

Contributions, issues, dan feature requests sangat diterima!

## 🙏 Credits

- Next.js Team
- Tailwind CSS
- Vladimir Mandic (face-api.js)

---

Dibuat dengan ❤️ menggunakan Next.js

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
