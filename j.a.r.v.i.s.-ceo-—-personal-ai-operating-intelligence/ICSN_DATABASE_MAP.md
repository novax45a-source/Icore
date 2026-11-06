# ICSN — Database Map & Schema Topology
**Database Engine:** PostgreSQL 15 on Supabase  
**Total Tables Discovered:** 3  
**RLS Enforcement:** 100% Active  

---

## 1. Table: `students`
- **Rows:** ~1,240
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `user_id` (uuid, NOT NULL, references `auth.users`)
  - `full_name` (text, NOT NULL)
  - `target_country` (text)
  - `gpa` (numeric)
- **RLS Policies:**
  - `students_select_own`: `auth.uid() = user_id`
  - `students_update_own`: `auth.uid() = user_id`
  - `counselor_select_assigned`: Assigned counselor role check

---

## 2. Table: `universities`
- **Rows:** ~450
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `name` (text, NOT NULL)
  - `country` (text, NOT NULL)
  - `world_rank` (integer)
- **RLS Policies:**
  - `universities_public_read`: True for authenticated and public

---

## 3. Table: `scholarships`
- **Rows:** ~180
- **Columns:**
  - `id` (uuid, PRIMARY KEY)
  - `title` (text, NOT NULL)
  - `coverage_amount` (numeric, NOT NULL)
  - `deadline` (date, NOT NULL)
- **RLS Policies:**
  - `scholarships_public_read`: True for all users
