# UAT Test Cases - Face Attendance System

## Format Tabel UAT

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|

---

## 1. MODUL AUTHENTICATION

### Login

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 1 | Login | TC-LOGIN-001 | Login dengan email dan password valid | User terdaftar dengan email dan password | 1. Buka halaman login<br>2. Input email yang valid<br>3. Input password yang valid<br>4. Klik tombol "Login" | User berhasil login dan redirect ke dashboard | | ☐ Pass ☐ Fail | | |
| 2 | Login | TC-LOGIN-002 | Login dengan email tidak valid | User belum terdaftar | 1. Buka halaman login<br>2. Input email yang tidak terdaftar<br>3. Input password<br>4. Klik tombol "Login" | Tampil pesan error "Email atau password tidak valid" | | ☐ Pass ☐ Fail | | |
| 3 | Login | TC-LOGIN-003 | Login dengan password salah | User terdaftar dengan email benar | 1. Buka halaman login<br>2. Input email yang terdaftar<br>3. Input password yang salah<br>4. Klik tombol "Login" | Tampil pesan error "Email atau password tidak valid" | | ☐ Pass ☐ Fail | | |
| 4 | Login | TC-LOGIN-004 | Login dengan email kosong | User terdaftar | 1. Buka halaman login<br>2. Biarkan field email kosong<br>3. Input password<br>4. Klik tombol "Login" | Field email di-highlight dan tampil pesan validasi atau login ditolak | | ☐ Pass ☐ Fail | | |
| 5 | Login | TC-LOGIN-005 | Login dengan password kosong | User terdaftar | 1. Buka halaman login<br>2. Input email<br>3. Biarkan field password kosong<br>4. Klik tombol "Login" | Field password di-highlight dan tampil pesan validasi atau login ditolak | | ☐ Pass ☐ Fail | | |
| 6 | Login | TC-LOGIN-006 | Toggle password visibility | User berada di halaman login | 1. Buka halaman login<br>2. Input password<br>3. Klik icon eye untuk toggle visibility<br>4. Verifikasi password terlihat/tersembunyi | Password berubah dari hidden (***) menjadi visible (plain text) dan sebaliknya | | ☐ Pass ☐ Fail | | |
| 7 | Login | TC-LOGIN-007 | Navigasi ke halaman register | User berada di halaman login | 1. Buka halaman login<br>2. Klik link "Belum punya akun? Daftar di sini" | Redirect ke halaman register | | ☐ Pass ☐ Fail | | |
| 8 | Login | TC-LOGIN-008 | Response time login | User melakukan login dengan data valid | 1. Buka halaman login<br>2. Hitung waktu dari klik login sampai redirect<br>3. Catat waktu response | Response time < 3 detik | | ☐ Pass ☐ Fail | | |

### Register

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 9 | Register | TC-REG-001 | Register dengan data valid + 1 foto wajah | Belum ada akun | 1. Buka halaman register<br>2. Input nama lengkap<br>3. Input email baru<br>4. Input password<br>5. Ambil 1 foto wajah dengan camera<br>6. Klik tombol "Daftar" | User berhasil terdaftar, foto tersimpan, redirect ke login | | ☐ Pass ☐ Fail | | |
| 10 | Register | TC-REG-002 | Register dengan data valid + 3 foto wajah | Belum ada akun | 1. Buka halaman register<br>2. Input nama lengkap<br>3. Input email baru<br>4. Input password<br>5. Ambil 3 foto wajah dengan camera (sudut berbeda)<br>6. Klik tombol "Daftar" | User berhasil terdaftar, 3 foto tersimpan, redirect ke login | | ☐ Pass ☐ Fail | | |
| 11 | Register | TC-REG-003 | Register dengan email yang sudah terdaftar | Email sudah terdaftar di sistem | 1. Buka halaman register<br>2. Input nama lengkap<br>3. Input email yang sudah terdaftar<br>4. Input password<br>5. Ambil foto wajah<br>6. Klik tombol "Daftar" | Tampil pesan error "Email sudah terdaftar" | | ☐ Pass ☐ Fail | | |
| 12 | Register | TC-REG-004 | Register dengan nama kosong | Belum ada akun | 1. Buka halaman register<br>2. Biarkan nama kosong<br>3. Input email<br>4. Input password<br>5. Ambil foto wajah<br>6. Klik tombol "Daftar" | Field nama di-highlight, pesan validasi tampil atau form ditolak | | ☐ Pass ☐ Fail | | |
| 13 | Register | TC-REG-005 | Register dengan email kosong | Belum ada akun | 1. Buka halaman register<br>2. Input nama<br>3. Biarkan email kosong<br>4. Input password<br>5. Ambil foto wajah<br>6. Klik tombol "Daftar" | Field email di-highlight, pesan validasi tampil atau form ditolak | | ☐ Pass ☐ Fail | | |
| 14 | Register | TC-REG-006 | Register dengan password kosong | Belum ada akun | 1. Buka halaman register<br>2. Input nama<br>3. Input email<br>4. Biarkan password kosong<br>5. Ambil foto wajah<br>6. Klik tombol "Daftar" | Field password di-highlight, pesan validasi tampil atau form ditolak | | ☐ Pass ☐ Fail | | |
| 15 | Register | TC-REG-007 | Register tanpa foto wajah | Belum ada akun | 1. Buka halaman register<br>2. Input nama<br>3. Input email<br>4. Input password<br>5. Tidak ambil foto wajah<br>6. Klik tombol "Daftar" | Tampil pesan "Silakan ambil minimal 1 foto wajah" atau form ditolak | | ☐ Pass ☐ Fail | | |
| 16 | Register | TC-REG-008 | Face detection pada register | Belum ada akun | 1. Buka halaman register<br>2. Aktifkan camera<br>3. Hadapkan wajah ke camera<br>4. Verifikasi status deteksi | Status menunjukkan "✅ Posisi sempurna" saat wajah terdeteksi dengan baik | | ☐ Pass ☐ Fail | | |
| 17 | Register | TC-REG-009 | Capture foto dengan posisi salah | Belum ada akun | 1. Buka halaman register<br>2. Aktifkan camera<br>3. Hadapkan wajah miring/jauh/dekat<br>4. Coba capture foto | Foto tidak bisa dicapture sampai posisi benar (status harus "✅ Posisi sempurna") | | ☐ Pass ☐ Fail | | |
| 18 | Register | TC-REG-010 | Delete foto yang sudah dicapture | User sudah ambil foto | 1. Buka halaman register<br>2. Ambil foto wajah<br>3. Klik tombol delete/hapus pada foto<br>4. Verifikasi foto terhapus | Foto berhasil dihapus dari daftar foto | | ☐ Pass ☐ Fail | | |
| 19 | Register | TC-REG-011 | Navigasi ke halaman login dari register | User berada di halaman register | 1. Buka halaman register<br>2. Klik link "Sudah punya akun? Login di sini" | Redirect ke halaman login | | ☐ Pass ☐ Fail | | |
| 20 | Register | TC-REG-012 | Response time register dengan 3 foto | User melakukan register dengan 3 foto | 1. Buka halaman register<br>2. Isi semua data + 3 foto<br>3. Hitung waktu dari klik register sampai redirect<br>4. Catat waktu response | Response time < 5 detik | | ☐ Pass ☐ Fail | | |

---

## 2. MODUL ATTENDANCE (ABSENSI)

### Attendance Check-In

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 21 | Attendance | TC-ATT-001 | Check-in dengan input ruangan valid + deteksi wajah valid | User sudah login<br>Ruangan ada di sistem | 1. Buka halaman attendance<br>2. Input nomor ruangan (step 1)<br>3. Klik "Lanjut ke absensi wajah"<br>4. Hadapkan wajah ke camera (step 2)<br>5. Tunggu auto-capture 3 detik<br>6. Verifikasi success message | Check-in berhasil, tampil "Selamat datang, {nama}. Kehadiran Anda telah dicatat"<br>Auto-reset ke step 1 dalam 20 detik | | ☐ Pass ☐ Fail | | |
| 22 | Attendance | TC-ATT-002 | Check-in dengan input ruangan kosong | User berada di step 1 attendance | 1. Buka halaman attendance (step 1)<br>2. Biarkan field ruangan kosong<br>3. Klik tombol "Lanjut ke absensi wajah" | Tampil error message "Silakan input nama ruangan terlebih dahulu" | | ☐ Pass ☐ Fail | | |
| 23 | Attendance | TC-ATT-003 | Check-in dengan nomor ruangan tidak valid/tidak ada | Ruangan tidak ada di sistem | 1. Input nomor ruangan yang tidak ada<br>2. Klik "Lanjut"<br>3. Hadapkan wajah<br>4. Tunggu capture dan submit | Tampil error "Ruangan tidak ditemukan" atau proses ditolak | | ☐ Pass ☐ Fail | | |
| 24 | Attendance | TC-ATT-004 | Check-in dengan wajah tidak terdeteksi | User berada di step 2 (camera aktif) | 1. Buka halaman attendance step 2<br>2. Jangan hadapkan wajah ke camera<br>3. Tunggu > 30 detik | Status tetap "❌ Tidak ada wajah terdeteksi", tidak ada auto-capture | | ☐ Pass ☐ Fail | | |
| 25 | Attendance | TC-ATT-005 | Check-in dengan wajah terlalu jauh | User berada di step 2 (camera aktif) | 1. Buka halaman attendance step 2<br>2. Hadapkan wajah tapi terlalu jauh dari camera<br>3. Verifikasi status | Status menunjukkan "❌ Wajah terlalu jauh, dekatkan wajah Anda"<br>Tidak ada auto-capture sampai jarak tepat | | ☐ Pass ☐ Fail | | |
| 26 | Attendance | TC-ATT-006 | Check-in dengan wajah terlalu dekat | User berada di step 2 (camera aktif) | 1. Buka halaman attendance step 2<br>2. Hadapkan wajah terlalu dekat ke camera<br>3. Verifikasi status | Status menunjukkan "❌ Wajah terlalu dekat, jauhkan sedikit"<br>Tidak ada auto-capture sampai jarak tepat | | ☐ Pass ☐ Fail | | |
| 27 | Attendance | TC-ATT-007 | Check-in dengan wajah miring | User berada di step 2 (camera aktif) | 1. Buka halaman attendance step 2<br>2. Hadapkan wajah dengan posisi miring<br>3. Verifikasi status | Status menunjukkan "❌ Hadapkan wajah ke depan, jangan miring"<br>Tidak ada auto-capture sampai hadap lurus | | ☐ Pass ☐ Fail | | |
| 28 | Attendance | TC-ATT-008 | Check-in dengan posisi wajah sempurna | User berada di step 2 (camera aktif) | 1. Buka halaman attendance step 2<br>2. Hadapkan wajah dengan posisi sempurna (lurus, jarak tepat)<br>3. Tunggu status berubah<br>4. Tunggu 3 detik auto-capture | Status berubah menjadi "✅ Posisi sempurna! Siap capture"<br>Auto-capture terjadi dalam 3 detik<br>Countdown 2 detik sebelum submit | | ☐ Pass ☐ Fail | | |
| 29 | Attendance | TC-ATT-009 | Verifikasi countdown 2 detik sebelum submit | User sudah capture wajah | 1. Dari TC-ATT-008, setelah auto-capture<br>2. Verifikasi countdown 2 detik tampil dengan status "Mengirim dalam X detik..."<br>3. Tunggu countdown selesai | Countdown 2→1→0 tampil dengan smooth<br>Setelah 0, status berubah ke "Memproses verifikasi wajah..." | | ☐ Pass ☐ Fail | | |
| 30 | Attendance | TC-ATT-010 | Verifikasi processing state | Countdown selesai | 1. Dari TC-ATT-009, setelah countdown 0<br>2. Verifikasi status processing tampil dengan spinner | Status menunjukkan "Memproses verifikasi wajah..." dengan rotating spinner | | ☐ Pass ☐ Fail | | |
| 31 | Attendance | TC-ATT-011 | Verifikasi success message dengan nama | Check-in berhasil diproses API | 1. Dari TC-ATT-010, tunggu API response<br>2. Verifikasi success message | Tampil "Absensi Berhasil!" dengan message "Selamat datang, {nama}. Kehadiran Anda telah dicatat."<br>Nama diambil dari API response | | ☐ Pass ☐ Fail | | |
| 32 | Attendance | TC-ATT-012 | Countdown reset 20 detik setelah success | Success message tampil | 1. Dari TC-ATT-011, success message tampil<br>2. Verifikasi countdown "Reset dalam 20s" | Countdown 20→19→...→1→0 tampil<br>Setelah 0, form reset ke step 1 otomatis | | ☐ Pass ☐ Fail | | |
| 33 | Attendance | TC-ATT-013 | Kembali tombol dari step 1 ke home | User berada di step 1 attendance | 1. Buka halaman attendance<br>2. Klik tombol "Kembali" | Redirect ke halaman home (/) | | ☐ Pass ☐ Fail | | |
| 34 | Attendance | TC-ATT-014 | Back button setelah input ruangan | User sudah input ruangan di step 1 | 1. Input ruangan<br>2. Klik "Lanjut"<br>3. Di step 2, tidak ada back button (hanya reset 20s) | Step 2 tidak memiliki back button, hanya countdown auto-reset | | ☐ Pass ☐ Fail | | |
| 35 | Attendance | TC-ATT-015 | Multiple check-in dalam satu hari | User sudah check-in 1x | 1. Check-in pertama kali (berhasil)<br>2. Tunggu reset otomatis<br>3. Input ruangan berbeda<br>4. Check-in lagi dengan wajah yang sama | Kedua check-in berhasil tercatat di sistem | | ☐ Pass ☐ Fail | | |
| 36 | Attendance | TC-ATT-016 | Check-in dengan wajah yang berbeda dari registrasi | User terdaftar dengan wajah A, coba check-in dengan wajah B | 1. Input ruangan<br>2. Hadapkan wajah orang berbeda ke camera<br>3. Tunggu capture dan process | API menolak dan tampil error "Verifikasi wajah gagal" atau serupa | | ☐ Pass ☐ Fail | | |
| 37 | Attendance | TC-ATT-017 | Response time check-in dari capture sampai success | User melakukan check-in normal | 1. Catat waktu saat wajah di-capture<br>2. Tunggu success message<br>3. Hitung total waktu (2s delay + processing) | Total waktu < 10 detik (ideal 5-8 detik) | | ☐ Pass ☐ Fail | | |

---

## 3. MODUL DASHBOARD

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 38 | Dashboard | TC-DASH-001 | Tampilan dashboard setelah login | User sudah login | 1. Login dengan akun valid<br>2. Verifikasi halaman dashboard tampil | Dashboard tampil dengan header, navbar, stats cards, dan menu | | ☐ Pass ☐ Fail | | |
| 39 | Dashboard | TC-DASH-002 | Stats card - Total Pegawai | User di dashboard | 1. Lihat stats card pertama (Total Pegawai)<br>2. Verifikasi angka menunjukkan jumlah pegawai terdaftar | Stats card menampilkan jumlah pegawai yang benar | | ☐ Pass ☐ Fail | | |
| 40 | Dashboard | TC-DASH-003 | Stats card - Hadir Hari Ini | User di dashboard | 1. Lihat stats card kedua (Hadir Hari Ini)<br>2. Verifikasi angka menunjukkan pegawai hadir hari ini | Stats card menampilkan jumlah kehadiran hari ini yang benar | | ☐ Pass ☐ Fail | | |
| 41 | Dashboard | TC-DASH-004 | Stats card - Check-Out | User di dashboard | 1. Lihat stats card ketiga (Check-Out)<br>2. Verifikasi angka menunjukkan pegawai yang check-out | Stats card menampilkan jumlah check-out yang benar | | ☐ Pass ☐ Fail | | |
| 42 | Dashboard | TC-DASH-005 | Stats card - Total Absensi | User di dashboard | 1. Lihat stats card keempat (Total Absensi)<br>2. Verifikasi angka menunjukkan total absensi | Stats card menampilkan jumlah absensi yang benar | | ☐ Pass ☐ Fail | | |
| 43 | Dashboard | TC-DASH-006 | Attendance table - Tampilan data | User di dashboard | 1. Scroll ke bawah untuk lihat attendance table<br>2. Verifikasi tabel menampilkan kolom: No, Nama, Ruangan, Jam Masuk, Jam Keluar | Table menampilkan data kehadiran dengan kolom lengkap | | ☐ Pass ☐ Fail | | |
| 44 | Dashboard | TC-DASH-007 | Attendance table - Sorting/Filter | User di dashboard dengan attendance table | 1. Klik header kolom (jika ada sort)<br>2. Verifikasi data terurut | Data terurut sesuai kolom yang diklik (jika fitur implemented) | | ☐ Pass ☐ Fail | | |
| 45 | Dashboard | TC-DASH-008 | Attendance table - Export data | User di dashboard | 1. Lihat tombol "Export" di attendance table<br>2. Klik tombol export<br>3. Verifikasi file terdownload | File CSV/Excel berhasil didownload dengan data attendance | | ☐ Pass ☐ Fail | | |
| 46 | Dashboard | TC-DASH-009 | Menu - Navigasi ke Attendance | User di dashboard | 1. Klik tombol "Absensi Wajah" pada menu<br>2. Atau klik pada "Register" button di quick menu | Redirect ke halaman attendance (/attendance) | | ☐ Pass ☐ Fail | | |
| 47 | Dashboard | TC-DASH-010 | Menu - Navigasi ke Users List | User di dashboard | 1. Klik tombol "Daftar Pengguna" pada menu | Redirect ke halaman users-list (/dashboard/users-list) | | ☐ Pass ☐ Fail | | |
| 48 | Dashboard | TC-DASH-011 | Menu - Navigasi ke Problems List | User di dashboard | 1. Klik tombol "Daftar Masalah" pada menu | Redirect ke halaman problems-list (/dashboard/problems-list) | | ☐ Pass ☐ Fail | | |
| 49 | Dashboard | TC-DASH-012 | Theme toggle - Light/Dark mode | User di dashboard | 1. Klik tombol theme toggle (moon/sun icon)<br>2. Verifikasi tema berubah | Tema berubah dari light ke dark atau sebaliknya, background dan text adjust | | ☐ Pass ☐ Fail | | |
| 50 | Dashboard | TC-DASH-013 | Profile menu - Lihat nama user | User di dashboard | 1. Lihat profile section di navbar<br>2. Verifikasi nama user tampil | Nama user yang login tampil di navbar/profile section | | ☐ Pass ☐ Fail | | |
| 51 | Dashboard | TC-DASH-014 | Logout | User di dashboard | 1. Klik tombol "Logout" di navbar<br>2. Verifikasi redirect ke login | Redirect ke halaman login, session dihapus | | ☐ Pass ☐ Fail | | |
| 52 | Dashboard | TC-DASH-015 | Responsive design - Mobile view | User di dashboard dengan device mobile | 1. Buka dashboard di mobile (< 768px)<br>2. Verifikasi layout responsive | Layout menyesuaikan dengan ukuran layar, tidak ada horizontal scroll | | ☐ Pass ☐ Fail | | |
| 53 | Dashboard | TC-DASH-016 | Responsive design - Tablet view | User di dashboard dengan device tablet | 1. Buka dashboard di tablet (768-1024px)<br>2. Verifikasi layout responsive | Layout menyesuaikan dengan ukuran layar tablet | | ☐ Pass ☐ Fail | | |
| 54 | Dashboard | TC-DASH-017 | Responsive design - Desktop view | User di dashboard dengan device desktop | 1. Buka dashboard di desktop (> 1024px)<br>2. Verifikasi layout penuh | Layout penuh dengan sidebar/menu terlihat lengkap | | ☐ Pass ☐ Fail | | |

---

## 4. MODUL USERS LIST

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 55 | Users List | TC-USER-001 | Tampilan daftar pengguna | User di dashboard, click menu users-list | 1. Buka halaman users-list (/dashboard/users-list)<br>2. Verifikasi tabel pengguna tampil | Tabel menampilkan daftar semua pengguna yang terdaftar | | ☐ Pass ☐ Fail | | |
| 56 | Users List | TC-USER-002 | Tabel - Kolom data | User membuka users-list | 1. Lihat struktur tabel<br>2. Verifikasi ada kolom: No, Nama, Email, Status, Aksi | Tabel menampilkan semua kolom data | | ☐ Pass ☐ Fail | | |
| 57 | Users List | TC-USER-003 | Search/Filter pengguna | User membuka users-list | 1. Input nama atau email di search box<br>2. Tekan enter atau klik search | Data ter-filter sesuai search query | | ☐ Pass ☐ Fail | | |
| 58 | Users List | TC-USER-004 | Edit pengguna | User membuka users-list | 1. Klik tombol "Edit" pada baris pengguna<br>2. Ubah data (nama/email)<br>3. Klik "Simpan" | Data pengguna berhasil diupdate | | ☐ Pass ☐ Fail | | |
| 59 | Users List | TC-USER-005 | Delete pengguna | User membuka users-list | 1. Klik tombol "Delete" pada baris pengguna<br>2. Konfirmasi hapus<br>3. Verifikasi pengguna terhapus | Pengguna berhasil dihapus dari daftar | | ☐ Pass ☐ Fail | | |
| 60 | Users List | TC-USER-006 | Pagination | User-list dengan data > 10 | 1. Scroll ke bawah untuk lihat pagination<br>2. Klik page 2, 3, dst<br>3. Verifikasi data berubah | Pagination berfungsi, menampilkan data per halaman | | ☐ Pass ☐ Fail | | |

---

## 5. MODUL PROBLEMS LIST

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 61 | Problems | TC-PROB-001 | Tampilan daftar masalah/absensi | User di dashboard, click menu problems-list | 1. Buka halaman problems-list (/dashboard/problems-list)<br>2. Verifikasi tabel daftar masalah tampil | Tabel menampilkan daftar absensi/masalah yang terjadi | | ☐ Pass ☐ Fail | | |
| 62 | Problems | TC-PROB-002 | Tabel - Kolom data | User membuka problems-list | 1. Lihat struktur tabel<br>2. Verifikasi ada kolom: No, Nama, Deskripsi, Status, Tanggal, Aksi | Tabel menampilkan semua kolom masalah | | ☐ Pass ☐ Fail | | |
| 63 | Problems | TC-PROB-003 | Update status masalah | User membuka problems-list | 1. Klik dropdown status pada masalah<br>2. Ubah status (misal: Pending → Resolved)<br>3. Klik simpan | Status berhasil diupdate | | ☐ Pass ☐ Fail | | |
| 64 | Problems | TC-PROB-004 | Delete masalah | User membuka problems-list | 1. Klik tombol "Delete" pada masalah<br>2. Konfirmasi hapus<br>3. Verifikasi masalah terhapus | Masalah berhasil dihapus dari daftar | | ☐ Pass ☐ Fail | | |
| 65 | Problems | TC-PROB-005 | Filter by status | User membuka problems-list | 1. Klik dropdown filter status<br>2. Pilih status tertentu (misal: Pending)<br>3. Verifikasi hanya masalah dengan status itu tampil | Daftar ter-filter sesuai status yang dipilih | | ☐ Pass ☐ Fail | | |

---

## 6. MODUL ADVANCED / INTEGRATION

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 66 | Integration | TC-INT-001 | Full flow - Register hingga Check-in | Aplikasi berjalan | 1. Register user baru dengan 2-3 foto<br>2. Login dengan akun baru<br>3. Buka halaman attendance<br>4. Check-in dengan wajah yang sama saat register | Seluruh alur berhasil, user ter-register dan check-in berhasil tercatat | | ☐ Pass ☐ Fail | | |
| 67 | Integration | TC-INT-002 | API connectivity - Recognize endpoint | User check-in | 1. Check-in normal sampai success<br>2. Verifikasi di backend, API endpoint `/api/recognize` dipanggil | API endpoint dipanggil dengan request body: {image, ruang} | | ☐ Pass ☐ Fail | | |
| 68 | Integration | TC-INT-003 | Camera permission handling | User belum memberi camera permission | 1. Buka halaman register/attendance<br>2. Browser minta camera permission<br>3. Deny permission<br>4. Verifikasi error handling | Error message tampil "Akses camera ditolak, silakan berikan permission" | | ☐ Pass ☐ Fail | | |
| 69 | Integration | TC-INT-004 | Network error handling - No internet | User mencoba check-in tanpa internet | 1. Matikan internet/WiFi<br>2. Buka halaman attendance<br>3. Coba check-in<br>4. Verifikasi error handling | Error message tampil "Gagal terhubung ke server, periksa koneksi internet" | | ☐ Pass ☐ Fail | | |
| 70 | Integration | TC-INT-005 | Browser compatibility - Chrome | User menggunakan Chrome browser | 1. Buka aplikasi di Chrome terbaru<br>2. Test login, register, attendance<br>3. Verifikasi semua fitur bekerja | Semua fitur berfungsi normal di Chrome | | ☐ Pass ☐ Fail | | |
| 71 | Integration | TC-INT-006 | Browser compatibility - Firefox | User menggunakan Firefox browser | 1. Buka aplikasi di Firefox terbaru<br>2. Test login, register, attendance<br>3. Verifikasi semua fitur bekerja | Semua fitur berfungsi normal di Firefox | | ☐ Pass ☐ Fail | | |
| 72 | Integration | TC-INT-007 | Browser compatibility - Safari | User menggunakan Safari browser | 1. Buka aplikasi di Safari terbaru<br>2. Test login, register, attendance<br>3. Verifikasi semua fitur bekerja | Semua fitur berfungsi normal di Safari | | ☐ Pass ☐ Fail | | |
| 73 | Integration | TC-INT-008 | Performance - Page load time | User membuka halaman | 1. Buka halaman dashboard<br>2. Measure page load time (First Contentful Paint)<br>3. Catat waktu | Page load time < 3 detik | | ☐ Pass ☐ Fail | | |
| 74 | Integration | TC-INT-009 | Security - Password strength validation | User register dengan password lemah | 1. Register dengan password "123" atau "abc"<br>2. Verifikasi validasi | Error atau warning tampil untuk password terlalu lemah | | ☐ Pass ☐ Fail | | |
| 75 | Integration | TC-INT-010 | Security - Session timeout | User login dan idle > 30 menit | 1. Login<br>2. Idle tanpa aktivitas 30+ menit<br>3. Coba akses protected page<br>4. Verifikasi redirect ke login | User diredirect ke login setelah session expired | | ☐ Pass ☐ Fail | | |

---

## 7. MODUL ACCESSIBILITY & UX

| No. | Modul/Fitur | Test Case ID | Skenario Pengujian | Prasyarat | Langkah-Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status | Bug ID | Tanggal |
|-----|------------|--------------|-------------------|-----------|-------------------------|----------------------|-------------|---------|---------| ---------|
| 76 | UX | TC-UX-001 | Fokus keyboard navigation | User navigasi dengan keyboard | 1. Tekan TAB berulang kali<br>2. Verifikasi fokus bergerak ke setiap element<br>3. Tekan ENTER pada button | Keyboard navigation berfungsi, semua element accessible | | ☐ Pass ☐ Fail | | |
| 77 | UX | TC-UX-002 | Error message clarity | User input data tidak valid | 1. Test berbagai invalid input<br>2. Verifikasi error message jelas dan membantu | Error message memberikan informasi jelas tentang apa yang salah | | ☐ Pass ☐ Fail | | |
| 78 | UX | TC-UX-003 | Loading state visual feedback | User submit form | 1. Submit form dan tunggu response<br>2. Verifikasi loading indicator tampil<br>3. Verifikasi button disabled saat loading | Loading state visual terlihat, button disabled mencegah multiple submit | | ☐ Pass ☐ Fail | | |
| 79 | UX | TC-UX-004 | Success notification | User berhasil complete action | 1. Complete action (login, register, check-in)<br>2. Verifikasi success notification tampil | Success message/notification tampil dengan jelas dan informative | | ☐ Pass ☐ Fail | | |
| 80 | UX | TC-UX-005 | Confirmation dialog untuk aksi destruktif | User coba delete data | 1. Klik tombol delete<br>2. Verifikasi confirmation dialog tampil<br>3. Klik confirm atau cancel | Confirmation dialog muncul, user bisa cancel operasi | | ☐ Pass ☐ Fail | | |

---

## RINGKASAN FITUR YANG BISA DITEST

### 1. **Authentication Module**
   - ✅ Login (email/password)
   - ✅ Register (dengan capture foto wajah)
   - ✅ Password visibility toggle
   - ✅ Form validation

### 2. **Attendance Module**
   - ✅ 2-step attendance flow (input ruangan → face recognition)
   - ✅ Real-time face detection dengan face-api.js
   - ✅ Auto-capture ketika posisi wajah sempurna
   - ✅ 3-second countdown sebelum capture
   - ✅ 2-second countdown sebelum submit ke API
   - ✅ Face position validation (jarak, posisi, miring)
   - ✅ Success message dengan nama dari API
   - ✅ 20-second countdown sebelum auto-reset ke step 1

### 3. **Dashboard Module**
   - ✅ Dashboard overview dengan stats cards
   - ✅ Attendance table dengan data kehadiran
   - ✅ Export attendance data
   - ✅ Quick menu untuk navigasi
   - ✅ Theme toggle (light/dark mode)
   - ✅ User profile dan logout
   - ✅ Responsive design

### 4. **Users Management**
   - ✅ Daftar pengguna
   - ✅ Search/filter pengguna
   - ✅ Edit pengguna
   - ✅ Delete pengguna
   - ✅ Pagination

### 5. **Problems Management**
   - ✅ Daftar masalah/absensi
   - ✅ Status update
   - ✅ Filter by status
   - ✅ Delete masalah

### 6. **Advanced Features**
   - ✅ API integration dengan `/api/recognize`
   - ✅ Camera permission handling
   - ✅ Network error handling
   - ✅ Browser compatibility
   - ✅ Performance optimization
   - ✅ Security features

---

## CARA MENGGUNAKAN TEMPLATE INI

1. **Print atau copy tabel di atas** ke Excel/Google Sheets
2. **Isi kolom "Hasil Aktual"** sesuai dengan hasil testing Anda
3. **Pilih Status**: ☑ Pass atau ☐ Fail
4. **Jika Fail, isi Bug ID** dengan format: BUG-001, BUG-002, dst
5. **Isi Tanggal** dengan tanggal pengujian (YYYY-MM-DD)
6. **Dokumentasikan screenshot** di folder terpisah jika ada anomali

---

## CATATAN PENTING

- **Prasyarat**: Pastikan backend API `http://10.0.107.18:8009/api` sudah running
- **Test Account**: Buat beberapa test account untuk test cases
- **Camera**: Pastikan browser diberi permission akses camera
- **Browser**: Test minimal di 3 browser berbeda (Chrome, Firefox, Safari)
- **Network**: Test dengan kondisi internet normal dan buruk

