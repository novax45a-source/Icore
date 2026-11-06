import { CountryProfile } from '../types';

export const COUNTRIES_DATA: CountryProfile[] = [
  {
    id: 'cnt_de',
    code: 'DE',
    name: 'Germany',
    region: 'Europe',
    cities: ['Munich', 'Berlin', 'Aachen', 'Heidelberg', 'Frankfurt', 'Stuttgart'],
    educationSystemOverview:
      'Tuition-free or low-tuition public university system renowned for engineering, computer science, and natural sciences. Degrees follow the Bologna framework (3-year Bachelor, 2-year Master).',
    studentVisaOverview:
      'National Visa (Category D) required for non-EU students. Requires proof of financial resources via a Blocked Account (Sperrkonto) of €11,904/year (2026/2027 standard).',
    visaRequirements: [
      'Official admission letter (Zulassungsbescheid)',
      'Blocked bank account proof (approx. €992/month)',
      'German statutory health insurance (TK, Barmer, or AOK)',
      'Proof of language proficiency (English IELTS 6.5+ or German TestDaF/Goethe B2-C1)',
      'Valid passport with minimum 12 months validity',
    ],
    estimatedLivingCostMinUsd: 950,
    estimatedLivingCostMaxUsd: 1450,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 18,
    housingGuidance:
      'Apply for Studierendenwerk dormitories immediately upon acceptance. Private WG (Wohngemeinschaft) shared flats are common but competitive in Munich and Berlin.',
    transportGuidance:
      'Semesterticket included in student union semester fee grants unlimited regional rail and transit access across the federal state.',
    healthInsuranceRequirement: 'Compulsory statutory student health insurance (approx. €125/month).',
    officialImmigrationPortal: 'https://www.make-it-in-germany.com/en/visa-residence/types/studying',
    officialEducationPortal: 'https://www.daad.de/en/study-and-research-in-germany/',
    lastVerified: '2026-10-15',
    status: 'published',
  },
  {
    id: 'cnt_sg',
    code: 'SG',
    name: 'Singapore',
    region: 'Asia-Pacific',
    cities: ['Singapore'],
    educationSystemOverview:
      'World-ranked global academic hub (NUS, NTU) combining British rigor with Asian technological advancement. High English proficiency and deep industry integration.',
    studentVisaOverview:
      'Student’s Pass (STP) issued by the Immigration & Checkpoints Authority (ICA) through the SOLAR online registration portal with an In-Principle Approval (IPA) letter.',
    visaRequirements: [
      'SOLAR application number from authorized university',
      'In-Principle Approval (IPA) entry letter',
      'Proof of financial capability for tuition & living costs',
      'Biometric registration & medical examination upon arrival in Singapore',
    ],
    estimatedLivingCostMinUsd: 1200,
    estimatedLivingCostMaxUsd: 1900,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 12,
    housingGuidance:
      'On-campus halls of residence are heavily subsidized for freshman students. Off-campus HDB rentals available near MRT lines.',
    transportGuidance:
      'World-class MRT subway and bus transit network with concession card fare discounts for matriculated students.',
    healthInsuranceRequirement: 'University mandatory group medical insurance scheme included in tuition fees.',
    officialImmigrationPortal: 'https://www.ica.gov.sg/reside/STP',
    officialEducationPortal: 'https://www.moe.gov.sg/post-secondary/overview',
    lastVerified: '2026-10-10',
    status: 'published',
  },
  {
    id: 'cnt_kr',
    code: 'KR',
    name: 'South Korea',
    region: 'Asia-Pacific',
    cities: ['Seoul', 'Daejeon', 'Busan', 'Incheon'],
    educationSystemOverview:
      'Dynamic STEM and technological research ecosystem. Leading universities (KAIST, SNU, POSTECH) provide extensive English-taught undergraduate and graduate degrees with generous government scholarships (GKS).',
    studentVisaOverview:
      'D-2 Student Visa issued by Korean embassies based on Certificate of Admission (CoA) and bank balance proof of USD $20,000.',
    visaRequirements: [
      'Standard Certificate of Admission issued by university',
      'Bank statement showing minimum $20,000 USD on deposit for 30+ days',
      'Apostilled high school diploma and transcripts',
      'Tuberculosis test result from designated clinic',
    ],
    estimatedLivingCostMinUsd: 850,
    estimatedLivingCostMaxUsd: 1350,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 24,
    housingGuidance:
      'Dormitories (Gisuksa) are inexpensive and high quality. Off-campus one-room (Wonsum) flats require a key-money deposit (Jeonse or Wolse).',
    transportGuidance:
      'Subway and KTX bullet train network with T-Money transit card. Extremely clean and punctual.',
    healthInsuranceRequirement: 'National Health Insurance Service (NHIS) enrollment is compulsory for all international students.',
    officialImmigrationPortal: 'https://www.hikorea.go.kr',
    officialEducationPortal: 'https://www.studyinkorea.go.kr',
    lastVerified: '2026-10-22',
    status: 'published',
  },
  {
    id: 'cnt_ca',
    code: 'CA',
    name: 'Canada',
    region: 'North America',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Waterloo', 'Ottawa', 'Calgary'],
    educationSystemOverview:
      'Internationally prestigious research universities with strong co-op work programs and direct pathways to permanent residency via the Post-Graduation Work Permit (PGWP).',
    studentVisaOverview:
      'Study Permit issued by Immigration, Refugees and Citizenship Canada (IRCC). Requires Provincial Attestation Letter (PAL) and cost-of-living proof ($20,635 CAD).',
    visaRequirements: [
      'Letter of Acceptance from Designated Learning Institution (DLI)',
      'Provincial Attestation Letter (PAL)',
      'Guaranteed Investment Certificate (GIC) or proof of $20,635 CAD living funds',
      'Biometrics and upfront medical exam',
    ],
    estimatedLivingCostMinUsd: 1300,
    estimatedLivingCostMaxUsd: 2100,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 36,
    housingGuidance:
      'First-year guaranteed residence at most major universities. Off-campus apartments require rental lease agreements.',
    transportGuidance:
      'UPass included in student tuition for regional bus, LRT, and metro systems.',
    healthInsuranceRequirement: 'Provincial health coverage (OHIP, MSP, or university UHIP health plan).',
    officialImmigrationPortal: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
    officialEducationPortal: 'https://www.educanada.ca',
    lastVerified: '2026-10-28',
    status: 'published',
  },
  {
    id: 'cnt_ch',
    code: 'CH',
    name: 'Switzerland',
    region: 'Europe',
    cities: ['Zurich', 'Lausanne', 'Geneva', 'Basel'],
    educationSystemOverview:
      'Global pinnacle of scientific and technological education (ETH Zurich, EPFL). Extremely low tuition fees for public universities backed by high federal research funding.',
    studentVisaOverview:
      'National Visa D for non-EU students handled by Cantonal Migration Offices. Requires proof of CHF 21,000/year living funds in a recognized bank.',
    visaRequirements: [
      'Confirmation of matriculation from ETH / EPFL or Swiss university',
      'Proof of CHF 21,000 annual living funds in personal Swiss or approved bank',
      'Curriculum vitae and motivation letter explaining study plans in Switzerland',
      'Written commitment to leave Switzerland following completion of studies',
    ],
    estimatedLivingCostMinUsd: 1600,
    estimatedLivingCostMaxUsd: 2400,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 6,
    housingGuidance:
      'Student housing foundations (WOKO in Zurich, FMEL in Lausanne) offer prioritized student rooms. Apply immediately upon admission.',
    transportGuidance:
      'SBB Swiss Federal Railways Half-Fare travelcard (Halbtax) or Generalabonnement for students.',
    healthInsuranceRequirement: 'Swiss mandatory health insurance (LAMal) with affordable student exemptions (Swisscare/Academic Care).',
    officialImmigrationPortal: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
    officialEducationPortal: 'https://www.studyinswitzerland.plus',
    lastVerified: '2026-10-18',
    status: 'published',
  },
  {
    id: 'cnt_nl',
    code: 'NL',
    name: 'Netherlands',
    region: 'Europe',
    cities: ['Amsterdam', 'Delft', 'Eindhoven', 'Utrecht', 'Rotterdam', 'Groningen'],
    educationSystemOverview:
      'Continental Europe’s largest provider of English-taught Bachelor and Master degrees. Renowned for interactive problem-based learning and technological research.',
    studentVisaOverview:
      'Entry visa (MVV) and Residence Permit (VVR) applied on behalf of the student by the host university through the Dutch IND immigration service.',
    visaRequirements: [
      'University sponsorship confirmation',
      'Proof of living expenses (approx. €1,000/month or €12,000/year) transferred to university account',
      'Apostilled birth certificate',
      'Tuberculosis test (if applicable by nationality)',
    ],
    estimatedLivingCostMinUsd: 1100,
    estimatedLivingCostMaxUsd: 1700,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 12,
    housingGuidance:
      'Dutch housing market is critically tight. Universities strongly advise securing accommodation before booking travel flights.',
    transportGuidance:
      'Bicycle culture throughout all cities. OV-Chipkaart for national train and tram transit.',
    healthInsuranceRequirement: 'Private student insurance (Aon Student Insurance) or Dutch basic insurance if working a part-time job.',
    officialImmigrationPortal: 'https://ind.nl/en/residence-permits/study',
    officialEducationPortal: 'https://www.studyinnl.org',
    lastVerified: '2026-10-19',
    status: 'published',
  },
  {
    id: 'cnt_uk',
    code: 'UK',
    name: 'United Kingdom',
    region: 'Europe',
    cities: ['London', 'Oxford', 'Cambridge', 'Manchester', 'Edinburgh', 'Bristol'],
    educationSystemOverview:
      'Centuries of academic excellence with intensive, focused degrees (3-year Bachelor, 1-year Master). Renowned research universities with global alumni networks.',
    studentVisaOverview:
      'Student Route Visa (formerly Tier 4) requires Confirmation of Acceptance for Studies (CAS) from a licensed UK sponsor.',
    visaRequirements: [
      'Confirmation of Acceptance for Studies (CAS) reference number',
      'Proof of tuition fees + living costs (£1,334/month in London, £1,023/month outside London for 9 months)',
      'Immigration Health Surcharge (IHS) payment (£776/year)',
      'Secure English Language Test (SELT - IELTS for UKVI 6.5+)',
    ],
    estimatedLivingCostMinUsd: 1400,
    estimatedLivingCostMaxUsd: 2200,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 24,
    housingGuidance:
      'First-year guaranteed university halls of residence. Private rented student flats through verified letting agencies.',
    transportGuidance:
      'National Rail 16-25 Railcard offers 1/3 discount on UK train transit. London Oyster student photocard.',
    healthInsuranceRequirement: 'Access to the National Health Service (NHS) granted via mandatory Immigration Health Surcharge.',
    officialImmigrationPortal: 'https://www.gov.uk/student-visa',
    officialEducationPortal: 'https://study-uk.britishcouncil.org',
    lastVerified: '2026-10-25',
    status: 'published',
  },
  {
    id: 'cnt_au',
    code: 'AU',
    name: 'Australia',
    region: 'Asia-Pacific',
    cities: ['Melbourne', 'Sydney', 'Brisbane', 'Canberra', 'Perth', 'Adelaide'],
    educationSystemOverview:
      'Group of Eight (Go8) world-leading research universities with strong clinical, technological, and environmental science programs.',
    studentVisaOverview:
      'Student Visa (Subclass 500) applied through ImmiAccount with Confirmation of Enrolment (CoE).',
    visaRequirements: [
      'Electronic Confirmation of Enrolment (eCoE) from registered CRICOS institution',
      'Genuine Student (GS) assessment statement',
      'Proof of financial capacity (AUD $29,710/year)',
      'Overseas Student Health Cover (OSHC) for entire visa duration',
    ],
    estimatedLivingCostMinUsd: 1350,
    estimatedLivingCostMaxUsd: 2150,
    postStudyWorkVisaAllowed: true,
    postStudyWorkDurationMonths: 24,
    housingGuidance:
      'Purpose-built student accommodation (PBSA) like Scape and Iglu, or university residential colleges.',
    transportGuidance:
      'Concession travel cards (Myki in Melbourne, Opal in Sydney depending on state rules).',
    healthInsuranceRequirement: 'Overseas Student Health Cover (OSHC) policy mandatory for visa validity.',
    officialImmigrationPortal: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
    officialEducationPortal: 'https://www.studyaustralia.gov.au',
    lastVerified: '2026-10-29',
    status: 'published',
  },
];
