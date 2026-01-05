/**
 * Cosmo UI Semantic Relationships v1.0
 *
 * Define relationships between UI components for coherent,
 * contextual, and intelligent UI flows.
 */

// ============================================================================
// RELATIONSHIP TYPES
// ============================================================================

/**
 * Types of relationships between components
 */
export type RelationshipType =
  | "follows"         // This appears after another
  | "replaces"        // This replaces another
  | "groups-with"     // These belong together
  | "responds-to"     // This is a response to another
  | "updates"         // This updates information in another
  | "expands"         // This expands/details another
  | "confirms"        // This confirms an action from another
  | "contradicts"     // This contradicts/cancels another
  | "child-of"        // Hierarchical child
  | "sibling-of"      // Same level/group
  | "triggered-by";   // Caused by another

/**
 * Timing relationship
 */
export type TimingRelation =
  | "before"          // Must appear before related
  | "after"           // Must appear after related
  | "simultaneous"    // Appear at same time
  | "immediate"       // Immediately after
  | "delayed"         // After a delay
  | "conditional";    // Based on condition

/**
 * Position relationship
 */
export type PositionRelation =
  | "same"            // Same position
  | "adjacent"        // Next to
  | "stacked"         // Stacked vertically
  | "opposite"        // Opposite side
  | "nearby"          // Close by
  | "independent";    // No position relation

// ============================================================================
// SEMANTIC RELATIONSHIP
// ============================================================================

/**
 * Complete semantic relationship definition
 */
export interface SemanticRelationship {
  /** Unique relationship ID */
  id: string;

  /** Source component ID */
  sourceId: string;

  /** Target component ID (or pattern) */
  targetId: string | { pattern: string };

  /** Type of relationship */
  type: RelationshipType;

  /** Timing relationship */
  timing: TimingRelation;

  /** Position relationship */
  position?: PositionRelation;

  /** Delay in ms (for timing = delayed) */
  delay?: number;

  /** Condition for showing (for timing = conditional) */
  condition?: RelationshipCondition;

  /** Animation when related components interact */
  animation?: RelationshipAnimation;

  /** Behavioral rules */
  behavior?: RelationshipBehavior;

  /** Metadata */
  metadata?: {
    createdBy?: string;
    reason?: string;
    confidence?: number;
  };
}

/**
 * Condition for conditional relationships
 */
export interface RelationshipCondition {
  /** Type of condition */
  type:
    | "user-action"      // User did something
    | "time-elapsed"     // Time passed
    | "component-state"  // Component in certain state
    | "context-match"    // Context matches criteria
    | "custom";          // Custom function

  /** Condition parameters */
  params: Record<string, unknown>;
}

/**
 * Animation between related components
 */
export interface RelationshipAnimation {
  /** Animation type */
  type:
    | "morph"        // Morph from one to another
    | "slide"        // Slide in relation
    | "fade"         // Fade transition
    | "expand"       // Expand from source
    | "collapse"     // Collapse to target
    | "connect"      // Visual connection line
    | "none";

  /** Duration (ms) */
  duration?: number;

  /** Easing function */
  easing?: string;

  /** Direction */
  direction?: "in" | "out" | "both";
}

/**
 * Behavioral rules for related components
 */
export interface RelationshipBehavior {
  /** Auto-dismiss source when target appears? */
  dismissSource?: boolean;

  /** Auto-dismiss target when source dismissed? */
  cascadeDismiss?: boolean;

  /** Inherit properties from source? */
  inheritProps?: string[];

  /** Share state between components? */
  shareState?: boolean;

  /** Sync animations? */
  syncAnimations?: boolean;

  /** Group for dismissal (dismiss one = dismiss all) */
  dismissGroup?: string;

  /** Priority inheritance */
  inheritPriority?: boolean;

  /** Position lock (maintain relative position) */
  positionLock?: boolean;
}

// ============================================================================
// RELATIONSHIP GRAPH
// ============================================================================

/**
 * Graph of component relationships
 */
export interface RelationshipGraph {
  /** All relationships */
  relationships: Map<string, SemanticRelationship>;

  /** Index: source -> relationships */
  bySource: Map<string, Set<string>>;

  /** Index: target -> relationships */
  byTarget: Map<string, Set<string>>;

  /** Index: type -> relationships */
  byType: Map<RelationshipType, Set<string>>;

  /** Dismiss groups */
  dismissGroups: Map<string, Set<string>>;
}

/**
 * Create empty relationship graph
 */
export function createRelationshipGraph(): RelationshipGraph {
  return {
    relationships: new Map(),
    bySource: new Map(),
    byTarget: new Map(),
    byType: new Map(),
    dismissGroups: new Map(),
  };
}

/**
 * Add relationship to graph
 */
export function addRelationship(
  graph: RelationshipGraph,
  relationship: SemanticRelationship
): RelationshipGraph {
  const newGraph = { ...graph };

  // Add to main map
  newGraph.relationships = new Map(graph.relationships);
  newGraph.relationships.set(relationship.id, relationship);

  // Update source index
  newGraph.bySource = new Map(graph.bySource);
  const sourceRels = newGraph.bySource.get(relationship.sourceId) ?? new Set();
  sourceRels.add(relationship.id);
  newGraph.bySource.set(relationship.sourceId, sourceRels);

  // Update target index
  newGraph.byTarget = new Map(graph.byTarget);
  const targetId =
    typeof relationship.targetId === "string"
      ? relationship.targetId
      : relationship.targetId.pattern;
  const targetRels = newGraph.byTarget.get(targetId) ?? new Set();
  targetRels.add(relationship.id);
  newGraph.byTarget.set(targetId, targetRels);

  // Update type index
  newGraph.byType = new Map(graph.byType);
  const typeRels = newGraph.byType.get(relationship.type) ?? new Set();
  typeRels.add(relationship.id);
  newGraph.byType.set(relationship.type, typeRels);

  // Update dismiss groups
  if (relationship.behavior?.dismissGroup) {
    newGraph.dismissGroups = new Map(graph.dismissGroups);
    const group =
      newGraph.dismissGroups.get(relationship.behavior.dismissGroup) ?? new Set();
    group.add(relationship.sourceId);
    if (typeof relationship.targetId === "string") {
      group.add(relationship.targetId);
    }
    newGraph.dismissGroups.set(relationship.behavior.dismissGroup, group);
  }

  return newGraph;
}

/**
 * Remove relationship from graph
 */
export function removeRelationship(
  graph: RelationshipGraph,
  relationshipId: string
): RelationshipGraph {
  const relationship = graph.relationships.get(relationshipId);
  if (!relationship) return graph;

  const newGraph = { ...graph };
  newGraph.relationships = new Map(graph.relationships);
  newGraph.relationships.delete(relationshipId);

  // Update indexes...
  newGraph.bySource = new Map(graph.bySource);
  const sourceRels = newGraph.bySource.get(relationship.sourceId);
  if (sourceRels) {
    sourceRels.delete(relationshipId);
    if (sourceRels.size === 0) {
      newGraph.bySource.delete(relationship.sourceId);
    }
  }

  return newGraph;
}

/**
 * Find relationships for a component
 */
export function getRelationshipsFor(
  graph: RelationshipGraph,
  componentId: string
): SemanticRelationship[] {
  const results: SemanticRelationship[] = [];

  // As source
  const sourceRels = graph.bySource.get(componentId);
  if (sourceRels) {
    for (const relId of sourceRels) {
      const rel = graph.relationships.get(relId);
      if (rel) results.push(rel);
    }
  }

  // As target
  const targetRels = graph.byTarget.get(componentId);
  if (targetRels) {
    for (const relId of targetRels) {
      const rel = graph.relationships.get(relId);
      if (rel) results.push(rel);
    }
  }

  return results;
}

/**
 * Find components to dismiss when one is dismissed
 */
export function getCascadeDismissals(
  graph: RelationshipGraph,
  componentId: string
): string[] {
  const toDismiss: Set<string> = new Set();

  // Check dismiss groups
  for (const [_groupId, members] of graph.dismissGroups) {
    if (members.has(componentId)) {
      for (const member of members) {
        if (member !== componentId) {
          toDismiss.add(member);
        }
      }
    }
  }

  // Check cascade dismiss relationships
  const relationships = graph.bySource.get(componentId);
  if (relationships) {
    for (const relId of relationships) {
      const rel = graph.relationships.get(relId);
      if (rel?.behavior?.cascadeDismiss && typeof rel.targetId === "string") {
        toDismiss.add(rel.targetId);
      }
    }
  }

  return Array.from(toDismiss);
}

// ============================================================================
// RELATIONSHIP BUILDERS
// ============================================================================

/**
 * Create a "follows" relationship
 */
export function follows(
  sourceId: string,
  targetId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-follows-${targetId}`,
    sourceId,
    targetId,
    type: "follows",
    timing: "after",
    position: "same",
    ...options,
  };
}

/**
 * Create a "replaces" relationship
 */
export function replaces(
  sourceId: string,
  targetId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-replaces-${targetId}`,
    sourceId,
    targetId,
    type: "replaces",
    timing: "immediate",
    position: "same",
    behavior: {
      dismissSource: false,
      cascadeDismiss: true,
    },
    animation: {
      type: "morph",
      duration: 200,
    },
    ...options,
  };
}

/**
 * Create a "groups-with" relationship
 */
export function groupsWith(
  sourceId: string,
  targetId: string,
  groupId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-groups-${targetId}`,
    sourceId,
    targetId,
    type: "groups-with",
    timing: "simultaneous",
    position: "stacked",
    behavior: {
      dismissGroup: groupId,
      positionLock: true,
      syncAnimations: true,
    },
    ...options,
  };
}

/**
 * Create an "expands" relationship (detail view)
 */
export function expands(
  sourceId: string,
  targetId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-expands-${targetId}`,
    sourceId,
    targetId,
    type: "expands",
    timing: "immediate",
    position: "same",
    behavior: {
      inheritProps: ["variant", "priority"],
      dismissSource: true,
    },
    animation: {
      type: "expand",
      duration: 250,
    },
    ...options,
  };
}

/**
 * Create a "confirms" relationship (confirmation dialog)
 */
export function confirms(
  sourceId: string,
  targetId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-confirms-${targetId}`,
    sourceId,
    targetId,
    type: "confirms",
    timing: "immediate",
    position: "same",
    behavior: {
      cascadeDismiss: true,
    },
    ...options,
  };
}

/**
 * Create a "responds-to" relationship
 */
export function respondsTo(
  sourceId: string,
  targetId: string,
  options?: Partial<SemanticRelationship>
): SemanticRelationship {
  return {
    id: `rel-${sourceId}-responds-${targetId}`,
    sourceId,
    targetId,
    type: "responds-to",
    timing: "after",
    position: "adjacent",
    ...options,
  };
}

// ============================================================================
// FLOW ORCHESTRATION
// ============================================================================

/**
 * Define a UI flow with multiple related components
 */
export interface UIFlow {
  /** Flow identifier */
  id: string;

  /** Flow name */
  name: string;

  /** Steps in the flow */
  steps: UIFlowStep[];

  /** Current step index */
  currentStep: number;

  /** Flow state */
  state: "pending" | "active" | "completed" | "cancelled";

  /** Completion behavior */
  onComplete?: "dismiss-all" | "show-summary" | "none";

  /** Cancellation behavior */
  onCancel?: "dismiss-all" | "confirm" | "none";
}

/**
 * Single step in a UI flow
 */
export interface UIFlowStep {
  /** Step identifier */
  id: string;

  /** Component to show */
  componentType: string;

  /** Component configuration */
  componentConfig: Record<string, unknown>;

  /** Conditions to advance to next step */
  advanceOn:
    | "dismiss"
    | "action"
    | "timeout"
    | { action: string }
    | { timeout: number };

  /** Required before showing next */
  blocking: boolean;

  /** Delay before showing */
  showDelay?: number;
}

/**
 * Create a simple notification -> confirmation flow
 */
export function createConfirmationFlow(
  notification: {
    id: string;
    title: string;
    content: string;
    variant?: string;
  },
  confirmation: {
    question: string;
    confirmLabel: string;
    cancelLabel: string;
  }
): UIFlow {
  return {
    id: `flow-confirm-${notification.id}`,
    name: "Confirmation Flow",
    currentStep: 0,
    state: "pending",
    onComplete: "dismiss-all",
    onCancel: "dismiss-all",
    steps: [
      {
        id: `${notification.id}-notify`,
        componentType: "HUDCard",
        componentConfig: {
          id: `${notification.id}-notify`,
          title: notification.title,
          content: notification.content,
          variant: notification.variant ?? "info",
          actions: [{ id: "confirm", label: "Proceed", variant: "primary" }],
        },
        advanceOn: { action: "confirm" },
        blocking: true,
      },
      {
        id: `${notification.id}-confirm`,
        componentType: "HUDCard",
        componentConfig: {
          id: `${notification.id}-confirm`,
          title: "Confirm",
          content: confirmation.question,
          variant: "warning",
          actions: [
            { id: "yes", label: confirmation.confirmLabel, variant: "primary" },
            {
              id: "no",
              label: confirmation.cancelLabel,
              variant: "secondary",
            },
          ],
        },
        advanceOn: "action",
        blocking: true,
      },
    ],
  };
}

/**
 * Create a progress flow with multiple updates
 */
export function createProgressFlow(
  id: string,
  title: string,
  steps: string[]
): UIFlow {
  return {
    id: `flow-progress-${id}`,
    name: title,
    currentStep: 0,
    state: "pending",
    onComplete: "show-summary",
    steps: steps.map((stepName, index) => ({
      id: `${id}-step-${index}`,
      componentType: "ContextBadge",
      componentConfig: {
        id: `${id}-step-${index}`,
        label: stepName,
        variant: "info",
        pulse: true,
      },
      advanceOn: { timeout: 2000 },
      blocking: false,
      showDelay: index * 500,
    })),
  };
}
