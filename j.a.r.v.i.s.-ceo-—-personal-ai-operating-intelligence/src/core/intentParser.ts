export type TaskIntentType =
  | 'QUESTION'
  | 'INSTRUCTION'
  | 'RESEARCH'
  | 'CODING'
  | 'PROJECT_MANAGEMENT'
  | 'SYSTEM_COMMAND';

export type ProjectId = 'VERON' | 'ICSN' | 'ENVO' | 'JARVIS' | 'GENERAL';

export type LanguageCode = 'uz' | 'en' | 'ru';

export interface ExecutionLifecycleStep {
  phase: 'RECEIVE' | 'UNDERSTAND' | 'PLAN' | 'SELECT_TOOLS' | 'EXECUTE' | 'VERIFY' | 'REPORT';
  title: string;
  detail: string;
  completed: boolean;
}

export interface ParsedTaskIntent {
  intentType: TaskIntentType;
  projectId: ProjectId;
  detectedLanguage: LanguageCode;
  confidence: number;
  lifecyclePlan: ExecutionLifecycleStep[];
  requiresApproval: boolean;
}

export function detectLanguage(text: string): LanguageCode {
  const uzbekIndicators = /[ўқғҳ]|salom|tahlil|loyiha|reja|qurish|qil|qanday|ish|kod/i;
  const russianIndicators = /[а-яё]/i;

  if (uzbekIndicators.test(text)) return 'uz';
  if (russianIndicators.test(text)) return 'ru';
  return 'en';
}

export function detectProject(text: string): ProjectId {
  const upper = text.toUpperCase();
  if (upper.includes('VERON')) return 'VERON';
  if (upper.includes('ICSN')) return 'ICSN';
  if (upper.includes('ENVO')) return 'ENVO';
  if (upper.includes('JARVIS')) return 'JARVIS';
  return 'GENERAL';
}

export function parseTaskIntent(command: string): ParsedTaskIntent {
  const clean = command.trim();
  const lang = detectLanguage(clean);
  const project = detectProject(clean);

  let intentType: TaskIntentType = 'INSTRUCTION';

  const isCoding = /kod|dastur|debug|refactor|test|bug|git|api|typescript|python|react|funktsiya/i.test(clean);
  const isResearch = /qidiruv|izlash|tahlil|ma'lumot|search|research|investigate|analiz|рынок|исследуй/i.test(clean);
  const isQuestion = /\?|qanday|nima|nega|how|what|why|как|что|почему/i.test(clean);
  const isSystem = /reboot|status|tizim|xotira|ram|cpu|harorat|system|restart|clear/i.test(clean);
  const isProjectMgmt = /roadmap|reja|bosqich|milestone|deadline|muddat|plan|стратегия|план/i.test(clean);

  if (isSystem) {
    intentType = 'SYSTEM_COMMAND';
  } else if (isCoding) {
    intentType = 'CODING';
  } else if (isProjectMgmt) {
    intentType = 'PROJECT_MANAGEMENT';
  } else if (isResearch) {
    intentType = 'RESEARCH';
  } else if (isQuestion) {
    intentType = 'QUESTION';
  } else {
    intentType = 'INSTRUCTION';
  }

  // Check if operation modifies critical data or executes destructive actions
  const requiresApproval = /o'chirish|delete|drop|remove|tozalash|format|pul|to'lov|deploy|production|send/i.test(clean);

  const lifecyclePlan: ExecutionLifecycleStep[] = [
    {
      phase: 'RECEIVE',
      title: 'Command Registered',
      detail: `Input buffered in memory with project scope [${project}]`,
      completed: true
    },
    {
      phase: 'UNDERSTAND',
      title: 'Intent Parsed',
      detail: `Classified as ${intentType} (${lang.toUpperCase()}) with safety flags verified`,
      completed: true
    },
    {
      phase: 'PLAN',
      title: 'Action Strategy Drafted',
      detail: `Scoped subtasks and resource constraints configured`,
      completed: false
    },
    {
      phase: 'SELECT_TOOLS',
      title: 'Agent & Tool Routing',
      detail: `Delegating to specialized agents and sandbox environments`,
      completed: false
    },
    {
      phase: 'EXECUTE',
      title: 'Autonomous Execution',
      detail: `Executing non-destructive operations with real-time telemetry`,
      completed: false
    },
    {
      phase: 'VERIFY',
      title: 'Supervisor Verification',
      detail: `Validating output consistency, security, and edge cases`,
      completed: false
    },
    {
      phase: 'REPORT',
      title: 'Executive Briefing',
      detail: `Synthesizing final executive summary for the Founder`,
      completed: false
    }
  ];

  return {
    intentType,
    projectId: project,
    detectedLanguage: lang,
    confidence: 0.94,
    lifecyclePlan,
    requiresApproval
  };
}
