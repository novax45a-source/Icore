/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SAAS_PLANS } from './plans';
import { calculateMarketplaceSplit, formatUZS, formatUSD } from './commission';
import { validateGroupCapacityLimit } from './groupCapacity';
import {
  validateTeacherAge,
  validateExamTrackScore,
  calculateAge,
  MIN_TEACHER_AGE,
  MIN_SAT_SCORE,
} from './teacherVerification';

export const APP_CONFIG = {
  name: 'ENVO EdTech Platform',
  version: '2.4.0',
  founderEmail: 'novax45.a@gmail.com',
  defaultLanguage: 'uz' as const,
  commissionSplit: {
    teacherPercentage: 83,
    envoPercentage: 17,
  },
  groupCapacity: {
    min: 1,
    max: 3,
  },
  subscriptionCycleDays: 30,
};

export {
  SAAS_PLANS,
  calculateMarketplaceSplit,
  formatUZS,
  formatUSD,
  validateGroupCapacityLimit,
  validateTeacherAge,
  validateExamTrackScore,
  calculateAge,
  MIN_TEACHER_AGE,
  MIN_SAT_SCORE,
};
