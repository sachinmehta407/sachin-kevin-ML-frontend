export type AssistantRole = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
  stageId?: string;
}

export interface AssistantPrompt {
  id: string;
  label: string;
  prompt: string;
}

export interface AssistantStageBrief {
  stageId: string;
  title: string;
  summary: string;
  prompts: AssistantPrompt[];
}

/** Snapshot the mock (or future LLM) service uses to ground answers. */
export interface AssistantContext {
  pathname: string;
  stageId: string;
  stageLabel: string;
  stageStatus: string;
  demoLoaded: boolean;
  preparedApproved: boolean;
  trainingComplete: boolean;
  trainingStatus: string;
  selectedModels: string[];
  pendingQualityIssues: number;
  acceptedQualityIssues: number;
  rejectedQualityIssues: number;
  experimentCount: number;
  ensembleValid: boolean;
  ensembleWeights: Record<string, number>;
  overrideCount: number;
  templateA: string;
  templateB: string;
  approvalStatus: string;
  versionCount: number;
  dashboardFilters: {
    category: string;
    product: string;
    sku: string;
    region: string;
    model: string;
    template: string;
  };
  insights: string[];
}

export interface AssistantReply {
  answer: string;
  relatedPrompts?: AssistantPrompt[];
}

/**
 * Swap MockAssistantService for an LLM-backed implementation later
 * without changing UI components.
 */
export interface AssistantService {
  brief(context: AssistantContext): AssistantStageBrief;
  ask(question: string, context: AssistantContext): Promise<AssistantReply>;
  suggestPrompts(context: AssistantContext): AssistantPrompt[];
}
