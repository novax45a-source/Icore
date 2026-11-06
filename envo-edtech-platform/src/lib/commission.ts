/**
 * Financial Calculation Engine for ENVO Platform
 * Rule: 83% Teacher Share, 17% ENVO Commission
 * Commercial Agreement: Integer arithmetic without rounding leakage
 */

export interface CommissionBreakdown {
  grossAmount: number;
  teacherShare: number;
  envoCommission: number;
  providerFee: number;
  netPayoutToTeacher: number;
}

export const TEACHER_COMMISSION_PERCENT = 83;
export const ENVO_COMMISSION_PERCENT = 17;

/**
 * Calculates exact 83% teacher share and 17% ENVO commission.
 * Guaranteed: teacherShare + envoCommission === grossAmount (no lost currency units)
 */
export function calculateMarketplaceSplit(
  grossAmount: number,
  providerFee: number = 0
): CommissionBreakdown {
  if (grossAmount < 0) {
    throw new Error('Gross amount must be non-negative');
  }

  // Teacher receives 83% of gross lesson fee
  const teacherShare = Math.round((grossAmount * TEACHER_COMMISSION_PERCENT) / 100);
  // ENVO receives the remaining exact remainder (17%) to prevent 1-unit rounding drift
  const envoCommission = grossAmount - teacherShare;

  return {
    grossAmount,
    teacherShare,
    envoCommission,
    providerFee,
    netPayoutToTeacher: teacherShare,
  };
}

/**
 * Formats UZS currency consistently across all dashboards
 */
export function formatUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

/**
 * Formats USD currency for SaaS subscriptions
 */
export function formatUSD(amount: number): string {
  return `$${amount}`;
}
