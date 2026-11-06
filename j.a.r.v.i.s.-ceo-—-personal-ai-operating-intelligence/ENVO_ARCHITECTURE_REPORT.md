# ENVO — Platform Architecture & Discovery Report
**Platform Name:** Education Network & Virtual Organization (ENVO)  
**Report ID:** `ENVO-ARCH-2026-v1.0`  
**Discovered Repo:** `C:\Users\acer\projects\envo-network`  
**Database:** PostgreSQL 15 on AWS Supabase (Southeast Asia pooler)  

---

## 1. Technical Stack Discovered

- **Frontend:** Next.js 15 App Router, React Server Components, Tailwind CSS, Framer Motion.
- **Backend Services:** Python FastAPI microservices + Supabase Postgres Database.
- **Authentication:** OAuth 2.0 (Google, GitHub) + Supabase Auth sessions.
- **Business Model:** Multi-tenant architecture preserving independent learning center licenses and freelance teacher revenue sharing.
- **Embedded AI:** `ENVO Mentor AI` (model: `qwen2.5-coder:3b`, prompt: lesson drafting, interactive quiz generation, and concept explanations).

---

## 2. Core Modules & Functionality

1. **Learning Center Portal:** Center capacity management, course schedules, multi-teacher roster.
2. **Teacher Workshop:** Curriculum creator, automatic grading, quiz synthesis, student feedback loops.
3. **Student LMS:** Video lectures, interactive assignments, progress bars, certificate issuance.
4. **Billing & Subscriptions:** Tiered seat licenses for centers and independent instructor payouts.

---

## 3. Discovered Technical Issues & Recommendations

1. **Schedule Conflict Constraint:** Teachers can currently be scheduled for overlapping sessions in different centers.
   - *Recommendation:* Prepare an `EXCLUDE USING gist` constraint on session time ranges.
2. **Pagination on Enrollments:** Batch enrollment queries pull unrestricted record sets.
   - *Recommendation:* Enforce cursor-based pagination.
