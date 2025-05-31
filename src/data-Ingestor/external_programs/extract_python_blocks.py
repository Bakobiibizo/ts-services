#!/usr/bin/env python3
"""
Python script to extract code blocks from Python files using AST.
To be executed via uv: `uv run extract_python_blocks.py <file_path>`
"""

import ast
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

def get_docstring(node: ast.AST) -> Optional[str]:
    """Extract docstring from a node if it exists."""
    if not hasattr(node, 'body') or not node.body or not isinstance(node.body[0], ast.Expr):
        return None
    
    expr = node.body[0]
    if not hasattr(expr, 'value'):
        return None
    
    # Handle Python < 3.8 (ast.Str) and >= 3.8 (ast.Constant)
    if isinstance(expr.value, ast.Str):
        return expr.value.s
    elif hasattr(ast, 'Constant') and isinstance(expr.value, ast.Constant) and isinstance(expr.value.value, str):
        return expr.value.value
    
    return None

def extract_blocks(node: ast.AST, source_lines: List[str], parent: Optional[ast.AST] = None) -> List[Dict[str, Any]]:
    """Extract code blocks from an AST node."""
    blocks: List[Dict[str, Any]] = []
    
    # Skip if node doesn't have a body
    if not hasattr(node, 'body') or not isinstance(node.body, list):
        return blocks
    
    for item in node.body:
        if not isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            continue
            
        # Get the source code for this block
        start_line = item.lineno - 1  # Convert to 0-based index
        end_line = getattr(item, 'end_lineno', item.lineno + 1) - 1  # Convert to 0-based index
        source = '\n'.join(source_lines[start_line:end_line + 1])  # end_line is inclusive
        
        # Extract docstring if available
        docstring = get_docstring(item)
        
        # Create block info
        block_info = {
            'type': item.__class__.__name__,
            'name': item.name,
            'source': source,
            'startLine': item.lineno,
            'endLine': getattr(item, 'end_lineno', item.lineno + 1),
            'language': 'python',
            'documentation': docstring
        }
        
        blocks.append(block_info)
        
        # Recursively process nested blocks
        if hasattr(item, 'body'):
            blocks.extend(extract_blocks(item, source_lines, item))
    
    return blocks

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: extract_python_blocks.py <file_path>',
            'type': 'UsageError'
        }))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    try:
        # Read the source file
        with open(file_path, 'r', encoding='utf-8') as f:
            source_lines = f.read().splitlines()
        
        # Parse the AST
        tree = ast.parse('\n'.join(source_lines))
        
        # Extract blocks
        blocks = extract_blocks(tree, source_lines)
        
        # Output as JSON
        print(json.dumps({
            'success': True,
            'blocks': blocks
        }))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e),
            'type': type(e).__name__
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
