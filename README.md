# Task Management API

API backend yang tangguh untuk aplikasi manajemen tugas, dibangun dengan Node.js, Express, dan MongoDB. API ini memiliki fitur autentikasi, manajemen tugas, kontrol akses berbasis peran, dan banyak lagi.

## Fitur Utama

- 🏛️ **Arsitektur Berlapis:** (Controller, Service, Repository) untuk kode yang bersih dan terkelola.
- 🔐 **Autentikasi & Otorisasi:** JWT (Access & Refresh Token) dan Role-Based Access Control (Admin, Manager, User).
-  CRUD Task:** Operasi penuh untuk tugas dengan filtering, sorting, dan paginasi.
- 📂 **File Upload:** Kemampuan untuk melampirkan file ke tugas.
- 🛡️ **Keamanan:** Dilengkapi dengan Helmet, Rate Limiting, dan hashing password.
- 🧪 **Teruji Penuh:** Unit test untuk logika bisnis dan Integration test untuk endpoint API.
- ⚙️ **Error Handling Terpusat:** Respons error yang konsisten dan informatif.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB dengan Mongoose ODM
- **Testing:** Jest, Supertest, MongoDB-in-Memory
- **Keamanan:** JWT, BcryptJS, Helmet, Express-Rate-Limit
- **Lainnya:** Multer, Dotenv

## Instalasi & Setup

1.  **Clone repository ini:**
    ```bash
    git clone [https://url-anda.git](https://url-anda.git)
    cd task-management-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`** di root direktori dan isi variabel yang dibutuhkan. Salin dari `.env.example` jika ada.
    ```
    PORT=3000
    NODE_ENV=development
    MONGO_URI=mongodb://...
    JWT_SECRET=...
    JWT_REFRESH_SECRET=...
    JWT_EXPIRES_IN=15m
    JWT_REFRESH_EXPIRES_IN=7d
    ```

## Penggunaan

- **Menjalankan server development (dengan hot-reload):**
  ```bash
  npm run dev
  ```

### Menjalankan server produksi

```bash
npm start
```

## Struktur Proyek

```
src/
  app.js                 # Inisialisasi express, middleware, routes, error handler
  server.js              # Boot server + koneksi DB
  config/                # Konfigurasi env & database
  api/
    routes/              # Route modules (auth, users, tasks)
    controllers/         # Controller per domain
    middlewares/         # auth, authorize, error, upload, validator
    validators/          # express-validator schemas
  services/              # Logika bisnis (auth, task)
  repositories/          # Akses DB (user, task)
  models/                # Skema Mongoose (User, Task)
  utils/                 # Utilitas umum (ErrorHandler)
tests/
  setup.js               # Setup MongoDB Memory untuk test
  unit/                  # Unit tests (service)
  integration/           # Integration tests (API)
seeds/
  seeder.js              # Seeder contoh data user & task
uploads/                 # Penyimpanan file upload (static)
```

## Arsitektur & Alur Request

- `src/server.js` memulai app dan koneksi MongoDB (`src/config/database.js`).
- `src/app.js` memuat middleware global: `express.json()`, `helmet`, `rateLimit`, static `/uploads`, mount `/api` routes, dan `error.middleware`.
- Routing utama: `src/api/routes/index.js` → `/api/auth`, `/api/users`, `/api/tasks`.
- Domain flow: `controller` (HTTP I/O) → `service` (aturan bisnis) → `repository` (DB) → `model` (Mongoose).
- Error ditangani terpusat via `src/api/middlewares/error.middleware.js` dan `utils/errorHandler.js`.

## Endpoint Utama (Base URL: /api)

### Auth
- POST `/auth/register` — Body: `{ email, username, password }`
- POST `/auth/login` — Body: `{ email, password }` → `{ data: { accessToken, refreshToken } }`
- POST `/auth/refresh` — Body: `{ refreshToken }`
- GET `/auth/me` — Butuh Bearer token

### Users
- GET `/users` — Butuh Bearer token, role: Admin/Manager

### Tasks (butuh Bearer token)
- POST `/tasks` — Body minimal: `{ title }`, `assignedTo` diisi dari `req.user.id`
- GET `/tasks` — Query: `status`, `priority`, `sortBy` (mis. `createdAt:desc`), `limit`, `page`
- GET `/tasks/:id`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`
- POST `/tasks/:id/attachments` — Form-Data: `attachment` (file)

## Model Data

### User
- `username` (unique, required)
- `email` (unique, required, lowercase, indexed)
- `password` (hashed)
- `role` (User|Manager|Admin)
- `refreshToken`

### Task
- `title` (required)
- `description`
- `status` (To Do|In Progress|Done)
- `priority` (Low|Medium|High)
- `dueDate`
- `assignedTo` (ref User)
- `attachments` (path string)

## Upload File

- Endpoint: `POST /api/tasks/:id/attachments` dengan `multipart/form-data` field `attachment`.
- Batas ukuran: 5MB. Tipe: `jpeg|jpg|png|gif`.
- File disimpan di folder `uploads/` dan dilayani via `/uploads` static.

## Testing

- Jalankan test: `npm test`
- Unit: `tests/unit/task.service.test.js` (create/list/get/update/delete service)
- Integration: `tests/integration/task.api.test.js` (endpoint tasks + auth)
- Setup: `tests/setup.js` (MongoDB in-memory)

## Seeding Data

1. Pastikan `.env` memiliki `MONGO_URI` yang valid.
2. Jalankan: `npm run seed`
3. Tersedia user `admin` dan `user` + contoh task.

## Keamanan

- Helmet untuk header keamanan.
- Rate limit: 100 request / 15 menit per IP di prefix `/api`.
- Password di-hash (bcrypt). JWT via `Authorization: Bearer <token>`.

## FAQ

- Ubah durasi token: `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`.
- Ganti penyimpanan upload: edit `src/api/middlewares/upload.middleware.js`.
- Tambah filter task: perluas `repositories/task.repository.js` bagian `filter`.