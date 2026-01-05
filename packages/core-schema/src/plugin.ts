/**
 * Cosmo UI Plugin Architecture v1.0
 *
 * Extensible plugin system for adding custom components,
 * validators, renderers, and AI adapters.
 */

// ============================================================================
// PLUGIN TYPES
// ============================================================================

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  /** Unique plugin identifier */
  id: string;

  /** Display name */
  name: string;

  /** Version (semver) */
  version: string;

  /** Description */
  description?: string;

  /** Author */
  author?: string;

  /** Repository URL */
  repository?: string;

  /** License */
  license?: string;

  /** Dependencies on other plugins */
  dependencies?: Record<string, string>;

  /** Peer dependencies (cosmo packages) */
  peerDependencies?: Record<string, string>;

  /** Tags for categorization */
  tags?: string[];
}

/**
 * Component schema definition for plugins
 */
export interface PluginComponentSchema {
  /** Component name (used in generation) */
  name: string;

  /** TypeScript type definition (as string) */
  typeDefinition: string;

  /** JSON Schema for validation */
  jsonSchema: Record<string, unknown>;

  /** Required fields */
  requiredFields: string[];

  /** Default values */
  defaults: Record<string, unknown>;

  /** System constraints */
  constraints?: {
    maxConcurrent?: number;
    maxTextLength?: Record<string, number>;
  };

  /** AI generation hints */
  aiHints?: {
    description: string;
    examples?: unknown[];
    bestPractices?: string[];
    avoidPatterns?: string[];
  };
}

/**
 * Validator definition for plugins
 */
export interface PluginValidator {
  /** Component name this validates */
  componentName: string;

  /** Validation function */
  validate: (data: unknown) => ValidationResult;

  /** Sanitization function */
  sanitize: (data: unknown) => unknown;

  /** Correction function (for AI output) */
  correct?: (data: unknown, errors: ValidationError[]) => unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  suggestedFix?: string;
}

/**
 * Renderer definition for plugins
 */
export interface PluginRenderer {
  /** Component name this renders */
  componentName: string;

  /** Target platform */
  platform: "web" | "ar" | "meta" | "native";

  /** React component (as function reference) */
  component: unknown;

  /** CSS/styles (optional) */
  styles?: string;

  /** Required dependencies */
  dependencies?: string[];
}

/**
 * AI Adapter definition for plugins
 */
export interface PluginAIAdapter {
  /** Component name */
  componentName: string;

  /** System prompt for generation */
  systemPrompt: string;

  /** Example outputs */
  examples: {
    input: string;
    output: unknown;
    explanation?: string;
  }[];

  /** Corrector for fixing AI output */
  corrector?: {
    correct: (data: unknown, errors: ValidationError[]) => unknown;
    maxIterations?: number;
  };

  /** Token optimization hints */
  tokenHints?: {
    useToon?: boolean;
    compressExamples?: boolean;
    minimalSchema?: boolean;
  };
}

/**
 * Theme extension for plugins
 */
export interface PluginThemeExtension {
  /** Colors to add to theme */
  colors?: Record<string, string>;

  /** Spacing tokens */
  spacing?: Record<string, number>;

  /** Component-specific styles */
  componentStyles?: Record<string, Record<string, unknown>>;
}

/**
 * Complete plugin definition
 */
export interface CosmoPlugin {
  /** Plugin metadata */
  metadata: PluginMetadata;

  /** Component schemas */
  components?: Record<string, PluginComponentSchema>;

  /** Validators */
  validators?: Record<string, PluginValidator>;

  /** Web renderers */
  webRenderers?: Record<string, PluginRenderer>;

  /** AR renderers */
  arRenderers?: Record<string, PluginRenderer>;

  /** AI adapters */
  aiAdapters?: Record<string, PluginAIAdapter>;

  /** Theme extensions */
  theme?: PluginThemeExtension;

  /** Spatial intent extensions */
  spatialIntents?: Record<
    string,
    {
      distance: number;
      scale: number;
      zonePreference: string;
      urgencyDefault: string;
    }
  >;

  /** Voice command extensions */
  voiceCommands?: Record<string, { phrases: string[]; action: string }>;

  /** Lifecycle hooks */
  hooks?: PluginHooks;
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginHooks {
  /** Called when plugin is loaded */
  onLoad?: () => void | Promise<void>;

  /** Called when plugin is unloaded */
  onUnload?: () => void | Promise<void>;

  /** Called before component render */
  beforeRender?: (componentName: string, props: unknown) => unknown;

  /** Called after component render */
  afterRender?: (componentName: string, element: unknown) => void;

  /** Called before validation */
  beforeValidate?: (componentName: string, data: unknown) => unknown;

  /** Called after validation */
  afterValidate?: (
    componentName: string,
    result: ValidationResult
  ) => ValidationResult;

  /** Called before AI generation */
  beforeGenerate?: (prompt: string, context: unknown) => string;

  /** Called after AI generation */
  afterGenerate?: (componentName: string, data: unknown) => unknown;
}

// ============================================================================
// PLUGIN REGISTRY
// ============================================================================

/**
 * Plugin registry state
 */
export interface PluginRegistry {
  /** Loaded plugins by ID */
  plugins: Map<string, CosmoPlugin>;

  /** Component -> Plugin mapping */
  componentMap: Map<string, string>;

  /** Validator -> Plugin mapping */
  validatorMap: Map<string, string>;

  /** Renderer -> Plugin mapping */
  rendererMap: Map<string, string>;

  /** Load order (for dependency resolution) */
  loadOrder: string[];
}

/**
 * Create empty plugin registry
 */
export function createPluginRegistry(): PluginRegistry {
  return {
    plugins: new Map(),
    componentMap: new Map(),
    validatorMap: new Map(),
    rendererMap: new Map(),
    loadOrder: [],
  };
}

/**
 * Register a plugin
 */
export function registerPlugin(
  registry: PluginRegistry,
  plugin: CosmoPlugin
): PluginRegistry {
  const newRegistry = { ...registry };
  newRegistry.plugins = new Map(registry.plugins);
  newRegistry.componentMap = new Map(registry.componentMap);
  newRegistry.validatorMap = new Map(registry.validatorMap);
  newRegistry.rendererMap = new Map(registry.rendererMap);
  newRegistry.loadOrder = [...registry.loadOrder];

  // Check dependencies
  if (plugin.metadata.dependencies) {
    for (const [depId, _version] of Object.entries(plugin.metadata.dependencies)) {
      if (!newRegistry.plugins.has(depId)) {
        throw new Error(
          `Plugin ${plugin.metadata.id} depends on ${depId} which is not loaded`
        );
      }
    }
  }

  // Register plugin
  newRegistry.plugins.set(plugin.metadata.id, plugin);
  newRegistry.loadOrder.push(plugin.metadata.id);

  // Register components
  if (plugin.components) {
    for (const [name] of Object.entries(plugin.components)) {
      newRegistry.componentMap.set(name, plugin.metadata.id);
    }
  }

  // Register validators
  if (plugin.validators) {
    for (const [name] of Object.entries(plugin.validators)) {
      newRegistry.validatorMap.set(name, plugin.metadata.id);
    }
  }

  // Register renderers
  if (plugin.webRenderers) {
    for (const [name] of Object.entries(plugin.webRenderers)) {
      newRegistry.rendererMap.set(`web:${name}`, plugin.metadata.id);
    }
  }
  if (plugin.arRenderers) {
    for (const [name] of Object.entries(plugin.arRenderers)) {
      newRegistry.rendererMap.set(`ar:${name}`, plugin.metadata.id);
    }
  }

  // Call onLoad hook
  if (plugin.hooks?.onLoad) {
    plugin.hooks.onLoad();
  }

  return newRegistry;
}

/**
 * Unregister a plugin
 */
export function unregisterPlugin(
  registry: PluginRegistry,
  pluginId: string
): PluginRegistry {
  const plugin = registry.plugins.get(pluginId);
  if (!plugin) return registry;

  // Check if other plugins depend on this
  for (const [otherId, otherPlugin] of registry.plugins) {
    if (otherId !== pluginId && otherPlugin.metadata.dependencies?.[pluginId]) {
      throw new Error(
        `Cannot unregister ${pluginId}: ${otherId} depends on it`
      );
    }
  }

  // Call onUnload hook
  if (plugin.hooks?.onUnload) {
    plugin.hooks.onUnload();
  }

  const newRegistry = { ...registry };
  newRegistry.plugins = new Map(registry.plugins);
  newRegistry.componentMap = new Map(registry.componentMap);
  newRegistry.validatorMap = new Map(registry.validatorMap);
  newRegistry.rendererMap = new Map(registry.rendererMap);

  // Remove from maps
  newRegistry.plugins.delete(pluginId);

  for (const [name, id] of registry.componentMap) {
    if (id === pluginId) newRegistry.componentMap.delete(name);
  }
  for (const [name, id] of registry.validatorMap) {
    if (id === pluginId) newRegistry.validatorMap.delete(name);
  }
  for (const [name, id] of registry.rendererMap) {
    if (id === pluginId) newRegistry.rendererMap.delete(name);
  }

  newRegistry.loadOrder = registry.loadOrder.filter((id) => id !== pluginId);

  return newRegistry;
}

/**
 * Get component schema from registry
 */
export function getComponentSchema(
  registry: PluginRegistry,
  componentName: string
): PluginComponentSchema | undefined {
  const pluginId = registry.componentMap.get(componentName);
  if (!pluginId) return undefined;

  const plugin = registry.plugins.get(pluginId);
  return plugin?.components?.[componentName];
}

/**
 * Get validator from registry
 */
export function getValidator(
  registry: PluginRegistry,
  componentName: string
): PluginValidator | undefined {
  const pluginId = registry.validatorMap.get(componentName);
  if (!pluginId) return undefined;

  const plugin = registry.plugins.get(pluginId);
  return plugin?.validators?.[componentName];
}

/**
 * Get renderer from registry
 */
export function getRenderer(
  registry: PluginRegistry,
  platform: "web" | "ar",
  componentName: string
): PluginRenderer | undefined {
  const key = `${platform}:${componentName}`;
  const pluginId = registry.rendererMap.get(key);
  if (!pluginId) return undefined;

  const plugin = registry.plugins.get(pluginId);
  const renderers = platform === "web" ? plugin?.webRenderers : plugin?.arRenderers;
  return renderers?.[componentName];
}

/**
 * Get AI adapter from registry
 */
export function getAIAdapter(
  registry: PluginRegistry,
  componentName: string
): PluginAIAdapter | undefined {
  const pluginId = registry.componentMap.get(componentName);
  if (!pluginId) return undefined;

  const plugin = registry.plugins.get(pluginId);
  return plugin?.aiAdapters?.[componentName];
}

// ============================================================================
// PLUGIN BUILDER
// ============================================================================

/**
 * Builder for creating plugins with fluent API
 */
export class PluginBuilder {
  private plugin: Partial<CosmoPlugin> = {
    components: {},
    validators: {},
    webRenderers: {},
    arRenderers: {},
    aiAdapters: {},
  };

  /**
   * Set plugin metadata
   */
  metadata(meta: PluginMetadata): this {
    this.plugin.metadata = meta;
    return this;
  }

  /**
   * Add a component schema
   */
  component(name: string, schema: PluginComponentSchema): this {
    this.plugin.components![name] = schema;
    return this;
  }

  /**
   * Add a validator
   */
  validator(name: string, validator: PluginValidator): this {
    this.plugin.validators![name] = validator;
    return this;
  }

  /**
   * Add a web renderer
   */
  webRenderer(name: string, renderer: PluginRenderer): this {
    this.plugin.webRenderers![name] = renderer;
    return this;
  }

  /**
   * Add an AR renderer
   */
  arRenderer(name: string, renderer: PluginRenderer): this {
    this.plugin.arRenderers![name] = renderer;
    return this;
  }

  /**
   * Add an AI adapter
   */
  aiAdapter(name: string, adapter: PluginAIAdapter): this {
    this.plugin.aiAdapters![name] = adapter;
    return this;
  }

  /**
   * Set theme extension
   */
  theme(extension: PluginThemeExtension): this {
    this.plugin.theme = extension;
    return this;
  }

  /**
   * Set lifecycle hooks
   */
  hooks(hooks: PluginHooks): this {
    this.plugin.hooks = hooks;
    return this;
  }

  /**
   * Build the plugin
   */
  build(): CosmoPlugin {
    if (!this.plugin.metadata) {
      throw new Error("Plugin metadata is required");
    }

    return this.plugin as CosmoPlugin;
  }
}

/**
 * Create a plugin builder
 */
export function createPlugin(): PluginBuilder {
  return new PluginBuilder();
}

// ============================================================================
// EXAMPLE PLUGIN DEFINITION
// ============================================================================

/**
 * Example: How to define a simple plugin
 */
export const examplePlugin: CosmoPlugin = {
  metadata: {
    id: "cosmo-example",
    name: "Example Plugin",
    version: "1.0.0",
    description: "An example plugin demonstrating the plugin architecture",
    author: "Cosmo UI Team",
    license: "MIT",
    tags: ["example", "demo"],
  },

  components: {
    CustomWidget: {
      name: "CustomWidget",
      typeDefinition: `
        interface CustomWidget {
          id: string;
          title: string;
          value: number;
          color?: string;
        }
      `,
      jsonSchema: {
        type: "object",
        required: ["id", "title", "value"],
        properties: {
          id: { type: "string" },
          title: { type: "string", maxLength: 50 },
          value: { type: "number", minimum: 0, maximum: 100 },
          color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        },
      },
      requiredFields: ["id", "title", "value"],
      defaults: {
        color: "#3b82f6",
      },
      constraints: {
        maxConcurrent: 4,
        maxTextLength: { title: 50 },
      },
      aiHints: {
        description: "A custom widget displaying a numeric value with a title",
        examples: [
          { id: "widget-1", title: "Progress", value: 75, color: "#22c55e" },
        ],
        bestPractices: [
          "Use descriptive titles",
          "Choose colors that match the semantic meaning",
        ],
      },
    },
  },

  validators: {
    CustomWidget: {
      componentName: "CustomWidget",
      validate: (data: unknown) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationError[] = [];

        const widget = data as Record<string, unknown>;

        if (!widget.id) {
          errors.push({ field: "id", message: "id is required", severity: "error" });
        }
        if (!widget.title) {
          errors.push({
            field: "title",
            message: "title is required",
            severity: "error",
          });
        }
        if (typeof widget.value !== "number") {
          errors.push({
            field: "value",
            message: "value must be a number",
            severity: "error",
          });
        }

        return { valid: errors.length === 0, errors, warnings };
      },
      sanitize: (data: unknown) => {
        const widget = data as Record<string, unknown>;
        return {
          id: widget.id ?? `widget-${Date.now()}`,
          title: String(widget.title ?? "Untitled").slice(0, 50),
          value: Math.max(0, Math.min(100, Number(widget.value) || 0)),
          color: widget.color ?? "#3b82f6",
        };
      },
    },
  },

  hooks: {
    onLoad: () => {
      console.log("Example plugin loaded");
    },
    onUnload: () => {
      console.log("Example plugin unloaded");
    },
  },
};
