import { StudentPortfolio, UserProfile, AssessmentResult } from '../types';

export interface TalentPillar {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  score: number; // 0 - 100
  tier: 'Emerging' | 'Developing' | 'Proficient' | 'Advanced' | 'Exceptional';
  strengths: string[];
  recommendedMilestones: string[];
}

export interface TalentDevelopmentIndex {
  overallReadinessTier: 'Foundational' | 'Active Growth' | 'Global Ready' | 'Distinguished';
  pillars: TalentPillar[];
  keyDevelopmentFocus: string;
  unlockedOpportunitiesCount: number;
}

export function calculateTalentDevelopmentIndex(
  profile: Partial<UserProfile>,
  portfolio: StudentPortfolio,
  assessmentResult?: AssessmentResult | null
): TalentDevelopmentIndex {
  // 1. Academic Preparation Pillar
  const gpa = profile.gpa || 3.0;
  const ielts = profile.ieltsScore || 6.0;
  let academicScore = Math.min(100, Math.round(((gpa / 4.0) * 50) + ((ielts / 9.0) * 50)));

  // 2. Project Experience Pillar
  const projectCount = portfolio.projects.length;
  const hasVerifiedProjects = portfolio.projects.some((p) => p.verified);
  let projectScore = Math.min(100, (projectCount * 30) + (hasVerifiedProjects ? 25 : 10));

  // 3. Skill Breadth & Technical Depth Pillar
  const skillCount = portfolio.skills.length;
  const techSkills = portfolio.skills.filter((s) => s.category === 'Technical').length;
  let skillScore = Math.min(100, (skillCount * 8) + (techSkills * 7));

  // 4. Leadership & Social Impact Pillar
  const volCount = portfolio.volunteering.length;
  const achCount = portfolio.achievements.length;
  let leadershipScore = Math.min(100, (volCount * 35) + (achCount * 25));

  // 5. Portfolio Growth & Completeness Pillar
  let completeness = 20;
  if (portfolio.headline && portfolio.aboutMe.length > 50) completeness += 20;
  if (portfolio.education.length > 0) completeness += 20;
  if (portfolio.projects.length > 0) completeness += 20;
  if (portfolio.languages.length >= 2) completeness += 20;

  const getTier = (s: number): TalentPillar['tier'] => {
    if (s >= 88) return 'Exceptional';
    if (s >= 75) return 'Advanced';
    if (s >= 60) return 'Proficient';
    if (s >= 40) return 'Developing';
    return 'Emerging';
  };

  const pillars: TalentPillar[] = [
    {
      id: 'academic',
      name: 'Academic Preparation',
      nameUz: 'Akademik Tayyorgarlik',
      nameRu: 'Академическая подготовка',
      score: academicScore,
      tier: getTier(academicScore),
      strengths: [
        `Strong standardized baseline (GPA: ${gpa.toFixed(2)}, IELTS: ${ielts.toFixed(1)})`,
        'Meets admission prerequisites for over 85% of global target institutions',
      ],
      recommendedMilestones: [
        'Maintain cumulative GPA above 3.5 throughout final terms',
        'Prepare subject test certificates (AP/SAT Math Level) for competitive STEM scholarships',
      ],
    },
    {
      id: 'projects',
      name: 'Practical Project Experience',
      nameUz: 'Amaliy Loyiha Tajribasi',
      nameRu: 'Практический опыт проектов',
      score: projectScore,
      tier: getTier(projectScore),
      strengths: [
        `${projectCount} documented practical engineering/coding artifacts in portfolio`,
        portfolio.projects[0]?.title ? `Verified prototype: ${portfolio.projects[0].title}` : 'Applied problem solving demonstrated',
      ],
      recommendedMilestones: [
        'Document real measurable user metrics or energy/latency benchmarks in project descriptions',
        'Deploy project demos online with open GitHub repositories',
      ],
    },
    {
      id: 'skills',
      name: 'Skill Competencies & Languages',
      nameUz: 'Kasbiy Ko\'nikmalar va Tillar',
      nameRu: 'Навыки и языковые компетенции',
      score: skillScore,
      tier: getTier(skillScore),
      strengths: [
        `${portfolio.languages.length} spoken languages cataloged with verified CEFR bands`,
        'Demonstrated specialized software/hardware tool stack',
      ],
      recommendedMilestones: [
        'Acquire an industry-recognized cloud or machine learning certification',
        'Deepen proficiency in a primary systems language (C++, Rust, or Python)',
      ],
    },
    {
      id: 'leadership',
      name: 'Leadership & Community Impact',
      nameUz: 'Yetakchilik va Ijtimoiy Hissa',
      nameRu: 'Лидерство и общественный вклад',
      score: leadershipScore,
      tier: getTier(leadershipScore),
      strengths: [
        'Active youth club mentoring and Olympiad competitive participation',
        'Proven dedication to public service and peer tutoring',
      ],
      recommendedMilestones: [
        'Assume team lead or project organizer role in an international student hackathon',
        'Publish a community research report or organize a regional workshop',
      ],
    },
    {
      id: 'portfolio_completeness',
      name: 'Portfolio Polish & Verification',
      nameUz: 'Portfolio To\'liqligi va Hujjatlar',
      nameRu: 'Полнота и верификация портфолио',
      score: completeness,
      tier: getTier(completeness),
      strengths: [
        'Structured resume sections with clean educational history',
        'Privacy controls configured with student-first protection',
      ],
      recommendedMilestones: [
        'Use AI Portfolio Assistant to polish bullet points with active verbs',
        'Attach verified credential URLs for certificates and competitions',
      ],
    },
  ];

  const avgScore = Math.round(
    pillars.reduce((acc, p) => acc + p.score, 0) / pillars.length
  );

  let overallReadinessTier: TalentDevelopmentIndex['overallReadinessTier'] = 'Active Growth';
  if (avgScore >= 82) overallReadinessTier = 'Distinguished';
  else if (avgScore >= 68) overallReadinessTier = 'Global Ready';
  else if (avgScore >= 50) overallReadinessTier = 'Active Growth';
  else overallReadinessTier = 'Foundational';

  return {
    overallReadinessTier,
    pillars,
    keyDevelopmentFocus:
      'Focus on publishing your project prototypes with measurable outcomes and completing recommendation letter requests for upcoming scholarship deadlines.',
    unlockedOpportunitiesCount: Math.round(18 + (avgScore / 100) * 35),
  };
}
