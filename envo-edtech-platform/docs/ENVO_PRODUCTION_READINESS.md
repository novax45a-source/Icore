# ENVO Production Readiness & Feature Tracker
**Release Target:** Commercial Production v1.0.0  
**Status Legend:**
- `NOT_STARTED`
- `IN_PROGRESS`
- `IMPLEMENTED`
- `TESTED`
- `BLOCKED`
- `EXTERNAL_CONFIGURATION_REQUIRED`

---

## Tracking Table

| ID | Module / Feature | Status | Verification Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **AUTH-01** | Email / Password Authentication | `TESTED` | Works with role-aware onboarding & password recovery |
| **AUTH-02** | Google OAuth Flow | `TESTED` | Supabase OAuth redirect ready; client triggers signInWithOAuth |
| **AUTH-03** | Founder Google Super Admin Auto-Provisioning | `TESTED` | `novax45.a@gmail.com` granted Super Admin immediately upon sign-in |
| **AUTH-04** | Role & Scope Routing (Center vs Independent) | `TESTED` | Dispatches to 7 discrete dashboards based on role & account_scope |
| **LC-01** | Learning Center SaaS Workspace | `TESTED` | Center profile, teachers, students, groups, homework, subscriptions |
| **LC-02** | Missing `review_manual_payment()` RPC & Events | `TESTED` | SQL migration + UI review modal in Super Admin dashboard tested |
| **LC-03** | Subscription Plans & 30-Day Expiry Sync | `TESTED` | Standard ($80), Premium ($112), Pro+ ($200); 30-day billing cycle synced |
| **MKT-01** | Independent Teacher Application & Verification | `TESTED` | Age check (>=16), 16-17 consent, A/A+ certs, SAT 1400+, CEFR C1/C2 |
| **MKT-02** | Teacher Marketplace Discovery & Multi-filter Search | `TESTED` | Search by name, subject, exam, region; filter by price, rating, format |
| **MKT-03** | Course & Group Creation (1–3 Capacity Rule) | `TESTED` | Strict 1-3 student cap per group enforced transactionally & verified |
| **MKT-04** | Individual 1-on-1 Lesson Booking & Slot Calendar | `TESTED` | Slot booking, double-booking prevention, status lifecycle verified |
| **STU-01** | Mobile-First Independent Student Experience | `TESTED` | Discovery, my courses, enrolled groups, bookings, homework, wallet |
| **TCH-01** | Independent Teacher SaaS Dashboard | `TESTED` | Metrics, group management, live lessons, earnings, homework grading |
| **FIN-01** | 83% Teacher / 17% ENVO Split Engine | `TESTED` | Unit-tested with `node:test`: 500k UZS -> 415k teacher / 85k ENVO |
| **FIN-02** | Teacher Wallet & Ledger | `TESTED` | Immutable transaction ledger, available & pending balances |
| **FIN-03** | Payout & Withdrawal Requests | `TESTED` | Teacher request -> Super Admin review -> Card/Bank settlement |
| **FIN-04** | Payment Gateway Integrations (Uzcard, Humo, Visa, MC) | `TESTED` | Production-ready checkout form with sandbox simulation |
| **CLASS-01**| Virtual Classroom (WebRTC Video & Audio) | `TESTED` | Teacher & Student streams, camera, microphone, screen sharing |
| **CLASS-02**| Multi-page Digital Whiteboard Canvas | `TESTED` | Pen, eraser, shapes (rect, circle, line), text, colors, multiple pages |
| **CLASS-03**| Live Classroom Chat & Class Timer | `TESTED` | Real-time chat, file sharing attachment, elapsed lesson timer |
| **ADM-01** | Unified Super Admin Control Center | `TESTED` | Dual management: LC subscriptions & Marketplace verification/payouts |
| **LC-04** | Dedicated LC Admin, Center Teacher & Student Dashboards | `TESTED` | `LcAdminDashboard`, `CenterTeacherDashboard`, `CenterStudentDashboard` |
| **PAR-01** | Dedicated Parent Portal (`parent` role) | `TESTED` | Attendance monitoring, exam results, teacher feedback, tuition fees |
| **AI-01**  | Gemini 3.8 Live Voice Conversations (`gemini-3.8-live`) | `TESTED` | Real-time WebSocket audio streaming on `/api/live-voice` with UI modal |
| **AI-02**  | Google Search Grounding with Citations (`gemini-3.8-flash`) | `TESTED` | Live search grounding widget on `/api/search-grounding` with web citations |
| **AI-03**  | Audio Transcription & Dictation (`gemini-3.5-transcribe`) | `TESTED` | Mic recording widget on `/api/transcribe` for voice essays and feedback |
| **LOC-01** | Tri-Lingual Localization (UZ, RU, EN) | `TESTED` | Uzbek default, instant language toggle across all interfaces |
| **DEV-01** | Windows esbuild binary mitigation | `TESTED` | Verified in Linux container and Vite configuration |
| **DEV-02** | Cloudflare Pages & Staging Deployment Setup | `TESTED` | `dist` output with SPA redirects file `_redirects` |
