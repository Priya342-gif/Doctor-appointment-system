# DocBook - Doctor Appointment Booking System

A full-stack MERN application for booking doctor appointments with role-based access for Patients, Doctors, and Admins.

---

## Tech Stack

**Frontend:** React.js, React Router v6, Axios, Tailwind CSS, React Hook Form, React Toastify, React Icons  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Cloudinary, Nodemailer

---

## Features

### Patient
- Register / Login
- Browse & search doctors (by name, specialization, fee, experience, availability)
- View doctor profiles and time slots
- Book, view, and cancel appointments
- Update profile & profile image

### Doctor
- Login with doctor credentials
- View today's appointments
- Accept / Reject / Complete appointments
- Update profile, availability, and time slots

### Admin
- Dashboard with statistics (doctors, patients, appointments)
- Add / Edit / Delete doctors
- View all patients & toggle active status
- View & manage all appointments

---

## Project Structure

```
doctor-appointment-system/
├── backend/
│   ├── config/          # DB, Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error, validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── utils/           # Token, email, seed utilities
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context
│       ├── hooks/       # Custom hooks
│       ├── layouts/     # Navbar, Footer, DashboardLayout
│       ├── pages/       # All page components
│       └── services/    # API service functions
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications, optional)

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

### 2. Configure Environment

```bash
# In /backend, copy .env.example to .env
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor_appointment
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@docbook.com

CLIENT_URL=http://localhost:3000
```

---

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@docbook.com      | admin123    |
| Patient | john@example.com       | patient123  |
| Patient | sarah@example.com      | patient123  |
| Doctor  | emily@docbook.com      | doctor123   |
| + 5 more doctors with various specializations |

---

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev    # runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm start      # runs on http://localhost:3000
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register patient |
| POST | /api/auth/login | Login (all roles) |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/update-password | Update password |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | List doctors (with filters) |
| GET | /api/doctors/:id | Get doctor by ID |
| GET | /api/doctors/specializations | Get all specializations |
| GET | /api/doctors/profile/me | Doctor own profile |
| PUT | /api/doctors/profile/me | Update doctor profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/appointments | Book appointment |
| GET | /api/appointments/patient | Patient's appointments |
| GET | /api/appointments/doctor | Doctor's appointments |
| GET | /api/appointments/doctor/today | Today's appointments |
| GET | /api/appointments | All appointments (admin) |
| PUT | /api/appointments/:id | Update status |
| DELETE | /api/appointments/:id | Cancel appointment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard statistics |
| GET | /api/admin/doctors | All doctors |
| POST | /api/admin/doctors | Add doctor |
| PUT | /api/admin/doctors/:id | Edit doctor |
| DELETE | /api/admin/doctors/:id | Delete doctor |
| DELETE | /api/admin/users/:id | Delete user |
| PUT | /api/admin/users/:id/toggle | Toggle user status |

---

## Demo Credentials

After running seed:

- **Admin:** admin@docbook.com / admin123
- **Patient:** john@example.com / patient123  
- **Doctor:** emily@docbook.com / doctor123

---

## Notes

- Email notifications are optional — the app works without email configured
- Image uploads require a valid Cloudinary account
- For Cloudinary free tier: 25GB storage / 25GB bandwidth per month
