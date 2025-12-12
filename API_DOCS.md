# API Documentation - Face Attendance System

Fullstack Next.js aplikasi dengan sistem absensi berbasis pengenalan wajah dan database lokal JSON.

## Database Schema

### Users Table (`data/users.json`)
```typescript
{
  id: string;           // UUID
  email: string;        // Unique email
  password: string;     // SHA256 hashed
  name: string;         // Full name
  role: 'admin' | 'mahasiswa';
  created_at: string;   // ISO datetime
  updated_at: string;   // ISO datetime
}
```

### Attendance Table (`data/attendance.json`)
```typescript
{
  id: string;           // UUID
  userId: string;       // Reference to user id
  timestamp: string;    // ISO datetime
  image: string;        // Base64 image data
  status: 'success' | 'failed';
  created_at: string;   // ISO datetime
}
```

## API Endpoints

### Authentication

#### POST `/api/login`
Login dengan email dan password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "ok": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "mahasiswa"
  }
}
```

**Errors:**
- 400: Email dan password harus diisi
- 401: Email atau password salah

**Sets Cookie:**
- `token`: httpOnly cookie (valid 7 days)

---

#### POST `/api/register`
Registrasi user baru.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "mahasiswa"  // Optional, default: 'mahasiswa'
}
```

**Response (201):**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "mahasiswa"
  }
}
```

**Errors:**
- 400: Email, password, dan nama harus diisi
- 409: Email sudah terdaftar

---

#### POST `/api/logout`
Logout user (delete token cookie).

**Response (200):**
```json
{
  "message": "Logout berhasil"
}
```

---

### Profile

#### GET `/api/profile`
Get current user profile.

**Headers:**
- `Cookie`: token=...

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "mahasiswa",
    "created_at": "2025-12-12T10:00:00Z",
    "updated_at": "2025-12-12T10:00:00Z"
  }
}
```

**Errors:**
- 401: Anda belum login
- 404: User tidak ditemukan

---

#### PUT `/api/profile`
Update current user profile.

**Headers:**
- `Cookie`: token=...

**Request:**
```json
{
  "name": "Jane Doe"
}
```

**Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "mahasiswa",
    "updated_at": "2025-12-12T10:05:00Z"
  }
}
```

---

### Attendance

#### POST `/api/attendance`
Record attendance dengan gambar wajah.

**Headers:**
- `Cookie`: token=...

**Request:**
```json
{
  "image": "base64_image_data"
}
```

**Response (201):**
```json
{
  "message": "Absensi berhasil dicatat",
  "attendance": {
    "id": "uuid",
    "userId": "uuid",
    "timestamp": "2025-12-12T10:00:00Z",
    "status": "success"
  }
}
```

**Errors:**
- 400: Image tidak ditemukan
- 401: Anda belum login
- 404: User tidak ditemukan
- 409: Anda sudah absen hari ini

---

#### GET `/api/attendance`
Get attendance records untuk current user.

**Headers:**
- `Cookie`: token=...

**Response (200):**
```json
{
  "records": [
    {
      "id": "uuid",
      "userId": "uuid",
      "timestamp": "2025-12-12T10:00:00Z",
      "status": "success",
      "created_at": "2025-12-12T10:00:00Z"
    }
  ]
}
```

---

### Admin - Users Management

#### GET `/api/users`
Get all users dan attendance stats (Admin only).

**Headers:**
- `Cookie`: token=... (must be admin role)

**Response (200):**
```json
{
  "total_users": 10,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "mahasiswa",
      "attendance_count": 5,
      "created_at": "2025-12-12T10:00:00Z"
    }
  ]
}
```

**Errors:**
- 401: Anda belum login
- 403: Anda tidak memiliki akses (bukan admin)

---

## Environment Variables

Tambahkan ke `.env.local`:

```
JWT_SECRET=your-super-secret-key-change-this
```

## Authentication Flow

1. User registrasi dengan `/api/register`
2. User login dengan `/api/login` → dapat token di cookie
3. Token otomatis dikirim dengan setiap request
4. Middleware verify token dan set headers `x-user-id` dan `x-user-role`
5. Protected routes redirect ke login jika belum authenticated

## Protected Routes

Routes yang memerlukan authentication:
- `/dashboard`
- `/checkin`
- `/checkout`

Middleware di `middleware.ts` menghandle proteksi route.

## Database Files

- `data/users.json` - Semua user data
- `data/attendance.json` - Semua attendance records

Semua data disimpan sebagai JSON file di filesystem.

## Error Handling

Semua endpoint return error dalam format:
```json
{
  "message": "Error description"
}
```

Status codes:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
