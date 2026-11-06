import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { AssessmentResult } from '../types';

export interface FieldDefinition {
  fieldId: string;
  name: string;
  nameUz: string;
  nameRu: string;
  tags: string[];
  majors: string[];
  careers: string[];
  skills: string[];
  activities: string[];
  explanationTemplate: (score: number) => string;
}

export const ACADEMIC_FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    fieldId: 'cs_ai',
    name: 'Computer Science, Artificial Intelligence & Software Systems',
    nameUz: 'Kompyuter Ilmlari, Sun\'iy Intellekt va Dasturiy Tizimlar',
    nameRu: 'Компьютерные науки, Искусственный интеллект и ПО',
    tags: ['tech'],
    majors: [
      'Artificial Intelligence & Machine Learning',
      'Computer Science & Distributed Systems',
      'Cybersecurity & Network Defense',
      'Human-Computer Interaction (HCI)',
      'Data Science & Analytics',
    ],
    careers: [
      'Machine Learning Engineer',
      'Full-Stack Systems Architect',
      'Cybersecurity Specialist',
      'Cloud Infrastructure Engineer',
      'AI Research Scientist',
    ],
    skills: [
      'Algorithms & Data Structures',
      'Python, C++ or Rust',
      'Neural Network Architectures',
      'Version Control (Git) & CI/CD',
      'Systems Design',
    ],
    activities: [
      'Contribute to open-source GitHub repositories',
      'Compete in algorithmic contests (Codeforces, LeetCode, ICPC)',
      'Build and deploy a full-stack web or mobile app prototype',
      'Participate in student hackathons and technical project teams',
    ],
    explanationTemplate: () =>
      'Your strong aptitude for quantitative logic, modular debugging, and interest in automation indicate exceptional alignment with software engineering and applied artificial intelligence.',
  },
  {
    fieldId: 'engineering_robotics',
    name: 'Advanced Engineering, Robotics & Automation',
    nameUz: 'Ilg\'or Muhandislik, Robototexnika va Avtomatlashtirish',
    nameRu: 'Инженерия, Робототехника и Автоматизация',
    tags: ['engineering'],
    majors: [
      'Robotics & Autonomous Systems',
      'Electrical & Computer Engineering',
      'Mechanical Engineering & Mechatronics',
      'Aerospace Engineering',
      'Biomedical Engineering',
    ],
    careers: [
      'Robotics Systems Engineer',
      'Embedded Hardware Architect',
      'Autonomous Vehicle Specialist',
      'Aerospace Systems Designer',
      'Control Systems Engineer',
    ],
    skills: [
      'CAD / 3D Parametric Modeling',
      'Microcontrollers & Embedded C/C++',
      'Kinematics & Dynamics Physics',
      'Circuit Design & PCB Layout',
      'Rapid Prototyping (3D Printing / CNC)',
    ],
    activities: [
      'Join or build a robotics club team for FIRST or VEX competitions',
      'Build Arduino/ESP32 sensor and motor actuation projects',
      'Conduct a physics-based materials or fluid dynamics simulation',
      'Shadow an engineering lab or manufacturing facility',
    ],
    explanationTemplate: () =>
      'Your preference for tangible problem-solving, physical systems modeling, and rigorous mathematics matches high-level engineering and robotics degrees.',
  },
  {
    fieldId: 'business_finance',
    name: 'International Business, Economics & Venture Finance',
    nameUz: 'Xalqaro Biznes, Iqtisodiyot va Venchur Moliya',
    nameRu: 'Международный бизнес, Экономика и Финансы',
    tags: ['business', 'economics', 'leadership'],
    majors: [
      'International Business & Strategy',
      'Quantitative Economics & Econometrics',
      'Corporate Finance & Investment Banking',
      'Entrepreneurship & Venture Creation',
      'Operations & Supply Chain Analytics',
    ],
    careers: [
      'Management Consultant',
      'Investment Analyst / Venture Capitalist',
      'Tech Product Manager',
      'Financial Strategist',
      'Startup Founder / Executive',
    ],
    skills: [
      'Financial Modeling & Valuation',
      'Market Sizing & Competitive Intelligence',
      'Persuasive Pitching & Negotiation',
      'Data Analytics & Excel/SQL Modeling',
      'Strategic Roadmap Planning',
    ],
    activities: [
      'Launch a small e-commerce or campus venture to test real customer demand',
      'Participate in university case competitions and business hackathons',
      'Analyze financial statements of public tech companies',
      'Take Harvard Business School online micro-courses on valuation',
    ],
    explanationTemplate: () =>
      'Your inclination toward resource orchestration, stakeholder alignment, risk management, and market dynamics points directly toward business, quantitative economics, or venture entrepreneurship.',
  },
  {
    fieldId: 'medicine_health',
    name: 'Medicine, Biomedical Sciences & Healthcare Systems',
    nameUz: 'Tibbiyot, Biotibbiyot Fanlari va Sog\'liqni Saqlash',
    nameRu: 'Медицина, Биомедицина и Здравоохранение',
    tags: ['medicine', 'life_sciences'],
    majors: [
      'Pre-Medicine & Clinical Medicine (MBBS / MD)',
      'Biomedical Sciences & Genetics',
      'Pharmacology & Drug Discovery',
      'Neuroscience & Cognitive Science',
      'Global Public Health & Epidemiology',
    ],
    careers: [
      'Physician / Specialized Surgeon',
      'Biomedical Research Scientist',
      'Clinical Trial Director',
      'Epidemiologist & Health Policy Advisor',
      'Neurotechnology Specialist',
    ],
    skills: [
      'Biological Systems & Human Physiology',
      'Laboratory Protocols & Biosafety',
      'Clinical Empathy & Patient Communication',
      'Statistical Analysis for Medical Trials',
      'Scientific Literature Synthesis',
    ],
    activities: [
      'Volunteer at a regional hospital, clinic, or hospice center',
      'Engage in a supervised wet-lab or bioinformatics research project',
      'Publish a review paper on a modern medical therapeutic',
      'Participate in the International Biology Olympiad (IBO)',
    ],
    explanationTemplate: () =>
      'Your prioritization of empirical evidence, patient care, rigorous biological mechanisms, and humanitarian relief underscores strong compatibility with clinical medicine and biotechnology research.',
  },
  {
    fieldId: 'international_policy',
    name: 'International Relations, Public Policy & Global Governance',
    nameUz: 'Xalqaro Munosabatlar, Davlat Siyosati va Huquq',
    nameRu: 'Международные отношения, Государственная политика и Право',
    tags: ['social_sciences', 'law_governance'],
    majors: [
      'International Relations & Diplomacy',
      'Public Policy & Government Administration',
      'International Law & Human Rights',
      'Global Political Economy',
      'Development Studies & Humanitarian Aid',
    ],
    careers: [
      'Diplomat / Foreign Affairs Officer',
      'Policy Analyst at International Think-Tank',
      'Corporate International Affairs Counsel',
      'Humanitarian Program Director (UN / Red Cross)',
      'Global Trade Compliance Specialist',
    ],
    skills: [
      'Policy Brief Drafting & Legal Analysis',
      'Diplomatic Negotiation & Conflict Mediation',
      'Multilingual Fluency & Cultural Fluency',
      'Public Speaking & Debate',
      'Qualitative Research & Archival Synthesis',
    ],
    activities: [
      'Participate as a delegate in Model United Nations (MUN) conferences',
      'Write analytical commentary for youth geopolitical publications',
      'Intern or volunteer with local municipality or non-governmental organization',
      'Compete in parliamentary debate leagues',
    ],
    explanationTemplate: () =>
      'Your strong rhetorical reasoning, interest in societal impact, international ethics, and systemic reform make international relations, law, and diplomacy a natural avenue.',
  },
  {
    fieldId: 'clean_energy',
    name: 'Climate Science, Renewable Energy & Sustainable Systems',
    nameUz: 'Iqlim Ilmi, Qayta Tiklanuvchi Energiya va Barqaror Rivojlanish',
    nameRu: 'Климатические науки, Возобновляемая энергетика и Экология',
    tags: ['climate'],
    majors: [
      'Environmental Engineering & Energy Transition',
      'Climate Science & Atmospheric Physics',
      'Renewable Energy Systems & Grid Tech',
      'Sustainable Urban Architecture',
      'Ecology & Resource Economics',
    ],
    careers: [
      'Renewable Energy Project Engineer',
      'Climate Risk & Carbon Analyst',
      'Sustainable Infrastructure Consultant',
      'Environmental Impact Director',
      'CleanTech Innovation Specialist',
    ],
    skills: [
      'Energy Modeling & Thermodynamics',
      'GIS (Geographic Information Systems)',
      'Life Cycle Assessment (LCA)',
      'Environmental Regulations & Carbon Accounting',
      'Field Sampling & Environmental Chemistry',
    ],
    activities: [
      'Audit local energy efficiency or water conservation metrics',
      'Engage in community ecological restoration or reforestation initiatives',
      'Build a solar-powered or renewable energy demo unit',
      'Participate in youth climate summits and research competitions',
    ],
    explanationTemplate: () =>
      'Your commitment to solving existential planetary challenges through scientific rigor and clean infrastructure indicates a prime fit for environmental engineering and renewable technology.',
  },
  {
    fieldId: 'design_media',
    name: 'Interactive Design, Architecture & Digital Media',
    nameUz: 'Interaktiv Dizayn, Arxitektura va Raqamli Media',
    nameRu: 'Интерактивный дизайн, Архитектура и Медиа',
    tags: ['arts', 'design'],
    majors: [
      'User Experience (UX) & Product Design',
      'Architecture & Spatial Design',
      'Digital Media Arts & Creative Technology',
      'Industrial & Transportation Design',
      'Visual Communication & Brand Design',
    ],
    careers: [
      'Lead Product Designer (UI/UX)',
      'Architectural Systems Designer',
      'Creative Technologist / Visual Producer',
      'Design Systems Lead',
      'Creative Director',
    ],
    skills: [
      'Figma / Prototyping Systems',
      'Spatial Math & Ergonomics',
      'Typography, Color Theory & Grid Composition',
      'User Research & Empathy Testing',
      '3D Visualization (Blender / Rhino)',
    ],
    activities: [
      'Build a portfolio with 3 distinct end-to-end UX or architectural case studies',
      'Conduct usability tests on popular student apps and redesign interfaces',
      'Publish creative work on Behance, Dribbble, or personal portfolio',
      'Enter international student design awards',
    ],
    explanationTemplate: () =>
      'Your visual aesthetic sensibility, human empathy, and desire to transform complex concepts into elegant experiences align directly with product design and spatial architecture.',
  },
];

export function calculateAssessmentResult(answers: Record<number, number>): AssessmentResult {
  const scores: Record<string, number> = {
    tech: 0,
    engineering: 0,
    business: 0,
    economics: 0,
    medicine: 0,
    life_sciences: 0,
    social_sciences: 0,
    law_governance: 0,
    arts: 0,
    design: 0,
    climate: 0,
    startup: 0,
    leadership: 0,
    dest_europe: 0,
    dest_north_america: 0,
    dest_uk: 0,
    dest_asia: 0,
    english_high: 0,
    scholarship_potential: 0,
    full_scholarship_needed: 0,
  };

  // Tally scores across the 30 questions
  for (const q of ASSESSMENT_QUESTIONS) {
    const selectedOptionIdx = answers[q.id];
    if (selectedOptionIdx !== undefined && q.options[selectedOptionIdx]) {
      const option = q.options[selectedOptionIdx];
      for (const [tag, weight] of Object.entries(option.scoreTags)) {
        scores[tag] = (scores[tag] || 0) + weight;
      }
    }
  }

  // Calculate scores for each academic field
  const rankedFields = ACADEMIC_FIELD_DEFINITIONS.map((field) => {
    let rawScore = 0;
    for (const tag of field.tags) {
      rawScore += scores[tag] || 0;
    }
    return {
      field,
      rawScore,
    };
  }).sort((a, b) => b.rawScore - a.rawScore);

  const topRawScore = Math.max(rankedFields[0]?.rawScore || 1, 1);

  const topFields = rankedFields.slice(0, 3).map(({ field, rawScore }) => {
    const matchPercent = Math.min(98, Math.max(68, Math.round((rawScore / topRawScore) * 94 + 5)));
    return {
      fieldId: field.fieldId,
      name: field.name,
      score: rawScore,
      matchPercent,
      explanation: field.explanationTemplate(rawScore),
    };
  });

  // Collect top recommended majors (from top 2 fields)
  const topMajors = Array.from(
    new Set([
      ...(rankedFields[0]?.field.majors.slice(0, 3) || []),
      ...(rankedFields[1]?.field.majors.slice(0, 2) || []),
    ])
  );

  // Collect career directions
  const careerDirections = Array.from(
    new Set([
      ...(rankedFields[0]?.field.careers.slice(0, 3) || []),
      ...(rankedFields[1]?.field.careers.slice(0, 2) || []),
    ])
  );

  // Key skills
  const keySkillsToDevelop = Array.from(
    new Set([
      ...(rankedFields[0]?.field.skills.slice(0, 3) || []),
      ...(rankedFields[1]?.field.skills.slice(0, 2) || []),
    ])
  );

  // Suggested activities
  const suggestedLearningActivities = Array.from(
    new Set([
      ...(rankedFields[0]?.field.activities.slice(0, 2) || []),
      ...(rankedFields[1]?.field.activities.slice(0, 2) || []),
    ])
  );

  // Determine study destinations
  const destScores = [
    { name: 'Continental Europe (Germany, Netherlands, Switzerland, France)', score: scores.dest_europe || 0 },
    { name: 'North America (United States & Canada)', score: scores.dest_north_america || 0 },
    { name: 'United Kingdom & Ireland', score: scores.dest_uk || 0 },
    { name: 'Asia-Pacific (Singapore, South Korea, Japan, Australia)', score: scores.dest_asia || 0 },
  ].sort((a, b) => b.score - a.score);

  const recommendedDestinations = destScores.slice(0, 2).map((d) => d.name);

  const primaryField = rankedFields[0]?.field.name || 'General Interdisciplinary Studies';
  const answersImpactSummary = `Based on your responses across all 30 questions, your strongest affinity converged around ${primaryField}. Your preference for active problem-solving, structured learning, and specific international targets heavily weighted these recommendations.`;

  return {
    completedAt: new Date().toISOString(),
    answers,
    topFields,
    recommendedMajors: topMajors,
    careerDirections,
    recommendedDestinations,
    keySkillsToDevelop,
    suggestedLearningActivities,
    answersImpactSummary,
  };
}
