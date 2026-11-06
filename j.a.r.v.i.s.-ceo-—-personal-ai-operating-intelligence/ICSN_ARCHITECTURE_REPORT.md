# ICSN — Platform Architecture & Discovery Report
**Platform Name:** International Career & Study Navigator (ICSN)  
**Report ID:** `ICSN-ARCH-2026-v1.0`  
**Discovered Repo:** `C:\Users\acer\projects\icsn-platform`  
**Database:** PostgreSQL 15 on AWS Supabase (EU Central pooler)  

---

## 1. Technical Stack Discovered

- **Frontend:** React 19 SPA, TypeScript, Tailwind CSS, Lucide icons, Vite.
- **Backend Services:** Supabase Edge Functions (Deno runtime) + REST APIs.
- **Authentication:** Supabase Auth with JWT and MFA enforcement.
- **Security:** 100% Row-Level Security (RLS) active on all tables.
- **Embedded AI:** `ICSN Navigator AI` (model: `qwen3:4b`, prompt: student counseling and university matching).

---

## 2. Core Modules & Functionality

1. **Student Dashboard:** Progress tracking, target country selection, GPA calculators, portfolio uploads.
2. **University Explorer:** World ranking directory, country visa criteria, acceptance rate estimations.
3. **Scholarship Matcher:** 180+ global grants with deadline reminders and coverage calculators.
4. **Statement of Purpose (SOP) Studio:** AI-guided structuring of student application letters.

---

## 3. Discovered Technical Issues & Recommendations

1. **Missing Index:** `scholarships.deadline` lacks a B-tree index, causing slow filters during peak admission months.
   - *Recommendation:* Prepare migration `CREATE INDEX idx_scholarships_deadline ON scholarships(deadline ASC);` under Level 2/3.
2. **Public Endpoint Rate Limiting:** University search endpoint lacks client throttling.
   - *Recommendation:* Implement token-bucket middleware in Edge Functions.
