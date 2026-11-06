# ENVO — Database Map & Schema Topology
**Database Engine:** PostgreSQL 15 on Supabase  
**Total Tables Discovered:** 3  
**RLS Enforcement:** 100% Active  

---

## 1. Table: `learning_centers`
- **Rows:** ~68
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `name` (text, NOT NULL)
  - `license_tier` (text, NOT NULL)
  - `capacity` (integer, NOT NULL)
- **RLS Policies:**
  - `centers_admin_full`: Center administrator access
  - `centers_public_view`: Public profile directory

---

## 2. Table: `courses`
- **Rows:** ~320
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `center_id` (uuid, FOREIGN KEY -> `learning_centers.id`)
  - `title` (text, NOT NULL)
  - `teacher_id` (uuid, NOT NULL, references `auth.users`)
- **RLS Policies:**
  - `courses_teacher_manage`: Teacher can manage their courses
  - `courses_enrolled_view`: Enrolled students can view curriculum

---

## 3. Table: `enrollments`
- **Rows:** ~4,890
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `student_id` (uuid, NOT NULL)
  - `course_id` (uuid, FOREIGN KEY -> `courses.id`)
  - `progress_percent` (integer, DEFAULT 0)
- **RLS Policies:**
  - `enrollments_student_own`: Student views own enrollments
  - `enrollments_teacher_roster`: Teacher views class enrollments
