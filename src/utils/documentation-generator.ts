import { 
  WikiDocumentation, 
  ProjectMetadata, 
  Module, 
  Component,
  ComponentType,
  Prop,
  Method,
  Example,
  createWikiDocumentation,
  Param
} from '../types/wiki-schema';

/**
 * DocumentationGenerator helps create and manage wiki documentation
 * following the defined schema
 */
export class DocumentationGenerator {
  private documentation: WikiDocumentation;

  constructor(projectMetadata: Partial<ProjectMetadata> = {}) {
    // Ensure required fields have default values
    const defaultProject: ProjectMetadata = {
      name: 'Untitled Project',
      description: 'No description provided',
      version: '0.1.0',
      repository: '',
      last_updated: new Date().toISOString(),
      documentation_status: 'draft',
      coverage: 0
    };

    this.documentation = createWikiDocumentation({
      project: {
        ...defaultProject,
        ...projectMetadata,
        last_updated: new Date().toISOString()
      }
    });
  }

  /**
   * Add or update a module in the documentation
   */
  addModule(module: Omit<Module, 'components' | 'last_updated'>, components: Component[] = []): this {
    const existingIndex = this.documentation.modules.findIndex(m => m.name === module.name);
    const now = new Date().toISOString();
    
    const newModule: Module = {
      ...module,
      last_updated: now,
      components: components.map(comp => ({
        ...comp,
        last_updated: now
      }))
    };

    if (existingIndex >= 0) {
      // Update existing module
      this.documentation.modules[existingIndex] = newModule;
    } else {
      // Add new module
      this.documentation.modules.push(newModule);
    }

    this.documentation.last_updated = now;
    return this;
  }

  /**
   * Add a component to an existing module
   */
  addComponent(moduleName: string, component: Component): this {
    const moduleIndex = this.documentation.modules.findIndex(m => m.name === moduleName);
    if (moduleIndex === -1) {
      throw new Error(`Module '${moduleName}' not found`);
    }

    const now = new Date().toISOString();
    const componentWithTimestamp = {
      ...component,
      last_updated: now
    };

    const componentIndex = this.documentation.modules[moduleIndex].components
      .findIndex(c => c.name === component.name && c.type === component.type);

    if (componentIndex >= 0) {
      // Update existing component
      this.documentation.modules[moduleIndex].components[componentIndex] = componentWithTimestamp;
    } else {
      // Add new component
      this.documentation.modules[moduleIndex].components.push(componentWithTimestamp);
    }

    this.documentation.last_updated = now;
    return this;
  }

  /**
   * Update the project metadata
   */
  updateProjectMetadata(metadata: Partial<ProjectMetadata>): this {
    this.documentation.project = {
      ...this.documentation.project,
      ...metadata,
      last_updated: new Date().toISOString()
    };
    this.documentation.last_updated = new Date().toISOString();
    return this;
  }

  /**
   * Generate the final documentation object
   */
  generate(): WikiDocumentation {
    // Update any computed fields before returning
    this.updateCoverageMetrics();
    this.documentation.last_updated = new Date().toISOString();
    return JSON.parse(JSON.stringify(this.documentation)); // Return a deep copy
  }

  /**
   * Calculate and update documentation coverage metrics
   */
  private updateCoverageMetrics(): void {
    // Calculate project-wide coverage
    const allComponents = this.documentation.modules.flatMap(m => m.components);
    const documentedComponents = allComponents.filter(c => c.status === 'documented').length;
    const totalComponents = allComponents.length;
    
    const projectCoverage = totalComponents > 0 
      ? Math.round((documentedComponents / totalComponents) * 100) / 100 
      : 0;

    // Update project coverage
    this.documentation.project.coverage = projectCoverage;

    // Update module coverage
    this.documentation.modules.forEach(module => {
      const moduleComponents = module.components.length;
      const documentedModuleComponents = module.components
        .filter(c => c.status === 'documented').length;
      
      module.coverage = moduleComponents > 0
        ? Math.round((documentedModuleComponents / moduleComponents) * 100) / 100
        : 0;
    });
  }

  // Helper methods for creating common component types
  static createComponent(component: Omit<Component, 'last_updated'>): Component {
    return {
      ...component,
      last_updated: new Date().toISOString()
    };
  }

  static createProp(prop: Omit<Prop, 'required'>, required: boolean = true): Prop {
    return {
      ...prop,
      required,
      deprecated: prop.deprecated || false
    } as Prop;
  }

  static createMethod(method: Omit<Method, 'parameters'>, parameters: Param[] = []): Method {
    return {
      ...method,
      parameters,
      deprecated: method.deprecated || false
    } as Method;
  }

  static createExample(example: Omit<Example, 'language'>, language: string = 'typescript'): Example {
    return {
      ...example,
      language
    } as Example;
  }
}
