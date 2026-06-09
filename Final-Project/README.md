# CST Internship Portal

A cross-platform mobile application for managing student internships at the College of Science and Technology, Bhutan.

## Features

### Student Features
- **Home Page** — Landing page with organisation showcase and Login button
- **Student Dashboard** — Stats overview (logbooks, attendance, feedbacks)
- **Submit Logbooks** — Daily work entry (activities, skills, challenges)
- **Mark Attendance** — Check-in/check-out with "Now" quick fill
- **View Feedbacks** — See supervisor reviews with rating, status, and comments
- **Monthly Reflection** — Submit monthly progress summaries
- **Push Notifications** — Receive alerts when supervisor reviews a logbook

### Supervisor Features
- **Supervisor Dashboard** — Overview of assigned students and pending reviews
- **Review Logbooks** — View all logbooks with status filter (pending/reviewed/approved/needs revision)
- **Give Feedback** — Submit star rating (1–5), status, and detailed written review
- **Push Notifications** — Notify students automatically on feedback submission

### Push Notifications
- Uses `expo-notifications` for device push tokens
- Stores tokens in Supabase `push_tokens` table
- Sends push via Expo Push API when supervisor submits a review
- Notification log stored in `notifications` table

---

## Tech Stack
- **Frontend**: React Native + Expo (SDK 54)
- **Routing**: Expo Router (file-based)
- **Backend**: Supabase (PostgreSQL + Auth + Row-Level Security)
- **Notifications**: expo-notifications + Expo Push API

---

## Setup

### 1. Clone and Install
```bash
cd internship
npm install
```

### 2. Configure Supabase
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database
Run `supabase_tables.sql` in your Supabase SQL Editor. This creates:
- `user_roles` — student/supervisor role assignment
- `student_profiles` — student info with supervisor link
- `supervisor_profiles` — supervisor info
- `logbooks` — daily work logs
- `logbook_reviews` — supervisor feedback
- `attendance` — daily attendance records
- `monthly_reflections` — monthly progress
- `push_tokens` — device push tokens
- `notifications` — notification log

### 4. Create Users and Assign Roles
In Supabase Auth, create user accounts. Then in SQL Editor:
```sql
-- Assign student role
INSERT INTO public.user_roles (user_id, role)
VALUES ('STUDENT_USER_UUID', 'student');

-- Assign supervisor role
INSERT INTO public.user_roles (user_id, role)
VALUES ('SUPERVISOR_USER_UUID', 'supervisor');

-- Create student profile and link to supervisor
INSERT INTO public.student_profiles (user_id, name, organization, supervisor_id)
VALUES ('STUDENT_UUID', 'Student Name', 'Company Name', 'SUPERVISOR_UUID');

-- Create supervisor profile
INSERT INTO public.supervisor_profiles (user_id, name, department)
VALUES ('SUPERVISOR_UUID', 'Supervisor Name', 'IT Department');
```

### 5. Run the App
```bash
npx expo start
```

---

## App Flow

```
Home Page (index)
    └── Login Button
         └── Login Screen
              ├── Student Role → Student Dashboard
              │    ├── Submit Logbook
              │    ├── Mark Attendance
              │    ├── View Feedbacks (from supervisors)
              │    ├── Monthly Reflection
              │    └── Notifications
              └── Supervisor Role → Supervisor Dashboard
                   ├── Review Logbooks (all assigned students)
                   │    └── Submit Feedback (rating + review + status)
                   └── Notifications
```

---

## Push Notifications Setup (Production)

For real push notifications in production:
1. Build with EAS: `eas build --platform android`
2. Expo Push API handles delivery automatically
3. The `use-notifications.ts` hook handles registration and sending

For development with Expo Go, push notifications to physical devices work if you have an Expo account configured.

---

## Project Structure

```
internship/
├── app/
│   ├── _layout.tsx              # Root layout (all screen routes)
│   ├── index.tsx                # Home page
│   ├── login.tsx                # Login (role-based routing)
│   ├── student-home.tsx         # Student dashboard
│   ├── logbook.tsx              # Submit logbook
│   ├── attendance.tsx           # Mark attendance
│   ├── monthly-reflection.tsx   # Monthly reflection
│   ├── feedbacks.tsx            # View supervisor feedbacks
│   ├── supervisor-home.tsx      # Supervisor dashboard
│   ├── supervisor-logbooks.tsx  # Review logbook list
│   ├── supervisor-feedback.tsx  # Give feedback form
│   └── notifications.tsx        # Notifications center
├── hooks/
│   ├── use-notifications.ts     # Push notification logic
│   └── use-auth.ts              # Auth + role resolution
├── supabase.js                  # Supabase client
├── supabase_tables.sql          # Complete DB schema
└── public/images/               # Organisation logos
```
