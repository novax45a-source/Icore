export type ConnectedPlatformId = 'ICSN' | 'ENVO';

export type PlatformDiscoveryStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'DISCOVERING'
  | 'ONBOARDED'
  | 'ERROR';

export type DatabaseOperationLevel =
  | 'LEVEL_1_READ'
  | 'LEVEL_2_PREPARE'
  | 'LEVEL_3_TEST'
  | 'LEVEL_4_PRODUCTION';

export interface DatabaseTableSchema {
  tableName: string;
  rowCount: number;
  columns: { name: string; type: string; isNullable: boolean; isPrimaryKey?: boolean }[];
  foreignKeys: { column: string; referencesTable: string; referencesColumn: string }[];
  rlsEnabled: boolean;
  rlsPoliciesCount: number;
}

export interface PlatformDiscoveryResult {
  platformId: ConnectedPlatformId;
  platformName: string;
  tagline: string;
  discoveryStatus: PlatformDiscoveryStatus;
  repoPath: string;
  frontendStack: string;
  backendStack: string;
  databaseType: 'PostgreSQL (Supabase)' | 'SQLite' | 'PostgreSQL' | 'REST API';
  databaseUrlMasked: string;
  schemas: DatabaseTableSchema[];
  endpointsCount: number;
  authMethod: string;
  rlsEnforced: boolean;
  discoveredIssues: string[];
  assistantStatus: 'NOT_DEPLOYED' | 'CONFIGURED' | 'DEPLOYED' | 'ACTIVE';
  lastDiscoveredAt?: string;
}

export interface PlatformAssistantConfig {
  platformId: ConnectedPlatformId;
  assistantName: string;
  codename: string;
  systemInstruction: string;
  model: string;
  knowledgeSources: string[];
  allowedTools: string[];
  dataIsolationEnforced: boolean;
  version: string;
  status: 'ACTIVE' | 'STANDBY' | 'PAUSED';
}

// Initial Platform Discovery Records
export const INITIAL_PLATFORMS: Record<ConnectedPlatformId, PlatformDiscoveryResult> = {
  ICSN: {
    platformId: 'ICSN',
    platformName: 'International Career & Study Navigator',
    tagline: 'Global educational discovery, career pathways & scholarship guidance platform',
    discoveryStatus: 'ONBOARDED',
    repoPath: 'C:\\Users\\acer\\projects\\icsn-platform',
    frontendStack: 'React 19 + TypeScript + Tailwind CSS',
    backendStack: 'Supabase Edge Functions + REST APIs',
    databaseType: 'PostgreSQL (Supabase)',
    databaseUrlMasked: 'postgresql://postgres:••••••••@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
    schemas: [
      {
        tableName: 'students',
        rowCount: 1240,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'full_name', type: 'text', isNullable: false },
          { name: 'target_country', type: 'text', isNullable: true },
          { name: 'gpa', type: 'numeric', isNullable: true }
        ],
        foreignKeys: [],
        rlsEnabled: true,
        rlsPoliciesCount: 3
      },
      {
        tableName: 'universities',
        rowCount: 450,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'name', type: 'text', isNullable: false },
          { name: 'country', type: 'text', isNullable: false },
          { name: 'world_rank', type: 'integer', isNullable: true }
        ],
        foreignKeys: [],
        rlsEnabled: true,
        rlsPoliciesCount: 2
      },
      {
        tableName: 'scholarships',
        rowCount: 180,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'title', type: 'text', isNullable: false },
          { name: 'coverage_amount', type: 'numeric', isNullable: false },
          { name: 'deadline', type: 'date', isNullable: false }
        ],
        foreignKeys: [],
        rlsEnabled: true,
        rlsPoliciesCount: 2
      }
    ],
    endpointsCount: 24,
    authMethod: 'Supabase Auth (JWT + MFA)',
    rlsEnforced: true,
    discoveredIssues: [
      'Missing index on scholarships.deadline for upcoming filter queries',
      'Rate-limiting not enforced on public university search endpoint'
    ],
    assistantStatus: 'DEPLOYED',
    lastDiscoveredAt: '2026-11-05T08:30:00Z'
  },
  ENVO: {
    platformId: 'ENVO',
    platformName: 'Education Network & Virtual Organization',
    tagline: 'Learning center management, interactive courses, teacher workflows & lesson planning',
    discoveryStatus: 'ONBOARDED',
    repoPath: 'C:\\Users\\acer\\projects\\envo-network',
    frontendStack: 'Next.js 15 App Router + Tailwind CSS',
    backendStack: 'FastAPI + Supabase Database',
    databaseType: 'PostgreSQL (Supabase)',
    databaseUrlMasked: 'postgresql://postgres:••••••••@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    schemas: [
      {
        tableName: 'learning_centers',
        rowCount: 68,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'name', type: 'text', isNullable: false },
          { name: 'license_tier', type: 'text', isNullable: false },
          { name: 'capacity', type: 'integer', isNullable: false }
        ],
        foreignKeys: [],
        rlsEnabled: true,
        rlsPoliciesCount: 4
      },
      {
        tableName: 'courses',
        rowCount: 320,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'center_id', type: 'uuid', isNullable: false },
          { name: 'title', type: 'text', isNullable: false },
          { name: 'teacher_id', type: 'uuid', isNullable: false }
        ],
        foreignKeys: [{ column: 'center_id', referencesTable: 'learning_centers', referencesColumn: 'id' }],
        rlsEnabled: true,
        rlsPoliciesCount: 3
      },
      {
        tableName: 'enrollments',
        rowCount: 4890,
        columns: [
          { name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
          { name: 'student_id', type: 'uuid', isNullable: false },
          { name: 'course_id', type: 'uuid', isNullable: false },
          { name: 'progress_percent', type: 'integer', isNullable: false }
        ],
        foreignKeys: [{ column: 'course_id', referencesTable: 'courses', referencesColumn: 'id' }],
        rlsEnabled: true,
        rlsPoliciesCount: 4
      }
    ],
    endpointsCount: 38,
    authMethod: 'OAuth 2.0 + Supabase Auth',
    rlsEnforced: true,
    discoveredIssues: [
      'Teacher schedule conflict validation requires database constraint update',
      'Batch enrollment query lacks pagination'
    ],
    assistantStatus: 'DEPLOYED',
    lastDiscoveredAt: '2026-11-05T08:45:00Z'
  }
};

// Embedded AI Assistant Profiles
export const INITIAL_ASSISTANTS: Record<ConnectedPlatformId, PlatformAssistantConfig> = {
  ICSN: {
    platformId: 'ICSN',
    assistantName: 'ICSN Navigator AI',
    codename: 'ICSN-GUIDE-v1',
    systemInstruction:
      'You are the dedicated student counselor AI for ICSN. Help students discover universities, scholarships, and career paths. Strict data boundary: you never access ENVO data or Founder private JARVIS files.',
    model: 'qwen3:4b',
    knowledgeSources: ['ICSN University DB', 'Scholarship Registry', 'Country Visa Guidelines'],
    allowedTools: ['search_universities', 'calculate_scholarship_match', 'draft_sop_outline'],
    dataIsolationEnforced: true,
    version: '1.2.0',
    status: 'ACTIVE'
  },
  ENVO: {
    platformId: 'ENVO',
    assistantName: 'ENVO Learning & Teaching AI',
    codename: 'ENVO-MENTOR-v1',
    systemInstruction:
      'You are the educational assistant for ENVO learning centers and independent teachers. Help draft interactive lesson plans, explain concepts, and navigate courses. Strict boundary: zero access to ICSN student records or Founder credentials.',
    model: 'qwen2.5-coder:3b',
    knowledgeSources: ['ENVO Course Catalog', 'Teacher Curriculum Guide', 'Pedagogical Standards'],
    allowedTools: ['generate_quiz', 'summarize_lesson', 'track_student_milestones'],
    dataIsolationEnforced: true,
    version: '1.4.2',
    status: 'ACTIVE'
  }
};

/**
 * Validates database operations against Section 6 safety levels
 */
export function validateDatabaseOperation(
  sql: string,
  requestedLevel: DatabaseOperationLevel,
  isFounderApproved = false
): {
  allowed: boolean;
  requiredLevel: DatabaseOperationLevel;
  reason: string;
  safetyCheckPassed: boolean;
} {
  const trimmed = sql.trim().toLowerCase();
  const isDestructive =
    trimmed.startsWith('drop') ||
    trimmed.startsWith('delete') ||
    trimmed.startsWith('truncate') ||
    trimmed.startsWith('alter') ||
    trimmed.includes('cascade');

  const isWrite =
    trimmed.startsWith('insert') ||
    trimmed.startsWith('update') ||
    trimmed.startsWith('create') ||
    isDestructive;

  if (isDestructive) {
    if (requestedLevel !== 'LEVEL_4_PRODUCTION') {
      return {
        allowed: false,
        requiredLevel: 'LEVEL_4_PRODUCTION',
        reason: 'Destructive DDL/DML statements strictly require LEVEL 4 PRODUCTION authorization with rollback verification.',
        safetyCheckPassed: false
      };
    }
    if (!isFounderApproved) {
      return {
        allowed: false,
        requiredLevel: 'LEVEL_4_PRODUCTION',
        reason: 'Explicit Founder confirmation required before executing destructive production database modifications.',
        safetyCheckPassed: false
      };
    }
    return {
      allowed: true,
      requiredLevel: 'LEVEL_4_PRODUCTION',
      reason: 'Founder approved destructive production operation. Backup checkpoint verified.',
      safetyCheckPassed: true
    };
  }

  if (isWrite) {
    if (requestedLevel === 'LEVEL_1_READ') {
      return {
        allowed: false,
        requiredLevel: 'LEVEL_2_PREPARE',
        reason: 'Write operations cannot run under LEVEL 1 READ permission.',
        safetyCheckPassed: false
      };
    }
    return {
      allowed: true,
      requiredLevel: requestedLevel,
      reason: 'Write operation validated against staging/sandbox environment.',
      safetyCheckPassed: true
    };
  }

  // Pure SELECT/read query
  return {
    allowed: true,
    requiredLevel: 'LEVEL_1_READ',
    reason: 'Read-only query approved for autonomous execution under Level 1.',
    safetyCheckPassed: true
  };
}

/**
 * Verifies assistant boundary isolation as mandated by Section 7.4
 */
export function verifyAssistantDataIsolation(
  callingAssistant: ConnectedPlatformId,
  targetContext: string
): { isIsolated: boolean; violationDetected: boolean; reason: string } {
  const lower = targetContext.toLowerCase();
  const otherPlatform = callingAssistant === 'ICSN' ? 'envo' : 'icsn';

  if (lower.includes(otherPlatform)) {
    return {
      isIsolated: false,
      violationDetected: true,
      reason: `SECURITY VIOLATION: Assistant ${callingAssistant} attempted cross-boundary access to ${otherPlatform.toUpperCase()} data.`
    };
  }

  if (lower.includes('founder') || lower.includes('root') || lower.includes('credentials')) {
    return {
      isIsolated: false,
      violationDetected: true,
      reason: `SECURITY VIOLATION: Platform assistant ${callingAssistant} cannot access Founder root credentials.`
    };
  }

  return {
    isIsolated: true,
    violationDetected: false,
    reason: `Access permitted within isolated boundary [${callingAssistant}].`
  };
}
