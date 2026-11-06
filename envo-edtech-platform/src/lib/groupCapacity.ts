/**
 * ENVO Marketplace Group Capacity Engine
 * Commercial Invariant: Independent teacher groups must contain strictly 1–3 students.
 */

export const MIN_GROUP_CAPACITY = 1;
export const MAX_GROUP_CAPACITY = 3;

export interface GroupCapacityStatus {
  canEnroll: boolean;
  currentCount: number;
  maxCapacity: number;
  remainingSlots: number;
  errorMessage?: string;
}

/**
 * Validates requested capacity for a new or updated group.
 */
export function validateGroupCapacityLimit(capacity: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(capacity)) {
    return { valid: false, error: 'Guruh sig‘imi butun son bo‘lishi kerak' };
  }
  if (capacity < MIN_GROUP_CAPACITY || capacity > MAX_GROUP_CAPACITY) {
    return {
      valid: false,
      error: `Guruh sig‘imi qat'iy ravishda ${MIN_GROUP_CAPACITY} dan ${MAX_GROUP_CAPACITY} nafargacha bo‘lishi shart.`,
    };
  }
  return { valid: true };
}

/**
 * Evaluates whether a student can enroll in a group.
 */
export function evaluateGroupEnrollment(
  currentEnrolledCount: number,
  maxCapacity: number = MAX_GROUP_CAPACITY,
  alreadyEnrolled: boolean = false
): GroupCapacityStatus {
  if (alreadyEnrolled) {
    return {
      canEnroll: false,
      currentCount: currentEnrolledCount,
      maxCapacity,
      remainingSlots: Math.max(0, maxCapacity - currentEnrolledCount),
      errorMessage: 'Siz allaqachon ushbu guruhga a‘zosiz.',
    };
  }

  if (currentEnrolledCount >= maxCapacity) {
    return {
      canEnroll: false,
      currentCount: currentEnrolledCount,
      maxCapacity,
      remainingSlots: 0,
      errorMessage: `Guruh to‘lgan! Maksimal sig‘im: ${maxCapacity} o‘quvchi.`,
    };
  }

  const remaining = maxCapacity - currentEnrolledCount;
  return {
    canEnroll: true,
    currentCount: currentEnrolledCount,
    maxCapacity,
    remainingSlots: remaining,
  };
}
