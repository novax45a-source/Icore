export type AgentRole =
  | 'SUPERVISOR'
  | 'RESEARCH'
  | 'DEVELOPER'
  | 'DATABASE'
  | 'ANALYST'
  | 'PLANNING'
  | 'TESTING'
  | 'SECURITY'
  | 'DOCUMENT'
  | 'COMMUNICATION'
  | 'MEMORY'
  | 'ECOSYSTEM'
  | 'DEPLOYMENT';

export interface AgentDescriptor {
  role: AgentRole;
  name: string;
  codename: string;
  description: string;
  icon: string;
  isHeavyweight: boolean;
  activeStatus: 'IDLE' | 'ASSIGNED' | 'EXECUTING' | 'VERIFYING';
}

export const REGISTERED_AGENTS: Record<AgentRole, AgentDescriptor> = {
  SUPERVISOR: {
    role: 'SUPERVISOR',
    name: 'Executive Supervisor',
    codename: 'MARK-XX',
    description: 'Reviews outputs, detects inconsistencies, and evaluates final mission integrity.',
    icon: 'ShieldCheck',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  RESEARCH: {
    role: 'RESEARCH',
    name: 'Deep Research Agent',
    codename: 'RECON-1',
    description: 'Internet intelligence gathering, source verification, and structured citations.',
    icon: 'Globe',
    isHeavyweight: true,
    activeStatus: 'IDLE'
  },
  DEVELOPER: {
    role: 'DEVELOPER',
    name: 'Lead Developer Agent',
    codename: 'CODER-PRO',
    description: 'Autonomous coding, refactoring, architectural blueprints, and syntax repair.',
    icon: 'Code2',
    isHeavyweight: true,
    activeStatus: 'IDLE'
  },
  DATABASE: {
    role: 'DATABASE',
    name: 'Database Intelligence Agent',
    codename: 'DATA-PROBE',
    description: 'PostgreSQL/Supabase schema discovery, Level 1-4 query execution, migrations & rollbacks.',
    icon: 'Database',
    isHeavyweight: true,
    activeStatus: 'IDLE'
  },
  ANALYST: {
    role: 'ANALYST',
    name: 'Strategic Analyst',
    codename: 'METRICS-V',
    description: 'Financial projections, market dynamics, and competitive benchmarking.',
    icon: 'TrendingUp',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  PLANNING: {
    role: 'PLANNING',
    name: 'Mission Planner',
    codename: 'STRAT-IX',
    description: 'Decomposes complex mandates into phased milestones, roadmaps, and deadlines.',
    icon: 'CalendarClock',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  TESTING: {
    role: 'TESTING',
    name: 'QA & Testing Agent',
    codename: 'VERIFY-TEST',
    description: 'Automated test suite execution, edge-case generation, regression guardrails.',
    icon: 'CheckCircle2',
    isHeavyweight: true,
    activeStatus: 'IDLE'
  },
  SECURITY: {
    role: 'SECURITY',
    name: 'Sentinel Security Agent',
    codename: 'AEGIS-SHIELD',
    description: 'Validates API keys, guards sensitive filesystem bounds, denies dangerous calls.',
    icon: 'Lock',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  DOCUMENT: {
    role: 'DOCUMENT',
    name: 'Document Intelligence',
    codename: 'DOC-SYNTH',
    description: 'Generates and processes PDF, markdown, executive briefs, and structured sheets.',
    icon: 'FileText',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  COMMUNICATION: {
    role: 'COMMUNICATION',
    name: 'Comms & Outreach Agent',
    codename: 'VOICE-LINK',
    description: 'Drafts executive correspondence, telegram updates, and founder briefings.',
    icon: 'MessageSquare',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  MEMORY: {
    role: 'MEMORY',
    name: 'Synapse Memory Agent',
    codename: 'CHROMA-CORE',
    description: 'Semantic vector retrieval, project isolation maintenance, and knowledge curation.',
    icon: 'Database',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  },
  ECOSYSTEM: {
    role: 'ECOSYSTEM',
    name: 'Ecosystem Manager Agent',
    codename: 'NEXUS-ORCH',
    description: 'Discovers connected platforms (ICSN & ENVO), repository analysis & assistant onboarding.',
    icon: 'Network',
    isHeavyweight: true,
    activeStatus: 'IDLE'
  },
  DEPLOYMENT: {
    role: 'DEPLOYMENT',
    name: 'Deployment Gatekeeper Agent',
    codename: 'APEX-DEPLOY',
    description: 'Staging verification, rollback policies, health checks & production deployment approval.',
    icon: 'Rocket',
    isHeavyweight: false,
    activeStatus: 'IDLE'
  }
};

export interface AgentAssignmentPlan {
  leadAgent: AgentRole;
  supportingAgents: AgentRole[];
  maxConcurrency: number;
  estimatedMemoryFootprintMb: number;
}

export function planAgentSquad(taskIntent: string): AgentAssignmentPlan {
  const lower = taskIntent.toLowerCase();

  // Supervisor is always included for final verification
  if (
    lower.includes('kod') ||
    lower.includes('code') ||
    lower.includes('debug') ||
    lower.includes('build') ||
    lower.includes('refactor') ||
    lower.includes('develop') ||
    lower.includes('program')
  ) {
    return {
      leadAgent: 'DEVELOPER',
      supportingAgents: ['TESTING', 'SECURITY', 'SUPERVISOR'],
      maxConcurrency: 2,
      estimatedMemoryFootprintMb: 2400
    };
  }

  if (lower.includes('baza') || lower.includes('database') || lower.includes('sql') || lower.includes('supabase') || lower.includes('schema') || lower.includes('migration')) {
    return {
      leadAgent: 'DATABASE',
      supportingAgents: ['SECURITY', 'TESTING', 'SUPERVISOR'],
      maxConcurrency: 2,
      estimatedMemoryFootprintMb: 2100
    };
  }

  if (lower.includes('ecosystem') || lower.includes('onboard') || lower.includes('platform') || lower.includes('discover') || lower.includes('ulanish')) {
    return {
      leadAgent: 'ECOSYSTEM',
      supportingAgents: ['RESEARCH', 'DEVELOPER', 'SUPERVISOR'],
      maxConcurrency: 2,
      estimatedMemoryFootprintMb: 2200
    };
  }

  if (lower.includes('deploy') || lower.includes('ishga tushirish') || lower.includes('production') || lower.includes('staging')) {
    return {
      leadAgent: 'DEPLOYMENT',
      supportingAgents: ['SECURITY', 'TESTING', 'SUPERVISOR'],
      maxConcurrency: 1,
      estimatedMemoryFootprintMb: 1400
    };
  }

  if (lower.includes('tahlil') || lower.includes('research') || lower.includes('izlash') || lower.includes('qidiruv')) {
    return {
      leadAgent: 'RESEARCH',
      supportingAgents: ['ANALYST', 'DOCUMENT', 'SUPERVISOR'],
      maxConcurrency: 2,
      estimatedMemoryFootprintMb: 1800
    };
  }

  if (lower.includes('reja') || lower.includes('roadmap') || lower.includes('plan') || lower.includes('strategiya')) {
    return {
      leadAgent: 'PLANNING',
      supportingAgents: ['ANALYST', 'DOCUMENT', 'SUPERVISOR'],
      maxConcurrency: 1,
      estimatedMemoryFootprintMb: 1200
    };
  }

  if (lower.includes('xavfsizlik') || lower.includes('security') || lower.includes('audit') || lower.includes('icsn')) {
    return {
      leadAgent: 'SECURITY',
      supportingAgents: ['TESTING', 'DEVELOPER', 'SUPERVISOR'],
      maxConcurrency: 2,
      estimatedMemoryFootprintMb: 1600
    };
  }

  // General executive task
  return {
    leadAgent: 'SUPERVISOR',
    supportingAgents: ['PLANNING', 'MEMORY'],
    maxConcurrency: 1,
    estimatedMemoryFootprintMb: 950
  };
}
