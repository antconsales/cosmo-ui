/**
 * Cosmo UI AI Metadata System v1.0
 *
 * Every AI-generated component carries metadata about how and why it was created.
 * This enables debugging, learning, and continuous improvement of AI generation.
 */

// ============================================================================
// AI CONFIDENCE SCORE
// ============================================================================

/**
 * Confidence breakdown for AI-generated components
 */
export interface AIConfidence {
  /** Overall confidence score (0-1) */
  overall: number;

  /** Confidence in component type selection */
  componentChoice?: number;

  /** Confidence in content appropriateness */
  contentRelevance?: number;

  /** Confidence in visual styling */
  styling?: number;

  /** Confidence in timing/priority */
  timing?: number;

  /** Confidence in spatial placement */
  spatial?: number;
}

/**
 * Interpret confidence level
 */
export type ConfidenceLevel = "very-low" | "low" | "medium" | "high" | "very-high";

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score < 0.2) return "very-low";
  if (score < 0.4) return "low";
  if (score < 0.6) return "medium";
  if (score < 0.8) return "high";
  return "very-high";
}

// ============================================================================
// AI REASONING
// ============================================================================

/**
 * AI's reasoning for decisions made
 */
export interface AIReasoning {
  /** Why this component type was chosen */
  componentChoice?: string;

  /** Why this variant/style was selected */
  styleChoice?: string;

  /** Why this content was generated */
  contentChoice?: string;

  /** Why this position/intent was selected */
  spatialChoice?: string;

  /** Why this priority was assigned */
  priorityChoice?: string;

  /** Any assumptions made */
  assumptions?: string[];

  /** Alternatives that were considered */
  alternatives?: AlternativeOption[];
}

export interface AlternativeOption {
  /** What alternative was considered */
  option: string;

  /** Why it was rejected */
  rejectionReason: string;

  /** Confidence if this option had been chosen */
  alternativeConfidence?: number;
}

// ============================================================================
// AI SOURCE TRACKING
// ============================================================================

/**
 * Track which AI model/agent generated the component
 */
export interface AISource {
  /** Unique agent identifier */
  agentId: string;

  /** Type of agent */
  agentType:
    | "assistant"      // General purpose assistant
    | "notification"   // Notification system
    | "calendar"       // Calendar/scheduling agent
    | "health"         // Health/fitness agent
    | "navigation"     // Navigation/maps agent
    | "communication"  // Messages/calls agent
    | "media"          // Media player agent
    | "system"         // System/device agent
    | "custom";        // Custom agent type

  /** Model used (e.g., "claude-3.5-sonnet", "gpt-4", "gemini-pro") */
  model?: string;

  /** Model version */
  modelVersion?: string;

  /** Timestamp of generation */
  generatedAt: string;

  /** Session ID for tracking */
  sessionId?: string;

  /** Request ID for debugging */
  requestId?: string;

  /** Token count used */
  tokensUsed?: number;

  /** Latency in milliseconds */
  latencyMs?: number;
}

// ============================================================================
// AI GENERATION CONTEXT
// ============================================================================

/**
 * Context that was available when AI generated the component
 */
export interface AIGenerationContext {
  /** User's original query/input */
  userInput?: string;

  /** System context provided */
  systemContext?: string;

  /** Current conversation/interaction history length */
  conversationLength?: number;

  /** Previous components shown (for coherence) */
  previousComponents?: string[];

  /** Active user context at generation time */
  userContext?: {
    activity?: string;
    location?: string;
    timeOfDay?: string;
    deviceType?: string;
  };

  /** Any tools/data sources consulted */
  toolsUsed?: string[];

  /** External data sources */
  dataSources?: string[];
}

// ============================================================================
// AI FEEDBACK LOOP
// ============================================================================

/**
 * User feedback for improving AI generation
 */
export interface AIFeedback {
  /** Component ID this feedback is for */
  componentId: string;

  /** Feedback type */
  type:
    | "helpful"
    | "not-helpful"
    | "incorrect"
    | "inappropriate"
    | "wrong-timing"
    | "wrong-style"
    | "too-intrusive"
    | "too-subtle"
    | "custom";

  /** User's feedback message */
  message?: string;

  /** What action user took */
  userAction: "dismissed" | "engaged" | "ignored" | "complained";

  /** Time to interaction (ms) */
  timeToInteraction?: number;

  /** Whether user modified the component */
  wasModified?: boolean;

  /** Timestamp */
  timestamp: string;
}

// ============================================================================
// COMPLETE AI METADATA
// ============================================================================

/**
 * Complete AI metadata attached to every generated component
 */
export interface AIMetadata {
  /** Confidence scores */
  confidence: AIConfidence;

  /** AI's reasoning */
  reasoning?: AIReasoning;

  /** Source agent information */
  source: AISource;

  /** Generation context */
  context?: AIGenerationContext;

  /** Validation results */
  validation?: {
    /** Whether component passed validation */
    passed: boolean;
    /** Warnings generated */
    warnings?: string[];
    /** Auto-corrections applied */
    corrections?: string[];
  };

  /** Learning/improvement flags */
  learning?: {
    /** Should this be used as training example? */
    useAsExample?: boolean;
    /** Quality rating (if reviewed) */
    qualityRating?: 1 | 2 | 3 | 4 | 5;
    /** Review notes */
    reviewNotes?: string;
  };
}

// ============================================================================
// MULTI-AGENT COORDINATION
// ============================================================================

/**
 * When multiple AI agents can generate UI, this coordinates them
 */
export interface MultiAgentConfig {
  /** Priority rules for different agent types */
  agentPriorities: Record<AISource["agentType"], number>;

  /** Maximum concurrent components per agent */
  maxPerAgent: number;

  /** How to handle conflicts */
  conflictResolution: "priority" | "timestamp" | "merge" | "user-choice";

  /** Whether agents can override each other */
  allowOverride: boolean;

  /** Rate limiting per agent (components per minute) */
  rateLimit?: number;
}

export const DEFAULT_MULTI_AGENT_CONFIG: MultiAgentConfig = {
  agentPriorities: {
    system: 100,
    navigation: 90,
    communication: 80,
    calendar: 70,
    health: 60,
    notification: 50,
    media: 40,
    assistant: 30,
    custom: 20,
  },
  maxPerAgent: 3,
  conflictResolution: "priority",
  allowOverride: true,
  rateLimit: 10,
};

/**
 * Request to add component from an agent
 */
export interface AgentUIRequest {
  /** Requesting agent */
  source: AISource;

  /** Component type */
  componentType: string;

  /** Component data */
  componentData: unknown;

  /** AI metadata */
  metadata: AIMetadata;

  /** Spatial configuration */
  spatialConfig?: {
    intent: string;
    urgency?: string;
  };

  /** Time-to-live (seconds, 0 = permanent) */
  ttl?: number;
}

/**
 * Coordinator response
 */
export interface AgentUIResponse {
  /** Whether request was accepted */
  accepted: boolean;

  /** Assigned component ID (if accepted) */
  componentId?: string;

  /** Reason for rejection */
  rejectionReason?: string;

  /** Position adjustments made */
  adjustments?: {
    /** Spatial adjustments */
    spatial?: string;
    /** Priority adjustments */
    priority?: string;
    /** Content adjustments */
    content?: string;
  };

  /** Queue position (if rate limited) */
  queuePosition?: number;
}

// ============================================================================
// AGENT COORDINATION FUNCTIONS
// ============================================================================

export interface ActiveComponent {
  id: string;
  source: AISource;
  priority: number;
  expiresAt?: number;
}

/**
 * Check if agent can add a component
 */
export function canAgentAddComponent(
  agentType: AISource["agentType"],
  activeComponents: ActiveComponent[],
  config: MultiAgentConfig = DEFAULT_MULTI_AGENT_CONFIG
): { allowed: boolean; reason?: string } {
  // Count components from this agent
  const agentCount = activeComponents.filter(
    (c) => c.source.agentType === agentType
  ).length;

  if (agentCount >= config.maxPerAgent) {
    return {
      allowed: false,
      reason: `Agent ${agentType} has reached maximum ${config.maxPerAgent} components`,
    };
  }

  return { allowed: true };
}

/**
 * Resolve conflict between components
 */
export function resolveAgentConflict(
  existing: ActiveComponent,
  incoming: AgentUIRequest,
  config: MultiAgentConfig = DEFAULT_MULTI_AGENT_CONFIG
): "keep-existing" | "replace" | "merge" | "ask-user" {
  if (config.conflictResolution === "user-choice") {
    return "ask-user";
  }

  if (config.conflictResolution === "merge") {
    return "merge";
  }

  const existingPriority = config.agentPriorities[existing.source.agentType] ?? 0;
  const incomingPriority = config.agentPriorities[incoming.source.agentType] ?? 0;

  if (config.conflictResolution === "priority") {
    return incomingPriority > existingPriority ? "replace" : "keep-existing";
  }

  // Timestamp-based
  const existingTime = new Date(existing.source.generatedAt).getTime();
  const incomingTime = new Date(incoming.source.generatedAt).getTime();
  return incomingTime > existingTime ? "replace" : "keep-existing";
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create default AI metadata
 */
export function createDefaultAIMetadata(
  agentId: string,
  agentType: AISource["agentType"],
  confidence: number = 0.7
): AIMetadata {
  return {
    confidence: {
      overall: confidence,
    },
    source: {
      agentId,
      agentType,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Calculate aggregate confidence from multiple scores
 */
export function calculateOverallConfidence(confidence: Partial<AIConfidence>): number {
  const scores = [
    confidence.componentChoice,
    confidence.contentRelevance,
    confidence.styling,
    confidence.timing,
    confidence.spatial,
  ].filter((s): s is number => s !== undefined);

  if (scores.length === 0) return 0.5;

  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

/**
 * Format AI metadata for debugging
 */
export function formatAIMetadataForDebug(metadata: AIMetadata): string {
  const lines: string[] = [
    `=== AI Metadata ===`,
    `Confidence: ${(metadata.confidence.overall * 100).toFixed(1)}% (${getConfidenceLevel(metadata.confidence.overall)})`,
    `Agent: ${metadata.source.agentType} (${metadata.source.agentId})`,
    `Generated: ${metadata.source.generatedAt}`,
  ];

  if (metadata.reasoning?.componentChoice) {
    lines.push(`Component: ${metadata.reasoning.componentChoice}`);
  }

  if (metadata.reasoning?.alternatives?.length) {
    lines.push(`Alternatives considered: ${metadata.reasoning.alternatives.length}`);
  }

  if (metadata.validation) {
    lines.push(`Validation: ${metadata.validation.passed ? "PASSED" : "FAILED"}`);
    if (metadata.validation.corrections?.length) {
      lines.push(`Corrections: ${metadata.validation.corrections.join(", ")}`);
    }
  }

  return lines.join("\n");
}
