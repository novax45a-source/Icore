import { KnowledgeGuide } from '../types';

export const KNOWLEDGE_GUIDES_DATA: KnowledgeGuide[] = [
  {
    id: 'guide_de_visa_block',
    title: 'The Complete German Student Visa & Blocked Account (Sperrkonto) Guide',
    slug: 'germany-student-visa-blocked-account',
    category: 'Visa & Immigration',
    summary:
      'Step-by-step verified instructions on setting up a German blocked bank account (€11,904), choosing statutory health insurance, and booking your embassy appointment.',
    contentMarkdown: `### 1. What is a German Blocked Account (Sperrkonto)?
The German Federal Foreign Office requires international students from non-EU countries to demonstrate adequate financial resources for their studies. For the 2026/2027 academic year, the standard statutory requirement is **€11,904 per year** (equivalent to €992 per month).

### 2. Officially Authorized Providers
You can open your blocked account digitally before leaving your home country through German Federal Foreign Office-approved providers:
- **Expatrio** (Fully digital, integrated with TK statutory health insurance)
- **Fintiba** (Digital onboarding, certified by BaFin)
- **Coracle** (All-in-one prime package)
- **Deutsche Bank** (Traditional branch-based account)

### 3. Step-by-Step Procedure
1. Receive official admission letter (*Zulassungsbescheid*) from a recognized German university (or conditional admission).
2. Open digital blocked account online via passport verification.
3. Wire transfer the required amount plus the provider setup fee (typically €49–€89) and buffer reserve.
4. Download the official **Blocked Account Confirmation (*Sperrbestätigung*)**.
5. Submit this document with your German Category D National Student Visa application at your local German embassy or VFS/TLS visa center.

### 4. Activating Your Funds Upon Arrival in Germany
1. Register your residential address at the local city hall (*Bürgeramt*) to receive your *Meldebescheinigung*.
2. Open a local German checking account (*Girokonto*, e.g., N26, Sparkasse, Deutsche Bank).
3. Connect your Girokonto to your blocked account portal. Your €992 monthly allowance will be disbursed automatically on the first day of each calendar month.`,
    targetCountries: ['Germany'],
    officialSourceLinks: [
      { title: 'Federal Foreign Office Germany - Visa Regulations', url: 'https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq' },
      { title: 'DAAD - Proof of Financial Resources', url: 'https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/costs-and-funding/' },
    ],
    lastVerifiedDate: '2026-10-20',
    isPublished: true,
    author: 'ICSN Immigration & Policy Team',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-20T12:00:00Z',
  },
  {
    id: 'guide_relocation_checklist',
    title: 'Pre-Departure International Relocation Checklist: 90 Days to Takeoff',
    slug: 'international-relocation-90-day-checklist',
    category: 'Relocation & Housing',
    summary:
      'A structured timeline of essential documents, apostilles, medical certificates, flight bookings, and foreign exchange preparations for matriculating overseas students.',
    contentMarkdown: `### Phase 1: 90 to 60 Days Before Departure
- **Apostille & Legalization:** Ensure your high school diploma, transcripts, and birth certificates have legal apostilles from the Ministry of Foreign Affairs and certified court translations.
- **Passport Validity:** Check that your passport is valid for at least 6 months past your anticipated initial study permit duration.
- **Housing Application:** Submit housing lottery applications for student residence halls (*Studierendenwerk*, university dorms, HDB). Student housing fills up 2-4 months before semester commencement.

### Phase 2: 60 to 30 Days Before Departure
- **Immunization & Medical Records:** Translate vaccination cards (MMR, Hepatitis B, Meningitis, Tuberculosis screening). Many universities require uploaded health clearances before matriculation.
- **Financial Cards & Multi-Currency Accounts:** Set up international travel cards (Wise, Revolut) with zero foreign transaction markup.
- **SIM Card & Mobile Connectivity:** Research local eSIMs (Airalo, Holafly) so you have instant mobile internet upon airport landing.

### Phase 3: 30 to 7 Days Before Departure
- **Pack Essential Physical Originals:** Never pack original diplomas, admission letters, visa approval forms, or health records in checked luggage. Always carry them in your personal backpack.
- **Prescription Medications:** Request a 90-day supply and an English doctor's note for any vital prescription medications.
- **Airport Transit:** Check terminal transit times and verify train/subway connections from the destination international airport to your dormitory city.`,
    targetCountries: ['Germany', 'Singapore', 'South Korea', 'Canada', 'Switzerland', 'Netherlands', 'United Kingdom', 'Australia'],
    officialSourceLinks: [
      { title: 'International Air Transport Association (IATA) Travel Center', url: 'https://www.iatatravelcentre.com' },
      { title: 'UNESCO International Student Rights & Mobility Protocol', url: 'https://www.unesco.org/en/education/higher-education/mobility' },
    ],
    lastVerifiedDate: '2026-10-25',
    isPublished: true,
    author: 'ICSN Global Mobility Team',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-25T14:30:00Z',
  },
  {
    id: 'guide_sop_engineering',
    title: 'Writing a Winning Statement of Purpose (SOP) for Global STEM & AI Programs',
    slug: 'writing-stem-statement-of-purpose',
    category: 'Application Essays',
    summary:
      'How to craft a quantified, project-driven academic motivation letter that stands out to competitive admissions committees at TUM, KAIST, NUS, and ETH Zurich.',
    contentMarkdown: `### 1. The Anatomy of an Elite STEM Statement of Purpose
Admissions committees at top global research institutions review thousands of essays. Avoid generic clichés such as *"I have loved computers since childhood"*. Instead, open immediately with an intellectual inquiry or tangible technical problem you investigated.

### 2. The 4-Part Structure
- **Section 1: The Research Catalyst (15%):** Describe a concrete problem or project that crystallized your academic path (e.g., your micro-controller robotics rover, algorithmic competition challenge, or mathematical modeling).
- **Section 2: Academic & Technical Foundation (35%):** Detail specific advanced coursework, lab methodologies, tools (PyTorch, C++, ROS, OpenCV), and quantitative milestones achieved.
- **Section 3: Why This Specific University & Faculty (30%):** Cite 2 specific professors, specialized research labs, or course modules at the target university. Explain how their curriculum bridges the exact gap in your current knowledge.
- **Section 4: Future Trajectory & Societal Impact (20%):** Articulate clear career objectives (e.g., industrial R&D, doctoral research, or technological entrepreneurship) and how you will contribute to the student cohort.

### 3. Key Do's and Don'ts
- **DO:** Quantify results (*"improved system latency by 28%"* or *"mentored 45 younger students"*).
- **DO:** Be transparent about technical challenges and how you resolved them.
- **DON'T:** Rehash your CV line-by-line in narrative form. Provide the deeper backstory and insights that your CV cannot convey.`,
    targetCountries: ['Germany', 'Singapore', 'South Korea', 'Canada', 'Switzerland', 'Netherlands', 'United Kingdom'],
    officialSourceLinks: [
      { title: 'MIT Admissions Writing Advice', url: 'https://mitadmissions.org' },
      { title: 'Oxford Graduate Admissions Guide to Personal Statements', url: 'https://www.ox.ac.uk/admissions/graduate/applying-to-oxford/application-guide' },
    ],
    lastVerifiedDate: '2026-10-18',
    isPublished: true,
    author: 'ICSN Academic Mentorship Advisory',
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-10-18T09:15:00Z',
  },
];
