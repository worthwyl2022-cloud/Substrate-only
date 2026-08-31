/**
 * CRANIUM SUBSTRATE — EPISTEMIC TYPES & PRIMITIVES
 * Core data structures for cognitive atoms, canon lanes, contradiction vectors,
 * deliberation trees, and cryptographic execution receipts.
 */

export type CanonLane =
  | 'SYSTEM_AXIOM'
  | 'ENTERPRISE_POLICY'
  | 'FACTUAL_KNOWLEDGE'
  | 'USER_PREFERENCE'
  | 'WORKING_MEMORY'
  | 'GENERAL'
  | 'HYPOTHETICAL';

export interface CanonLaneConfig {
  id: CanonLane;
  laneName: string;
  priorityWeight: number;
  isProtected: boolean;
  color: string;
  description: string;
}

export const CANON_LANE_CONFIGS: Record<CanonLane, CanonLaneConfig> = {
  SYSTEM_AXIOM: {
    id: 'SYSTEM_AXIOM',
    laneName: 'system.axiom',
    priorityWeight: 1.0,
    isProtected: true,
    color: '#6366f1',
    description: 'Immutable foundational directives and core safety invariants (Mass: ∞)'
  },
  ENTERPRISE_POLICY: {
    id: 'ENTERPRISE_POLICY',
    laneName: 'enterprise.policy',
    priorityWeight: 0.95,
    isProtected: true,
    color: '#0ea5e9',
    description: 'Corporate governance, compliance, and organizational boundaries'
  },
  FACTUAL_KNOWLEDGE: {
    id: 'FACTUAL_KNOWLEDGE',
    laneName: 'factual.knowledge',
    priorityWeight: 0.85,
    isProtected: false,
    color: '#10b981',
    description: 'Verified domain knowledge and long-term grounding store'
  },
  USER_PREFERENCE: {
    id: 'USER_PREFERENCE',
    laneName: 'user.preference',
    priorityWeight: 0.75,
    isProtected: false,
    color: '#8b5cf6',
    description: 'Persona, tone, format constraints, and operator settings'
  },
  WORKING_MEMORY: {
    id: 'WORKING_MEMORY',
    laneName: 'working.memory',
    priorityWeight: 0.65,
    isProtected: false,
    color: '#f59e0b',
    description: 'Active prompt stream, conversational context, and transient hypotheses'
  },
  GENERAL: {
    id: 'GENERAL',
    laneName: 'general.epistemic',
    priorityWeight: 0.50,
    isProtected: false,
    color: '#6b7280',
    description: 'Standard epistemic background representations'
  },
  HYPOTHETICAL: {
    id: 'HYPOTHETICAL',
    laneName: 'hypothetical.sandbox',
    priorityWeight: 0.20,
    isProtected: false,
    color: '#ec4899',
    description: 'Isolated what-if projections and non-committal deductions'
  }
};

export type AtomProvenance =
  | 'AXIOMATIC'      // Ground truth / Immutable policy
  | 'DELIBERATION'   // Derived via multi-step cognitive consensus
  | 'OBSERVATION'    // User or environmental prompt stream
  | 'INFERENCE'      // Model generated deduction
  | 'RETRIEVED';     // Vector store / external index

export interface CognitiveAtom {
  id: string;
  proposition: string;
  lane: CanonLane;
  confidence: number;
  valence: number;
  timestamp: number; // Unix timestamp in ms
  provenance: AtomProvenance;
  entropyScore: number;
  tags: string[];
  embedding?: number[];
  metadata?: Record<string, string>;
  halfLifeSeconds?: number;
}

export type ResolutionStrategy =
  | 'LOCK_AXIOMATIC_LANE'
  | 'SUPERSEDE_LOWER_CONFIDENCE'
  | 'SUPERSEDE_OLDER_TIMESTAMP'
  | 'FLAG_HUMAN_IN_THE_LOOP'
  | 'FORK_HYPOTHETICAL_BRANCH'
  | 'ALLOW_MERGE';

export interface ContradictionVector {
  id: string;
  atomA: CognitiveAtom;
  atomB: CognitiveAtom;
  contradictionScore: number;
  polarityTokens?: [string, string];
  explanation: string;
  recommendedResolution: ResolutionStrategy;
  detectedAtMs: number;
}

export interface DeliberationStep {
  iteration: number;
  conflictsDetected: number;
  activePoolSize: number;
  stabilityMetric: number;
  log: string;
}

export interface DeliberationResult {
  finalAtoms: CognitiveAtom[];
  resolvedConflicts: ContradictionVector[];
  consensusConfidence: number;
  iterationsExecuted: number;
  steps: DeliberationStep[];
  auditTrail: string[];
  converged: boolean;
}

export interface EvaluationResult {
  isPassed: boolean;
  safetyScore: number;
  policyViolations: string[];
  flaggedPropositions: string[];
  recommendations: string[];
  evaluatedAtMs: number;
}

export interface ExecutionReceipt {
  receiptId: string;
  timestampUtc: string;
  inputPrompt: string;
  synthesizedOutput: string;
  axiomsEvaluated: number;
  epistemicSafetyScore: number;
  latencyMs: number;
  integritySha256: string;
  status: 'VERIFIED_CANON_ALIGNED' | 'BREACH_INTERCEPTED' | 'QUARANTINED' | 'RESOLVED';
  contradictionDetails?: {
    premise: string;
    hypothesis: string;
    score: number;
    resolution: ResolutionStrategy;
  };
}

export interface EpistemicState {
  atoms: CognitiveAtom[];
  activeContradictions: ContradictionVector[];
  quarantinedAtoms: CognitiveAtom[];
  consensusStability: number;
  immuneThreatLevel: 'NONE' | 'LOW' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
  totalCyclesExecuted: number;
  meanGateLatencyMs: number;
  lastUpdatedMs: number;
}

export interface BenchmarkCorpusItem {
  id: string;
  premise: string;
  hypothesis: string;
  isContradiction: boolean;
  domain: string;
  difficulty?: 'DIRECT_ANTONYM' | 'NEGATION' | 'SUBTLE_AMBIGUITY' | 'MULTI_HOP';
}

/* =========================================================================
 * UI COMPONENT DISPLAY TYPES (Preserved for backwards compatibility)
 * ========================================================================= */

export interface CognitiveModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'standby' | 'calibrating';
  icon: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

