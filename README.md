# Employee Dashboard - Sistem Manajemen Karyawan

Sistem manajemen karyawan fullstack yang dibangun dengan Next.js, Tailwind CSS, dan SQLite/MySQL. Aplikasi ini menyediakan dashboard role-based untuk admin dan karyawan dengan fitur registrasi yang memerlukan persetujuan, sistem tugas dengan notifikasi, dan interface yang responsif.

## 🚀 Fitur Utama

### 🔐 Sistem Autentikasi & Otorisasi
- **Login/Logout** dengan NextAuth.js
- **Role-based Access Control** (Admin & Karyawan)
- **Registrasi Karyawan** dengan form lengkap
- **Persetujuan Registrasi** oleh Admin
- **Session Management** yang aman

### 👨‍💼 Dashboard Admin
- **Kelola Karyawan**: Lihat, setujui, tolak registrasi karyawan
- **Kelola Tugas**: Buat, edit, delete tugas untuk karyawan
- **Sistem Notifikasi**: Notifikasi real-time untuk aktivitas
- **Statistics Dashboard**: Overview data karyawan dan tugas
- **Penugasan Fleksibel**: Tugas untuk karyawan spesifik atau semua karyawan

### 👩‍💻 Dashboard Karyawan
- **Tugas Saya**: Lihat dan kelola tugas yang diberikan
- **Pengumpulan Tugas**: Upload dokumen dan deskripsi hasil kerja
- **Status Tracking**: Belum dikerjakan, sedang dikerjakan, selesai
- **Notifikasi**: Pemberitahuan tugas baru dan update
- **Progress Monitoring**: Visualisasi progress tugas

### 📋 Sistem Tugas
- **3 Status Tugas**: Belum Dikerjakan, Sedang Dikerjakan, Selesai
- **Deadline Management**: Set dan track deadline tugas
- **File Upload**: Link dokumen Google Drive, Dropbox, dll
- **Task Assignment**: Individual atau grup assignment
- **Progress Tracking**: Real-time status update

## 🛠 Teknologi yang Digunakan

### Frontend
- **Next.js 15** - React framework dengan App Router
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **TypeScript** - Type-safe JavaScript

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database ORM dengan type safety
- **NextAuth.js** - Authentication library
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Database
- **SQLite** (Development) / **MySQL** (Production)
- **Prisma Schema** - Database modeling

## 📊 Database Schema

### Users Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- fullName: String
- address: String
- gender: Enum (MALE, FEMALE)
- nikKtp: String (16 digits)
- phoneNumber: String
- bankAccountNumber: String (Optional)
- ewalletNumber: String (Optional)
- role: Enum (ADMIN, EMPLOYEE)
- status: Enum (PENDING, APPROVED, REJECTED)
- createdAt: DateTime
- updatedAt: DateTime
```

### Tasks Table
```sql
- id: String (Primary Key)
- title: String
- description: String
- dueDate: DateTime (Optional)
- status: Enum (NOT_STARTED, IN_PROGRESS, COMPLETED)
- assignment: Enum (SPECIFIC, ALL_EMPLOYEES)
- assigneeId: String (Optional, FK to Users)
- createdById: String (FK to Users)
- createdAt: DateTime
- updatedAt: DateTime
```

### TaskSubmissions Table
```sql
- id: String (Primary Key)
- taskId: String (FK to Tasks)
- userId: String (FK to Users)
- description: String (Optional)
- documentUrl: String (Optional)
- submittedAt: DateTime
- updatedAt: DateTime
```

### Notifications Table
```sql
- id: String (Primary Key)
- userId: String (FK to Users)
- taskId: String (Optional, FK to Tasks)
- title: String
- message: String
- isRead: Boolean
- createdAt: DateTime
```

## 🚦 Instalasi & Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd employee-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NODE_ENV="development"
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run Database Migration
npx prisma migrate dev --name init

# Seed Database dengan Data Demo
npm run db:seed
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 👤 Demo Accounts

Setelah menjalankan seeding, gunakan akun berikut untuk testing:

### Admin Account
- **Email**: admin@demo.com
- **Password**: password123
- **Role**: Administrator

### Employee Account
- **Email**: employee@demo.com
- **Password**: password123
- **Role**: Karyawan (Approved)

### Pending Employee Account
- **Email**: pending@demo.com
- **Password**: password123
- **Role**: Karyawan (Pending Approval)

## 📱 Fitur Responsif

Aplikasi dioptimalkan untuk berbagai ukuran layar:
- **Desktop** (1024px+): Full sidebar navigation
- **Tablet** (768px-1023px): Collapsible sidebar
- **Mobile** (320px-767px): Mobile-first navigation

## 🔧 Scripts Available

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build aplikasi untuk production
npm run start        # Jalankan production server

# Database
npm run db:seed      # Seed database dengan data demo

# Linting
npm run lint         # Run ESLint
```

## 📋 Form Registrasi Karyawan

Form registrasi mencakup field-field berikut sesuai requirement:

### Data Pribadi
- **Nama Lengkap** (Required)
- **Email** (Required, Unique)
- **Alamat Lengkap** (Required)
- **Jenis Kelamin** (Required): Laki-laki/Perempuan
- **NIK KTP** (Required): 16 digit

### Kontak
- **Nomor HP** (Required): Format 08xxxxxxxxxx

### Informasi Pembayaran Gaji
- **Nomor Rekening Bank** (Optional)
- **Nomor E-Wallet** (Optional): OVO, GoPay, DANA, dll

### Keamanan
- **Password** (Required): Minimal 6 karakter
- **Konfirmasi Password** (Required): Harus sama dengan password

## 🎯 Workflow Sistem

### 1. Registrasi Karyawan
1. Karyawan mengisi form registrasi lengkap
2. Data tersimpan dengan status "PENDING"
3. Admin mendapat notifikasi registrasi baru
4. Admin review dan approve/reject registrasi
5. Karyawan mendapat notifikasi hasil approval

### 2. Sistem Tugas
1. Admin membuat tugas baru (individual/grup)
2. Karyawan mendapat notifikasi tugas baru
3. Karyawan mengubah status: Belum → Sedang → Selesai
4. Karyawan mengumpulkan hasil kerja (deskripsi + link dokumen)
5. Admin mendapat notifikasi pengumpulan tugas

### 3. Notifikasi Real-time
- Tugas baru diberikan
- Status tugas berubah
- Tugas dikumpulkan
- Registrasi karyawan baru
- Approval/rejection registrasi

## 🔒 Keamanan

### Authentication & Authorization
- Password di-hash menggunakan bcryptjs
- Session-based authentication dengan NextAuth.js
- Role-based access control
- Protected routes dengan middleware
- CSRF protection

### Data Validation
- Server-side validation dengan Zod
- Client-side form validation
- SQL injection protection dengan Prisma ORM
- XSS protection dengan React

## 🚀 Deployment

### Untuk Production dengan MySQL:

1. **Update Environment Variables**:
```env
DATABASE_URL="mysql://username:password@host:port/database_name"
NEXTAUTH_URL="https://yourdomain.com"
```

2. **Update Prisma Schema**:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

3. **Build & Deploy**:
```bash
npm run build
npm run start
```

## 📈 Monitoring & Analytics

### Performance Metrics
- Page load times
- API response times
- Database query performance
- User engagement metrics

### Error Tracking
- Client-side error logging
- Server-side error handling
- Database connection monitoring
- Authentication failure tracking

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail lengkap.

## 🆘 Support

Jika mengalami masalah atau memiliki pertanyaan:
1. Cek dokumentasi ini
2. Lihat issues yang sudah ada
3. Buat issue baru dengan detail lengkap
4. Hubungi tim development

---

**Dibuat dengan ❤️ menggunakan Next.js, Tailwind CSS, dan Prisma**

#   v a l p r o l t a l  
 