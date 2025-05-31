/**
 * Represents a code block extracted from a source file.
 * This interface is used to standardize the format of code blocks
 * extracted from different programming languages.
 */
export interface CodeBlock {
    /**
     * The type of the code block (e.g., 'FunctionDef', 'ClassDef', 'Method')
     */
    type: string;
    
    /**
     * The name of the code block (function name, class name, etc.)
     */
    name?: string;
    
    /**
     * The complete source code of the block
     */
    source: string;
    
    /**
     * Optional starting line number in the original file
     */
    startLine?: number;
    
    /**
     * Optional ending line number in the original file
     */
    endLine?: number;
    
    /**
     * Optional language of the code block
     */
    language?: string;
    
    /**
     * Optional documentation/comment block associated with this code block
     */
    documentation?: string;
}