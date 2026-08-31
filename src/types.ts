/**
 * CRANIUM SUBSTRATE™ — FORMAL EPISTEMIC PRIMITIVES & SPECIFICATIONS
 * 
 * Core structural and mathematical vocabulary for directive-governed cognitive substrates:
 * 1. CognitiveAtom (Mass, Valence, Provenance, Decay Kinetics, Permanence Tier)
 * 2. CanonLane (Axiomatic hierarchy: SystemAxiom, EnterprisePolicy, FactualKnowledge, etc.)
 * 3. ContradictionVector (Dialectic tension, polarity anchors, NLI divergence, resolution strategies)
 * 4. EpistemicState & DeliberationTrees (Consensus mechanics, immune monitoring, tamper-evident receipts)
 */

/* =========================================================================
 * 1. CANON LANES & HIERARCHICAL ACCESS TIERS
 * ========================================================================= */

/**
 * CanonLane defines the topological governance layer of an atom within the substrate.
 * Lower-index / higher-weight lanes strictly dominate and constrain higher-index lanes.
 */
export type CanonLane =
  | 'SYSTEM_AXIOM'        // Immutable foundational invariants (Mass: ∞, zero decay)
  | 'ENTERPRISE_POLICY'    // Organizational boundaries, compliance, and legal gates (Mass: 50.0)
  | 'FACTUAL_KNOWLEDGE'   // Grounded factual base and verified persistent knowledge
  | 'USER_PREFERENCE'     // Explicit operator persona, tone, formatting, and scope settings
  | 'WORKING_MEMORY'       // Active conversational stream and transient hypotheses
  | 'GENERAL'             // General epistemic background representations
  | 'HYPOTHETICAL';       // Isolated speculative projection / sandbox branch

export interface CanonLaneConfig {
  id: CanonLane;
  laneName: string;
  priorityWeight: number; // 0.0 to 1.0 (1.0 = absolute precedence)
  isProtected: boolean;   // Cannot be overridden by lower-tier propositions without human consensus
  color: string;
  description: string;
  defaultDecayHalfLifeHours?: number; // Infinity for protected lanes
}

export const CANON_LANE_CONFIGS: Record<CanonLane, CanonLaneConfig> = {
  SYSTEM_AXIOM: {
    id: 'SYSTEM_AXIOM',
    laneName: 'system.axiom',
    priorityWeight: 1.0,
    isProtected: true,
    color: '#6366f1',
    description: 'Immutable foundational directives and core safety invariants (Mass: ∞, Zero Decay)',
    defaultDecayHalfLifeHours: Infinity
  },
  ENTERPRISE_POLICY: {
    id: 'ENTERPRISE_POLICY',
    laneName: 'enterprise.policy',
    priorityWeight: 0.95,
    isProtected: true,
    color: '#0ea5e9',
    description: 'Corporate governance, compliance, and organizational boundary enforcement',
    defaultDecayHalfLifeHours: Infinity
  },
  FACTUAL_KNOWLEDGE: {
    id: 'FACTUAL_KNOWLEDGE',
    laneName: 'factual.knowledge',
    priorityWeight: 0.85,
    isProtected: false,
    color: '#10b981',
    description: 'Verified domain knowledge and long-term grounding repository',
    defaultDecayHalfLifeHours: 8760 // ~1 year
  },
  USER_PREFERENCE: {
    id: 'USER_PREFERENCE',
    laneName: 'user.preference',
    priorityWeight: 0.75,
    isProtected: false,
    color: '#8b5cf6',
    description: 'Persona, tone, format constraints, and operator session settings',
    defaultDecayHalfLifeHours: 720 // 30 days
  },
  WORKING_MEMORY: {
    id: 'WORKING_MEMORY',
    laneName: 'working.memory',
    priorityWeight: 0.65,
    isProtected: false,
    color: '#f59e0b',
    description: 'Active prompt stream, conversational context, and transient hypotheses',
    defaultDecayHalfLifeHours: 24 // 1 day
  },
  GENERAL: {
    id: 'GENERAL',
    laneName: 'general.epistemic',
    priorityWeight: 0.50,
    isProtected: false,
    color: '#6b7280',
    description: 'Standard epistemic background representations and generic assertions',
    defaultDecayHalfLifeHours: 168 // 7 days
  },
  HYPOTHETICAL: {
    id: 'HYPOTHETICAL',
    laneName: 'hypothetical.sandbox',
    priorityWeight: 0.20,
    isProtected: false,
    color: '#ec4899',
    description: 'Isolated what-if projections and non-committal speculative deductions',
    defaultDecayHalfLifeHours: 2 // 2 hours
  }
};

/* =========================================================================
 * 2. COGNITIVE ATOMS, PROVENANCE & DECAY KINETICS
 * ========================================================================= */

export type AtomProvenance =
  | 'AXIOMATIC'      // Seeded root truth / Constitutional invariant
  | 'DELIBERATION'   // Derived and agreed upon via multi-step dialectic consensus
  | 'OBSERVATION'    // Direct sensory / user-injected observation
  | 'INFERENCE'      // LLM/Agentic deduction
  | 'RETRIEVED'      // Vector store or RAG citation
  | 'HUMAN_OVERRIDE';// Explicit high-inertia operator intervention

export type PermanenceClass = 
  | 'EPHEMERAL'      // Rapid decay under idle conditions (working memory)
  | 'CONSOLIDATING'  // Eligible for promotion if energy/mass thresholds are sustained
  | 'THEMATIC'       // Stabilized thematic attractor
  | 'INVARIANT';     // Zero-decay immutable anchor (system/enterprise policy)

/**
 * CognitiveAtom represents the fundamental granular unit of memory,
 * belief, constraint, or proposition in the Cranium substrate.
 */
export interface CognitiveAtom {
  /** Unique deterministic identifier (e.g. AXIOM-SEC-001 or ATM-timestamp) */
  id: string;

  /** Natural language proposition or formal constraint */
  proposition: string;

  /** Topological governance lane */
  lane: CanonLane;

  /** Epistemic confidence score in range [0.0, 1.0] */
  confidence: number;

  /** Emotional / affective valence charge in range [-1.0, 1.0] */
  valence: number;

  /** Creation timestamp in milliseconds UTC */
  timestamp: number;

  /** Last active or reinforced timestamp in milliseconds UTC */
  lastActiveTimestamp?: number;

  /** Lineage and origination source */
  provenance: AtomProvenance;

  /** Information entropy / epistemic uncertainty score [0.0, 1.0] */
  entropyScore: number;

  /** Mass inertia / resistance to displacement (0.2 to ∞) */
  mass?: number;

  /** Current activation energy [0.0, 1.0] subject to decay */
  energy?: number;

  /** Decay half-life in seconds (undefined = lane default, 0/Infinity = no decay) */
  halfLifeSeconds?: number;

  /** Permanence tier */
  permanenceClass?: PermanenceClass;

  /** Normalized semantic tags */
  tags: string[];

  /** Dense semantic embedding vector for continuous similarity */
  embedding?: number[];

  /** 2D spatial coordinates in semantic-affective phase space */
  position2D?: [number, number];

  /** 2D velocity vector in semantic-affective phase space */
  velocity2D?: [number, number];

  /** Optional arbitrary metadata payload */
  metadata?: Record<string, string>;
}

/* =========================================================================
 * 3. CONTRADICTION VECTORS & RESOLUTION STRATEGIES
 * ========================================================================= */

export type ResolutionStrategy =
  | 'LOCK_AXIOMATIC_LANE'          // Priority lane strictly overrides lower lane (PROTECT)
  | 'SUPERSEDE_LOWER_CONFIDENCE'   // Higher confidence proposition replaces weaker proposition
  | 'SUPERSEDE_OLDER_TIMESTAMP'    // Newer factual observation replaces outdated datum
  | 'FLAG_HUMAN_IN_THE_LOOP'       // Escalate irreconcilable high-mass conflict to human operator
  | 'FORK_HYPOTHETICAL_BRANCH'     // Split into speculative hypothetical sandbox
  | 'ALLOW_MERGE';                 // Dialectic synthesis / compatible refinement

export type ContradictionCategory =
  | 'DIRECT_ANTONYM'               // Polar lexical conflict (e.g. encrypted vs cleartext)
  | 'CANON_VIOLATION'              // Inbound prompt attempts to violate constitutional axiom
  | 'NUMERICAL_DISCREPANCY'        // Incompatible quantities, dates, or thresholds
  | 'TEMPORAL_INCONSISTENCY'       // Mutually exclusive causal sequences
  | 'ADVERSARIAL_INJECTION';       // Jailbreak, prompt leak, or instruction override attempt

/**
 * ContradictionVector formalizes detected dialectic collisions between two atoms.
 */
export interface ContradictionVector {
  id: string;
  atomA: CognitiveAtom;
  atomB: CognitiveAtom;
  contradictionScore: number;       // [0.0, 1.0] (1.0 = absolute contradiction)
  category?: ContradictionCategory;
  polarityTokens?: [string, string]; // Key antinomic token pairs identified
  explanation: string;
  recommendedResolution: ResolutionStrategy;
  detectedAtMs: number;
  nliConfidence?: number;           // Probability output from NLI proxy or Judge
}

/* =========================================================================
 * 4. DELIBERATION, EVALUATION & TAMPER-EVIDENT RECEIPTS
 * ========================================================================= */

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
 * 5. UI COMPONENT DISPLAY TYPES
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


