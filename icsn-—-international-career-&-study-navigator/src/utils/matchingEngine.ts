import { University, UniversityMatch, UserProfile, AssessmentResult } from '../types';

export interface MatchingCriteria {
  targetCountries?: string[];
  preferredFields?: string[];
  currentGpa?: number;
  ieltsScore?: number;
  toeflScore?: number;
  maxAnnualBudgetUsd?: number;
  needsFullScholarship?: boolean;
  requiresHalal?: boolean;
  minSafetyIndex?: number;
}

export function evaluateUniversityMatch(
  uni: University,
  profile: Partial<UserProfile>,
  assessmentResult?: AssessmentResult | null
): UniversityMatch {
  let score = 0;
  const matchReasons: string[] = [];
  const missingQualifications: string[] = [];

  // Extract student attributes with safe defaults
  const studentGpa = profile.gpa || 3.4;
  const studentIelts = profile.ieltsScore || 6.5;
  const studentToefl = profile.toeflScore || 85;
  const targetBudget = profile.targetBudgetUsd ?? 15000;
  const studentCountries = profile.targetCountries || [];
  const studentInterests = profile.interests || [];

  // 1. Academic Field & Major Alignment (Weight: 25)
  let fieldMatches = false;
  if (assessmentResult?.topFields?.length) {
    const topFieldIds = assessmentResult.topFields.map((f) => f.fieldId);
    fieldMatches = uni.academicFields.some((f) => topFieldIds.includes(f));
  } else if (studentInterests.length > 0) {
    fieldMatches = uni.academicFields.some((f) =>
      studentInterests.some((int) => f.toLowerCase().includes(int.toLowerCase()))
    );
  } else {
    fieldMatches = true; // neutral
  }

  if (fieldMatches) {
    score += 25;
    matchReasons.push('Strong curricular alignment with your indicated academic discipline and target programs.');
  } else {
    score += 10;
  }

  // 2. GPA & Academic Entry Thresholds (Weight: 25)
  if (studentGpa >= uni.admissionRequirements.gpaMin) {
    const gpaDelta = studentGpa - uni.admissionRequirements.gpaMin;
    score += 20 + Math.min(5, Math.round(gpaDelta * 8));
    matchReasons.push(`Your GPA (${studentGpa.toFixed(1)}) meets or exceeds the university minimum threshold (${uni.admissionRequirements.gpaMin.toFixed(1)}).`);
  } else {
    const gap = (uni.admissionRequirements.gpaMin - studentGpa).toFixed(2);
    score += 8;
    missingQualifications.push(`GPA is currently ${studentGpa.toFixed(1)} vs required ${uni.admissionRequirements.gpaMin.toFixed(1)} (gap: ${gap}).`);
  }

  // 3. Language Proficiency (IELTS / TOEFL) (Weight: 20)
  const meetsIelts = studentIelts >= uni.admissionRequirements.ieltsMin;
  const meetsToefl = studentToefl >= uni.admissionRequirements.toeflMin;

  if (meetsIelts || meetsToefl) {
    score += 20;
    matchReasons.push(`Language readiness confirmed (IELTS ${studentIelts} meets minimum ${uni.admissionRequirements.ieltsMin}).`);
  } else {
    score += 6;
    missingQualifications.push(
      `Language score below direct entry cutoff (needs IELTS ${uni.admissionRequirements.ieltsMin} or TOEFL ${uni.admissionRequirements.toeflMin}).`
    );
  }

  // 4. Financial & Tuition Feasibility (Weight: 15)
  if (uni.tuitionPerYearUsd <= targetBudget || uni.tuitionPerYearUsd === 0) {
    score += 15;
    if (uni.tuitionPerYearUsd === 0) {
      matchReasons.push('100% Tuition-free / full waiver policy for international students.');
    } else {
      matchReasons.push(`Annual tuition ($${uni.tuitionPerYearUsd.toLocaleString()}) fits within your target budget.`);
    }
  } else if (uni.availableScholarships.length > 0) {
    score += 10;
    matchReasons.push(`Tuition ($${uni.tuitionPerYearUsd.toLocaleString()}) exceeds budget, but significant institutional scholarships are available.`);
  } else {
    score += 4;
    missingQualifications.push(`Tuition ($${uni.tuitionPerYearUsd.toLocaleString()}) is above your estimated self-funding budget.`);
  }

  // 5. Geographic & Lifestyle Match (Weight: 15)
  const countryMatches =
    studentCountries.length === 0 ||
    studentCountries.some((c) => c.toLowerCase() === uni.country.toLowerCase());

  if (countryMatches) {
    score += 10;
    matchReasons.push(`Located in ${uni.country}, matching your preferred study destination region.`);
  } else {
    score += 4;
  }

  // Safety & Lifestyle / Dietary preference
  if (uni.safetyIndex >= 85) {
    score += 5;
    matchReasons.push(`High campus and municipal safety index (${uni.safetyIndex}/100).`);
  }

  // Bound score between 20 and 98
  const fitScore = Math.min(98, Math.max(25, Math.round(score)));

  let fitCategory: UniversityMatch['fitCategory'] = 'Potential Match';
  if (fitScore >= 80) {
    fitCategory = 'Strong Profile Match';
  } else if (fitScore >= 65) {
    fitCategory = 'Good Match';
  } else if (fitScore >= 50) {
    fitCategory = 'Potential Match';
  } else {
    fitCategory = 'Requires Further Preparation';
  }

  return {
    university: uni,
    fitCategory,
    fitScore,
    matchReasons,
    missingQualifications,
  };
}

export function rankUniversitiesForStudent(
  universities: University[],
  profile: Partial<UserProfile>,
  assessmentResult?: AssessmentResult | null
): UniversityMatch[] {
  return universities
    .map((uni) => evaluateUniversityMatch(uni, profile, assessmentResult))
    .sort((a, b) => b.fitScore - a.fitScore);
}
