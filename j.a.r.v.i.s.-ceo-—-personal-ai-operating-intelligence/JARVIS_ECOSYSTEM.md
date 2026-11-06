# J.A.R.V.I.S. CEO — Ecosystem Control & Multi-Platform Governance
**Document ID:** `JARVIS-ECOSYSTEM-V2.0`  
**Governance Scope:** ICSN (International Career & Study Navigator) & ENVO (Education Network & Virtual Organization)  
**Security Boundary:** Section 7.4 Data Isolation & Section 6 Level 1-4 Database Guardrails  

---

## 1. Ecosystem Overview

JARVIS CEO serves as the central operational intelligence for the Founder's growing technology portfolio. It manages connected platforms without assuming pre-existing knowledge—onboarding them through a controlled **Platform Connection Wizard** and **Platform Discovery Engine**.

```
+-----------------------------------------------------------------------------------+
|                            J.A.R.V.I.S. CEO CORE                                  |
|            (Multi-Agent Squads + Hybrid Ollama/Cloud + Memory Partitions)         |
+-----------------------------------------------------------------------------------+
                  |                                             |
    [Section 7.4 Data Isolation]                   [Section 7.4 Data Isolation]
                  v                                             v
+-----------------------------------+         +------------------------------------+
|          ICSN PLATFORM            |         |            ENVO PLATFORM           |
|  - University & Scholarship DB    |         |  - Learning Centers & Teachers     |
|  - Student Career Guidance        |         |  - Course Delivery & Quizzes       |
|  - PostgreSQL (Supabase pooler)   |         |  - Next.js 15 App Router + FastAPI |
|  - Embedded: ICSN Navigator AI    |         |  - Embedded: ENVO Mentor AI        |
+-----------------------------------+         +------------------------------------+
```

---

## 2. Platform Discovery Status

| Platform | Repository Path | Database Stack | RLS Enforced | Assistant Status | Discovered Schemas |
|:---|:---|:---|:---:|:---:|:---:|
| **ICSN** | `C:\Users\acer\projects\icsn-platform` | PostgreSQL (Supabase EU) | Yes (100%) | `ICSN-GUIDE-v1` (Active) | 3 tables (1,870 rows) |
| **ENVO** | `C:\Users\acer\projects\envo-network` | PostgreSQL (Supabase AP) | Yes (100%) | `ENVO-MENTOR-v1` (Active) | 3 tables (5,278 rows) |

---

## 3. Database Operation Levels (Section 6)

1. **LEVEL 1 — READ**: Autonomous schema queries, row counts, performance metrics.
2. **LEVEL 2 — PREPARE**: Migration drafting, schema diff analysis, zero-impact simulation.
3. **LEVEL 3 — TEST**: Staging execution, regression tests, verification.
4. **LEVEL 4 — PRODUCTION**: Explicit Founder approval required. Destructive changes (`DROP`, `DELETE`, `TRUNCATE`) strictly locked behind backup checkpoints and rollback verification.

---

## 4. Assistant Isolation Rules (Section 7.4)

1. **ICSN Navigator AI** operates strictly within ICSN domain knowledge (Universities, Scholarships, SOP assistance). It has zero access to ENVO confidential records or Founder JARVIS root credentials.
2. **ENVO Mentor AI** operates strictly within learning center and teacher pedagogical scopes. It cannot query ICSN student records.
3. Neither platform assistant can elevate privileges or run OS-level commands on the host machine.
