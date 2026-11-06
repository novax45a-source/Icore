/**
 * ENVO Independent Teacher Verification Rules & Eligibility Evaluator
 */

export const MIN_TEACHER_AGE = 16;
export const ADULT_AGE = 18;
export const MIN_SAT_SCORE = 1400;
export const DEFAULT_MIN_IELTS_SCORE = 7.0;
export const DEFAULT_MIN_TOEFL_SCORE = 95;

export const UZBEKISTAN_CORE_SUBJECTS = [
  'Ona tili',
  'Matematika',
  'Tarix',
  'Kimyo',
  'Biologiya',
  'Fizika',
] as const;

export type UzbekistanSubject = typeof UZBEKISTAN_CORE_SUBJECTS[number];

export interface TeacherAgeValidation {
  eligible: boolean;
  requiresGuardianConsent: boolean;
  age: number;
  reason?: string;
}

/**
 * Calculates exact age in years from date of birth.
 */
export function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Evaluates teacher age eligibility under platform laws.
 * - Under 16: Blocked.
 * - 16-17: Eligible with verified legal guardian consent.
 * - 18+: Full adult eligibility.
 */
export function validateTeacherAge(dobString: string, hasGuardianConsentDoc: boolean = false): TeacherAgeValidation {
  const age = calculateAge(dobString);

  if (isNaN(age) || age <= 0) {
    return {
      eligible: false,
      requiresGuardianConsent: false,
      age: 0,
      reason: 'Yaroqsiz tug‘ilgan sana kiritildi.',
    };
  }

  if (age < MIN_TEACHER_AGE) {
    return {
      eligible: false,
      requiresGuardianConsent: false,
      age,
      reason: `Platformada o‘qituvchi bo‘lish uchun minimal yosh — ${MIN_TEACHER_AGE} yosh. Yosh talabiga javob bermaysiz.`,
    };
  }

  if (age >= MIN_TEACHER_AGE && age < ADULT_AGE) {
    if (!hasGuardianConsentDoc) {
      return {
        eligible: false,
        requiresGuardianConsent: true,
        age,
        reason: '16–17 yoshdagi o‘qituvchilar uchun ota-ona / vasiy roziligi hujjati majburiydir.',
      };
    }
    return {
      eligible: true,
      requiresGuardianConsent: true,
      age,
    };
  }

  return {
    eligible: true,
    requiresGuardianConsent: false,
    age,
  };
}

/**
 * Validates examination track scores:
 * - SAT: must be >= 1400
 * - IELTS: must be >= threshold (7.0 default)
 * - CEFR: must be C1 or C2
 */
export function validateExamTrackScore(track: string, scoreOrLevel: string | number): { valid: boolean; reason?: string } {
  const upperTrack = track.toUpperCase().trim();

  if (upperTrack.includes('SAT')) {
    const num = Number(scoreOrLevel);
    if (isNaN(num) || num < MIN_SAT_SCORE) {
      return { valid: false, reason: `SAT tayyorlash uchun tasdiqlangan ball kamida ${MIN_SAT_SCORE} bo‘lishi lozim.` };
    }
    return { valid: true };
  }

  if (upperTrack.includes('IELTS')) {
    const num = Number(scoreOrLevel);
    if (isNaN(num) || num < DEFAULT_MIN_IELTS_SCORE) {
      return { valid: false, reason: `IELTS tayyorlash uchun minimal ball ${DEFAULT_MIN_IELTS_SCORE} talab etiladi.` };
    }
    return { valid: true };
  }

  if (upperTrack.includes('CEFR')) {
    const level = String(scoreOrLevel).toUpperCase().trim();
    if (level !== 'C1' && level !== 'C2') {
      return { valid: false, reason: 'Ingliz tili CEFR bo‘yicha kamida C1 yoki C2 daraja talab etiladi.' };
    }
    return { valid: true };
  }

  return { valid: true };
}
