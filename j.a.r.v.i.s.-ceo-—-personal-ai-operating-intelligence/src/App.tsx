import React, { useState, useEffect, useCallback } from 'react';
import { NavigationSidebar, WorkspaceTab } from './components/NavigationSidebar';
import { TopBar } from './components/TopBar';
import { CoreStatus } from './components/ArcReactorCore';
import { OverviewView } from './views/OverviewView';
import { ChatView, ChatMessage } from './views/ChatView';
import { MissionControlView, MissionItem, MissionStatus } from './views/MissionControlView';
import { DeveloperStudioView } from './views/DeveloperStudioView';
import { IntelligenceCenterView } from './views/IntelligenceCenterView';
import { MemoryCenterView } from './views/MemoryCenterView';
import { CeoWorkspaceView } from './views/CeoWorkspaceView';
import { SystemMonitorView } from './views/SystemMonitorView';
import { IntegrationsView } from './views/IntegrationsView';
import { SettingsView } from './views/SettingsView';
import { EcosystemManagerView } from './views/EcosystemManagerView';
import { IcsnControlView } from './views/IcsnControlView';
import { EnvoControlView } from './views/EnvoControlView';
import { useJarvisVoice } from './hooks/useJarvisVoice';
import { parseTaskIntent, ParsedTaskIntent } from './core/intentParser';
import { INITIAL_MEMORIES, MemoryEntry } from './core/memoryStore';
import { planAgentSquad } from './core/agentOrchestrator';
import { INITIAL_PLATFORMS, ConnectedPlatformId } from './core/ecosystemEngine';

const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'MSN-ENVO-01',
    title: 'ENVO loyihasining qolib ketgan vazifalarini tahlil qilish',
    description: 'Quyosh va yashil mikrotarmoq modellarini audit qilish, resurslarni optimallashtirish va yangi rivojlanish bosqichini shakllantirish.',
    project: 'ENVO',
    priority: 'HIGH',
    status: 'RUNNING',
    progressPercent: 68,
    leadAgent: 'RESEARCH',
    supportingAgents: ['ANALYST', 'DOCUMENT', 'SUPERVISOR'],
    steps: [
      { id: 's-1', title: 'Loyihaning hozirgi arxitekturasini tekshirish', detail: 'ENVO texnik spetsifikatsiyalari o\'rganildi', status: 'COMPLETED', agent: 'RESEARCH' },
      { id: 's-2', title: 'Qayta tiklanuvchi energiya telemetriyasi', detail: 'Algoritmik aniqlik 96.4% ko\'rsatkichda', status: 'COMPLETED', agent: 'ANALYST' },
      { id: 's-3', title: 'Rivojlanish yo\'l xaritasi (Roadmap) tuzish', detail: 'Keyingi chorak uchun ustuvor vazifalar yozilmoqda', status: 'RUNNING', agent: 'DOCUMENT' },
      { id: 's-4', title: 'Supervisor tasdig\'i', detail: 'Natijalarni Founder uchun xulosalash', status: 'PENDING', agent: 'SUPERVISOR' }
    ],
    logs: [
      `[09:00:12] Missiya boshlandi. Resurslar Intel i7-1355U yadrosiga taqsimlandi.`,
      `[09:04:45] Research Agent manbalar va telemetriya parametrlarini tekshirdi.`,
      `[09:12:30] Roadmap hujjati generatsiya qilinmoqda.`
    ],
    createdAt: '2026-11-05T09:00:00Z',
    updatedAt: '2026-11-05T09:15:00Z'
  },
  {
    id: 'MSN-ICSN-02',
    title: 'ICSN kiberxavfsizlik perimetri va zero-trust auditi',
    description: 'Portlar skaneri, kiruvchi so\'rovlar shifrlanishi va avtomatlashtirilgan xavfsizlik sinovlarini o\'tkazish.',
    project: 'ICSN',
    priority: 'CRITICAL',
    status: 'COMPLETED',
    progressPercent: 100,
    leadAgent: 'SECURITY',
    supportingAgents: ['TESTING', 'DEVELOPER', 'SUPERVISOR'],
    steps: [
      { id: 's-1', title: 'Tarmoq perimetrini tahlil qilish', detail: '142 ta kirish nuqtasi tekshirildi', status: 'COMPLETED', agent: 'SECURITY' },
      { id: 's-2', title: 'Kriptografik sertifikatlar tekshiruvi', detail: 'TLS 1.3 va AES-256 tasdiqlandi', status: 'COMPLETED', agent: 'SECURITY' },
      { id: 's-3', title: 'Zaiflik hisoboti', detail: 'Xavf aniqlanmadi (0-day yo\'q)', status: 'COMPLETED', agent: 'SUPERVISOR' }
    ],
    logs: [
      `[08:15:00] Kiberxavfsizlik auditi boshlandi.`,
      `[08:30:20] Barcha sinovlar yakunlandi. Zaifliklar topilmadi.`
    ],
    createdAt: '2026-11-05T08:15:00Z',
    updatedAt: '2026-11-05T08:30:20Z'
  },
  {
    id: 'MSN-VERON-03',
    title: 'VERON apparat telemetriyasi va sensorlar integratsiyasi',
    description: 'Logistika apparat modullari bilan uzluksiz ma\'lumotlar almashinuvi mikroxizmatini yangilash.',
    project: 'VERON',
    priority: 'MEDIUM',
    status: 'PLANNING',
    progressPercent: 25,
    leadAgent: 'DEVELOPER',
    supportingAgents: ['TESTING', 'SECURITY', 'SUPERVISOR'],
    steps: [
      { id: 's-1', title: 'FastAPI marshrutlarini loyihalash', detail: 'Telemetriya protokoli tuzilmoqda', status: 'RUNNING', agent: 'DEVELOPER' },
      { id: 's-2', title: 'Unit testlar to\'plamini yozish', detail: 'node:test orqali tekshirish', status: 'PENDING', agent: 'TESTING' }
    ],
    logs: [
      `[10:00:00] VERON apparat topshirig'i qabul qilindi.`
    ],
    createdAt: '2026-11-05T10:00:00Z',
    updatedAt: '2026-11-05T10:05:00Z'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>('OVERVIEW');
  const [selectedProject, setSelectedProject] = useState<string>('GENERAL');
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [language, setLanguage] = useState<'uz' | 'en' | 'ru'>('uz');
  const [coreStatus, setCoreStatus] = useState<CoreStatus>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Intent & Missions State
  const [lastParsedIntent, setLastParsedIntent] = useState<ParsedTaskIntent | null>(null);
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);
  const [memories, setMemories] = useState<MemoryEntry[]>(INITIAL_MEMORIES);
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);

  const handleTriggerDiscovery = async (platformId: ConnectedPlatformId) => {
    try {
      const res = await fetch('/api/ecosystem/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId })
      });
      if (res.ok) {
        const data = await res.json();
        setPlatforms(prev => ({ ...prev, [platformId]: data.platform }));
      }
    } catch {
      setPlatforms(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          discoveryStatus: 'ONBOARDED',
          lastDiscoveredAt: new Date().toISOString()
        }
      }));
    }
  };

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: `Salom, Janob. J.A.R.V.I.S. tizimi onlayn holatda.\nHost muhiti: C:\\Users\\acer\\jarvis-project\\jarvis-kernel\nProtsessor: Intel Core i7-1355U | Operativ xotira: 15.7 GB\nLokal modellar: Qwen3:4b va Qwen2.5-Coder:3b to'liq tayyor.\n\nBugun qaysi loyiha bo'yicha ishlaymiz? (VERON, ICSN, ENVO yoki umumiy dasturlash)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'qwen3:4b (Local)',
      provider: 'Local Kernel',
      project: 'GENERAL'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Telemetry & Ollama Status
  const [ollamaConnected, setOllamaConnected] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState<any>({
    cpu: { currentLoadPercent: 22, temperatureCelsius: 44 },
    memory: { usedGb: 4.8, totalGb: 15.7, heapUsedMb: 42 },
    gpu: { loadPercent: 12 }
  });

  // Fetch real system metrics from backend
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/system/metrics');
      if (res.ok) {
        const data = await res.json();
        setSystemMetrics(data);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch Ollama health
  const checkOllama = useCallback(async () => {
    try {
      const res = await fetch('/api/ollama/status');
      if (res.ok) {
        const data = await res.json();
        setOllamaConnected(data.connected);
      }
    } catch {
      setOllamaConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    checkOllama();
    const interval = setInterval(() => {
      fetchMetrics();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchMetrics, checkOllama]);

  // Handle Command Submission
  const handleExecuteCommand = async (command: string) => {
    if (!command.trim()) return;

    // 1. RECEIVE & UNDERSTAND
    setCoreStatus('THINKING');
    const parsed = parseTaskIntent(command);
    setLastParsedIntent(parsed);

    if (parsed.projectId !== 'GENERAL') {
      setSelectedProject(parsed.projectId);
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: command,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      project: parsed.projectId
    };
    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // 2. PLAN & SELECT TOOLS
      const squad = planAgentSquad(command);

      // 3. EXECUTE via Backend API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: command,
          model: selectedModel,
          language,
          project: parsed.projectId,
          conversationHistory: messages.slice(-5)
        })
      });

      let replyText = '';
      let modelUsed = selectedModel;
      let provider = 'Local Kernel';

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
        modelUsed = data.modelUsed;
        provider = data.provider;
      } else {
        replyText = `Buyruq qabul qilindi, Janob. Topshiriq [${parsed.projectId}] loyihasi doirasida qayta ishlandi va xotiraga kiritildi.`;
      }

      // Add assistant response
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed,
        provider,
        project: parsed.projectId,
        executionPlan: parsed.lifecyclePlan.slice(0, 4)
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsChatLoading(false);

      // If it's a mission-like instruction, also register it in Mission Control
      if (parsed.intentType === 'RESEARCH' || parsed.intentType === 'PROJECT_MANAGEMENT' || parsed.intentType === 'CODING') {
        const newMsn: MissionItem = {
          id: `MSN-${parsed.projectId}-${Date.now().toString().slice(-4)}`,
          title: command.slice(0, 60),
          description: command,
          project: parsed.projectId,
          priority: parsed.requiresApproval ? 'CRITICAL' : 'HIGH',
          status: parsed.requiresApproval ? 'APPROVAL_REQUIRED' : 'RUNNING',
          progressPercent: 40,
          leadAgent: squad.leadAgent,
          supportingAgents: squad.supportingAgents,
          steps: [
            { id: 'st-1', title: 'Buyruq tahlili va parametrlar', detail: 'Intent to\'liq ajratildi', status: 'COMPLETED', agent: 'PLANNING' },
            { id: 'st-2', title: 'Agent jamoasi ijrosi', detail: `${squad.leadAgent} vazifani bajarmoqda`, status: 'RUNNING', agent: squad.leadAgent },
            { id: 'st-3', title: 'Xulosa tekshiruvi', detail: 'Supervisor verification', status: 'PENDING', agent: 'SUPERVISOR' }
          ],
          logs: [
            `[${new Date().toLocaleTimeString()}] Vazifa intenti aniqlandi: ${parsed.intentType}`,
            `[${new Date().toLocaleTimeString()}] Resurslar: ${squad.maxConcurrency} parallel thread`
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setMissions(prev => [newMsn, ...prev]);
      }

      // 4. REPORT & SPEAK
      if (!isMuted && autoSpeak) {
        setCoreStatus('SPEAKING');
        speakText(replyText);
        setTimeout(() => setCoreStatus('IDLE'), 4000);
      } else {
        setCoreStatus('IDLE');
      }
    } catch (err: any) {
      setIsChatLoading(false);
      setCoreStatus('ERROR');
      setTimeout(() => setCoreStatus('IDLE'), 3000);
    }
  };

  // Voice Controller hook
  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    wakeWordActive,
    setWakeWordActive
  } = useJarvisVoice({
    language,
    autoSpeakResponse: autoSpeak && !isMuted,
    onCommandRecognized: cmd => {
      handleExecuteCommand(cmd);
    }
  });

  // Emergency Halt
  const handleEmergencyStop = () => {
    stopSpeaking();
    stopListening();
    setCoreStatus('IDLE');
    setMissions(prev =>
      prev.map(m => (m.status === 'RUNNING' ? { ...m, status: 'PENDING' } : m))
    );
  };

  // Mission actions
  const handleDispatchMission = (newMission: Omit<MissionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: MissionItem = {
      ...newMission,
      id: `MSN-${newMission.project}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMissions(prev => [item, ...prev]);
  };

  const handleUpdateMissionStatus = (id: string, status: MissionStatus) => {
    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, status, updatedAt: new Date().toISOString() } : m))
    );
  };

  const handleApproveMission = (id: string) => {
    setMissions(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status: 'RUNNING',
              progressPercent: Math.max(50, m.progressPercent),
              logs: [...m.logs, `[${new Date().toLocaleTimeString()}] Founder tomonidan tasdiqlandi (Approved).`]
            }
          : m
      )
    );
  };

  // Memory actions
  const handleAddMemory = (entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: MemoryEntry = {
      ...entry,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMemories(prev => [newEntry, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100 font-sans select-none">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeMissionCount={missions.filter(m => m.status === 'RUNNING').length}
        ollamaConnected={ollamaConnected}
        isSpeaking={isSpeaking}
      />

      {/* Main Command Console Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <TopBar
          coreStatus={coreStatus}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          language={language}
          onSelectLanguage={setLanguage}
          isListening={isListening}
          onToggleListening={() => (isListening ? stopListening() : startListening())}
          isSpeaking={isSpeaking}
          onToggleMute={() => {
            if (!isMuted) stopSpeaking();
            setIsMuted(!isMuted);
          }}
          isMuted={isMuted}
          onEmergencyStop={handleEmergencyStop}
        />

        {/* Dynamic Workspace View Router */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentTab === 'OVERVIEW' && (
            <OverviewView
              coreStatus={coreStatus}
              setCoreStatus={setCoreStatus}
              onSendCommand={handleExecuteCommand}
              isListening={isListening}
              onToggleListening={() => (isListening ? stopListening() : startListening())}
              lastParsedIntent={lastParsedIntent}
              activeMissionsCount={missions.filter(m => m.status === 'RUNNING').length}
              systemMetrics={systemMetrics}
              ollamaConnected={ollamaConnected}
              onOpenProjectWorkspace={proj => {
                setSelectedProject(proj);
                if (proj === 'ICSN') setCurrentTab('ICSN_CONTROL');
                else if (proj === 'ENVO') setCurrentTab('ENVO_CONTROL');
                else setCurrentTab('CEO');
              }}
            />
          )}

          {currentTab === 'CHAT' && (
            <ChatView
              messages={messages}
              onSendMessage={handleExecuteCommand}
              isLoading={isChatLoading}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              language={language}
              isListening={isListening}
              onToggleListening={() => (isListening ? stopListening() : startListening())}
              onSpeakText={text => speakText(text)}
              onClearHistory={() => setMessages([])}
            />
          )}

          {currentTab === 'MISSIONS' && (
            <MissionControlView
              missions={missions}
              onDispatchMission={handleDispatchMission}
              onUpdateMissionStatus={handleUpdateMissionStatus}
              onApproveMission={handleApproveMission}
            />
          )}

          {currentTab === 'DEV_STUDIO' && <DeveloperStudioView />}

          {currentTab === 'ECOSYSTEM' && (
            <EcosystemManagerView
              platforms={platforms}
              onTriggerDiscovery={handleTriggerDiscovery}
              onNavigateToPlatform={tab => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'ICSN_CONTROL' && (
            <IcsnControlView
              onDispatchChatCommand={prompt => {
                setCurrentTab('CHAT');
                handleExecuteCommand(prompt);
              }}
            />
          )}

          {currentTab === 'ENVO_CONTROL' && (
            <EnvoControlView
              onDispatchChatCommand={prompt => {
                setCurrentTab('CHAT');
                handleExecuteCommand(prompt);
              }}
            />
          )}

          {currentTab === 'INTELLIGENCE' && (
            <IntelligenceCenterView
              ollamaConnected={ollamaConnected}
              onRefreshOllama={checkOllama}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          )}

          {currentTab === 'MEMORY' && (
            <MemoryCenterView
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === 'CEO' && (
            <CeoWorkspaceView
              onDispatchTask={prompt => {
                setCurrentTab('CHAT');
                handleExecuteCommand(prompt);
              }}
            />
          )}

          {currentTab === 'SYSTEM' && (
            <SystemMonitorView
              metrics={systemMetrics}
              ollamaConnected={ollamaConnected}
              currentProject={selectedProject}
            />
          )}

          {currentTab === 'INTEGRATIONS' && (
            <IntegrationsView
              ollamaConnected={ollamaConnected}
              onRefreshOllama={checkOllama}
            />
          )}

          {currentTab === 'SETTINGS' && (
            <SettingsView
              language={language}
              onSelectLanguage={setLanguage}
              wakeWordActive={wakeWordActive}
              onToggleWakeWord={setWakeWordActive}
              autoSpeak={autoSpeak}
              onToggleAutoSpeak={setAutoSpeak}
            />
          )}
        </main>
      </div>
    </div>
  );
}
