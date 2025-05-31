/**
 * Type definitions for the Wiki Documentation Schema
 * This schema defines the structure for our generated documentation
 */

export interface WikiDocumentation {
  project: ProjectMetadata;
  modules: Module[];
  last_updated: string; // ISO 8601 format
  schema_version: string;
}

export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
  repository: string;
  documentation_status?: 'draft' | 'reviewed' | 'published';
  coverage?: number; // 0-1 representing documentation coverage
  last_updated: string; // ISO 8601 format
}

export interface Module {
  name: string;
  file?: string;
  description: string;
  status: 'documented' | 'partial' | 'undocumented';
  last_updated: string; // ISO 8601 format
  version_added?: string;
  documentation_status?: 'draft' | 'reviewed' | 'published';
  coverage?: number; // 0-1
  complexity?: 'low' | 'medium' | 'high';
  dependencies?: string[];
  keywords?: string[];
  components: Component[];
  improvement_areas?: string[];
  examples?: Example[];
}

export type ComponentType = 'component' | 'hook' | 'context' | 'utility' | 'type' | 'service';

export interface Component {
  type: ComponentType;
  name: string;
  file?: string;
  description: string;
  status: 'documented' | 'partial' | 'undocumented';
  last_updated: string; // ISO 8601 format
  version_added?: string;
  documentation_status?: 'draft' | 'reviewed' | 'published';
  coverage?: number; // 0-1
  complexity?: 'low' | 'medium' | 'high';
  deprecated?: boolean;
  deprecation_message?: string;
  
  // Component-specific fields
  props?: Prop[];
  state?: State[];
  methods?: Method[];
  returns?: TypeInfo;
  throws?: string[];
  
  // Context-specific fields
  values?: ContextValue[];
  
  // Hook-specific fields
  parameters?: Param[];
  
  // Common fields
  examples?: Example[];
  see_also?: string[];
  improvement_areas?: string[];
  keywords?: string[];
  dependencies?: string[];
}

export interface Prop {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  deprecated?: boolean;
  deprecation_message?: string;
  version_added?: string;
  version_deprecated?: string;
}

export interface State extends Omit<Prop, 'required'> {
  initial_value?: string;
}

export interface Method {
  name: string;
  description: string;
  parameters: Param[];
  returns?: TypeInfo;
  throws?: string[];
  deprecated?: boolean;
  deprecation_message?: string;
  version_added?: string;
  complexity?: 'low' | 'medium' | 'high';
  examples?: Example[];
}

export interface Param {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ContextValue extends Omit<Prop, 'required'> {
  // Additional context-specific fields if needed
}

export interface TypeInfo {
  type: string;
  description?: string;
  properties?: Record<string, TypeInfo>;
  items?: TypeInfo;
  optional?: boolean;
  nullable?: boolean;
}

export interface Example {
  title: string;
  description?: string;
  code: string;
  language?: string;
}

// Utility types for documentation generation
export type DocumentationStatus = 'draft' | 'reviewed' | 'published';
export type ComplexityLevel = 'low' | 'medium' | 'high';

// Helper function to create a new wiki documentation object
export function createWikiDocumentation(init: Partial<WikiDocumentation>): WikiDocumentation {
  const now = new Date().toISOString();
  
  return {
    project: {
      name: '',
      description: '',
      version: '0.1.0',
      repository: '',
      documentation_status: 'draft',
      coverage: 0,
      last_updated: now,
      ...init.project
    },
    modules: [],
    last_updated: now,
    schema_version: '1.0.0',
    ...init
  };
}
