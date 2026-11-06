export interface SystemCapabilityScore {
  category: 'REASONING' | 'CODE_INTELLIGENCE' | 'VOICE_QUALITY' | 'MEMORY_RECALL' | 'SECURITY' | 'HARDWARE_EFFICIENCY';
  score: number; // 0 to 100
  benchmark: string;
  lastTestedAt: string;
}

export interface ImprovementProposal {
  id: string;
  title: string;
  area: 'ARCHITECTURE' | 'MODELS' | 'AGENTS' | 'VOICE' | 'MEMORY' | 'DATABASE';
  description: string;
  projectedGain: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFTED' | 'TESTED_IN_SANDBOX' | 'AWAITING_APPROVAL' | 'APPLIED' | 'REJECTED';
  requiresFounderApproval: boolean;
  benchmarkDelta: string;
  createdAt: string;
}

export const INITIAL_CAPABILITY_SCORES: SystemCapabilityScore[] = [
  { category: 'REASONING', score: 94, benchmark: 'Qwen3:4b + Gemini Hybrid Lifecycle', lastTestedAt: '2026-11-05T08:00:00Z' },
  { category: 'CODE_INTELLIGENCE', score: 92, benchmark: 'Qwen2.5-Coder Syntax & Unit Test Suite', lastTestedAt: '2026-11-05T08:00:00Z' },
  { category: 'VOICE_QUALITY', score: 89, benchmark: 'Multilingual STT/TTS with Web Speech Audio Normalization', lastTestedAt: '2026-11-05T08:00:00Z' },
  { category: 'MEMORY_RECALL', score: 96, benchmark: 'Isolated Vector Partitions (VERON, ICSN, ENVO, JARVIS)', lastTestedAt: '2026-11-05T08:00:00Z' },
  { category: 'SECURITY', score: 99, benchmark: 'Section 18 Granular Autonomy & RLS Gatekeeping', lastTestedAt: '2026-11-05T08:00:00Z' },
  { category: 'HARDWARE_EFFICIENCY', score: 95, benchmark: 'Intel i7-1355U (2-Thread Cap, 3.2GB RAM Headroom)', lastTestedAt: '2026-11-05T08:00:00Z' }
];

export const INITIAL_PROPOSALS: ImprovementProposal[] = [
  {
    id: 'PROP-001',
    title: 'PostgreSQL Database Query Connection Pooling for ICSN & ENVO',
    area: 'DATABASE',
    description: 'Add client-side transaction pooling and prepared statement caching to reduce latency on AWS Supabase pooler connections by ~35%.',
    projectedGain: '+35% query response speed on Supabase',
    riskLevel: 'LOW',
    status: 'TESTED_IN_SANDBOX',
    requiresFounderApproval: true,
    benchmarkDelta: '+4.2% Database Efficiency',
    createdAt: '2026-11-05T08:30:00Z'
  },
  {
    id: 'PROP-002',
    title: 'Adaptive Quantization Memory Eviction on Ollama Models',
    area: 'MODELS',
    description: 'Automatically unload Qwen2.5-Coder when idle for > 15 minutes, freeing 1.95 GB RAM for OS background operations without latency penalty.',
    projectedGain: '+1.95 GB free RAM during non-coding sessions',
    riskLevel: 'LOW',
    status: 'AWAITING_APPROVAL',
    requiresFounderApproval: true,
    benchmarkDelta: '+6.1% Hardware Efficiency',
    createdAt: '2026-11-05T09:00:00Z'
  },
  {
    id: 'PROP-003',
    title: 'ICSN Embedded Assistant Scholarship Matching Algorithm v2',
    area: 'AGENTS',
    description: 'Enhance the ICSN Navigator AI tool with semantic embedding matching against 180+ global grants and visa quotas.',
    projectedGain: '+28% matching relevance for student profiles',
    riskLevel: 'MEDIUM',
    status: 'DRAFTED',
    requiresFounderApproval: true,
    benchmarkDelta: '+5.0% Reasoning & Student Accuracy',
    createdAt: '2026-11-05T09:10:00Z'
  }
];

/**
 * Validates self-improvement proposal safety guardrails (Section 10)
 */
export function validateSelfImprovementSafety(proposal: Partial<ImprovementProposal>): {
  isSafe: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const text = ((proposal.title || '') + ' ' + (proposal.description || '')).toLowerCase();

  if (text.includes('disable approval') || text.includes('bypass permission') || text.includes('grant admin')) {
    violations.push('VIOLATION: Proposals cannot alter security permissions or bypass Founder approval requirements.');
  }

  if (text.includes('delete backup') || text.includes('overwrite rollback') || text.includes('drop audit')) {
    violations.push('VIOLATION: Proposals cannot destroy rollback points, backups, or audit logging.');
  }

  if (text.includes('untrusted') || text.includes('download binary') || text.includes('remote exec without check')) {
    violations.push('VIOLATION: Untrusted binary or script execution is prohibited.');
  }

  return {
    isSafe: violations.length === 0,
    violations
  };
}
