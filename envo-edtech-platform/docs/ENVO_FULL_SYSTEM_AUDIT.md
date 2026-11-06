# ENVO Full System Architecture & Security Audit
**Document version:** 1.0.0-PROD  
**Platform Reference:** axxkrokrtyryjugwtdna (Supabase PostgreSQL)  
**Date:** November 2026  
**Auditor:** Principal CTO & DevOps Lead  

---

## 1. Executive Summary & Dual Business Model Matrix

ENVO is an EdTech hybrid platform operating two distinct commercial models under a single unified architecture:

| Dimension | Business Model A: Learning Center SaaS | Business Model B: Independent Teacher Marketplace |
| :--- | :--- | :--- |
| **Target Customers** | Educational centers, academies, private schools (`envo_centers`) | Independent freelance educators & private students across Uzbekistan |
| **Monetization** | Fixed tier SaaS subscription ($80, $112, $200 / interval) | 17% commission on lessons; Teacher retains 83% of gross lesson fee |
| **Accounts & Scope** | `center_id` linked; Roles: `lc_admin`, `teacher`, `student`, `parent` | `center_id = NULL`; `account_scope = 'independent'`; `teacher`, `student` |
| **Group Capacity** | Flexible center class sizes (10-30 students per group) | **Strict 1–3 students per group** (enforced transactionally in DB) |
| **Payment Ledger** | `envo_payments` -> `center_subscriptions` | `marketplace_payments` -> `teacher_wallets` -> `teacher_payout_requests` |
| **Classroom Mode** | Center scheduling & physical/online group tracking | Integrated real-time WebRTC Virtual Classroom + Interactive Whiteboard |
| **Admin Control** | Center Admin workspace (`CenterWorkspace.tsx`) | Independent Teacher SaaS Workspace + Global Super Admin oversight |

---

## 2. Supabase Live Database Inspection & Gap Analysis

### 2.1 Public Tables Status
1. `center_subscriptions` - Exists with RLS.
2. `centers` / `envo_centers` - Both exist. `envo_centers` is the primary FK target used by all frontend dashboards and memberships.
3. `envo_groups` - Exists. Represents center classes.
4. `envo_homework` & `envo_submissions` - Exist with RLS.
5. `envo_payments` - Exists, but currently lacks:
   - `currency` (defaults to 'UZS' or 'USD')
   - `requested_by` (UUID referencing auth.users)
   - `reviewed_by` (UUID referencing auth.users)
   - `rejection_reason` (TEXT)
6. `envo_students` - Exists. Links students to centers.
7. `super_admins` - Exists with RLS.
8. `user_roles` - Exists (`user_id` is PK).

### 2.2 Missing RPC Functions & Payment Workflow Defect
- **Present:** `request_payment()`, `confirm_payment(uuid, integer)`.
- **Missing in live DB:** `review_manual_payment(payment_id, decision, reason, reviewer_id)`.
- **Missing Table:** `envo_payment_events` (immutable audit trail of payment status transitions).
- **Discrepancy Audit (27 vs 30 days):**
  - Frontend (`src/lib/plans.ts`) previously stated "27 days" for billing cycles.
  - Live PostgreSQL RPC `confirm_payment()` extends subscription expiry by `INTERVAL '30 days'` per period count.
  - **Decision:** As instructed, we preserve the live 30-day interval in the database to prevent customer contract violation, and synchronize the UI display and tooltips to clearly reflect 30-day calendar intervals.

---

## 3. Independent Marketplace Architecture (Phase 4-7)

### 3.1 Financial Engine (83% / 17% Rule)
```
Gross Student Payment (e.g., 500,000 UZS)
  ├── 83% Teacher Share: 415,000 UZS (credited to teacher_wallets.available_balance)
  └── 17% ENVO Commission: 85,000 UZS (credited to platform fee revenue account)
```
- Processing fees from payment providers (Uzcard, Humo, Visa, Mastercard) are logged separately in `provider_fee` column rather than altering the contract 83%/17% split.
- Wallet balances are protected by database triggers and immutable ledger rows in `teacher_wallet_transactions`. Direct updates to `teacher_wallets` from frontend are blocked by RLS.

### 3.2 Invariant: 1–3 Students Per Marketplace Group
- Enforced in `marketplace_enrollments` via:
  1. Trigger `check_group_capacity()` checking `COUNT(*) < 3` with `FOR UPDATE` lock on `marketplace_groups`.
  2. Database constraint and transactional stored procedure `enroll_in_marketplace_group(student_id, group_id)`.
  3. Zero race-conditions on concurrent student checkout.

### 3.3 Teacher Verification & Age Rules
- Minimum age: **16 years old**.
- Applicants aged 16–17 must upload guardian consent documentation. Under 16 are blocked.
- Uzbekistan State Subjects: Ona tili, Matematika, Tarix, Kimyo, Biologiya, Fizika require verified A/A+ certificates.
- Exam Preparation: CEFR C1/C2, IELTS, TOEFL, SAT (minimum verified score 1400+).

---

## 4. Founder Google OAuth & Security Specification
- **Official Account:** `novax45.a@gmail.com`
- When this user authenticates via Google OAuth, Supabase auth trigger / application session resolution immediately:
  1. Verifies verified email via JWT claim `email_verified = true`.
  2. Ensures entry exists in `super_admins` table.
  3. Assigns role `super_admin` in `user_roles`.
  4. Grants unrestricted oversight over both Learning Center SaaS and Teacher Marketplace modules.

---

## 5. Windows Local Build Defect Analysis (`@esbuild/win32-x64`)
- **Reported Error:** `An Application Control policy has blocked this file. Malicious binary reputation: node_modules/@esbuild/win32-x64/esbuild.exe` on Windows 11 Node v24.21.0.
- **Root Cause:** Windows Defender SmartScreen / Application Control blocks newly extracted unfamiliar native executable hashes that lack digital enterprise code-signing certificates in local user cache (`C:\Users\acer\AppData\Local\Temp` or deep `node_modules`).
- **Remediation Strategy:**
  1. Use platform-independent build execution or verified pure JS fallback / Vite configured with safe bundling.
  2. Verified build succeeds seamlessly in Linux container CI/Cloudflare Pages build environments (`npm run build`).
  3. No security policies need to be disabled.
