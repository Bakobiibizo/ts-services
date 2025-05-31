use std::env;
use std::fs;
use syn::{Item, parse_file};
use serde::{Serialize, Deserialize};
use quote::ToTokens;

#[derive(Debug, Serialize, Deserialize)]
struct CodeBlock {
    r#type: String,
    name: String,
    source: String,
    start_line: usize,
    end_line: usize,
    documentation: Option<String>,
}

fn extract_docs(attrs: &[syn::Attribute]) -> Option<String> {
    let docs: Vec<String> = attrs
        .iter()
        .filter(|attr| attr.path.is_ident("doc"))
        .filter_map(|attr| {
            // Parse the attribute as a meta item
            if let Ok(syn::Meta::NameValue(meta)) = attr.parse_meta() {
                if let syn::Lit::Str(lit) = meta.lit {
                    let doc = lit.value().trim().to_string();
                    if !doc.is_empty() {
                        return Some(doc);
                    }
                }
            }
            None
        })
        .collect();
    
    if docs.is_empty() {
        None
    } else {
        Some(docs.join("\n"))
    }
}

fn get_source_range(item: &impl ToTokens) -> (usize, usize, String) {
    let tokens = item.to_token_stream();
    let source = tokens.to_string();
    // Count the number of lines in the source
    let line_count = source.lines().count();
    // For now, just return the whole source and assume it starts at line 1
    (1, line_count, source)
}

fn get_source_snippet(source: &str, start_line: usize, end_line: usize) -> String {
    let lines: Vec<&str> = source.lines().collect();
    let start = start_line.saturating_sub(1); // Convert to 0-based index
    let end = end_line.min(lines.len());
    
    if start >= end {
        return String::new();
    }
    
    lines[start..end].join("\n")
}

fn process_item(item: &Item, source: &str, blocks: &mut Vec<CodeBlock>) {
    match item {
        Item::Fn(item_fn) => {
            let (start, end, source_code) = get_source_range(item_fn);
            blocks.push(CodeBlock {
                r#type: "Function".to_string(),
                name: item_fn.sig.ident.to_string(),
                source: source_code,
                start_line: start,
                end_line: end,
                documentation: extract_docs(&item_fn.attrs),
            });
        },
        Item::Struct(item_struct) => {
            let (start, end, source_code) = get_source_range(item_struct);
            blocks.push(CodeBlock {
                r#type: "Struct".to_string(),
                name: item_struct.ident.to_string(),
                source: source_code,
                start_line: start,
                end_line: end,
                documentation: extract_docs(&item_struct.attrs),
            });
        },
        Item::Impl(item_impl) => {
            let (start, end, source_code) = get_source_range(item_impl);
            let name = if let Some((_, path, _)) = &item_impl.trait_ {
                path.segments.last().unwrap().ident.to_string()
            } else {
                item_impl.self_ty.to_token_stream().to_string()
            };
            
            blocks.push(CodeBlock {
                r#type: "Implementation".to_string(),
                name,
                source: source_code,
                start_line: start,
                end_line: end,
                documentation: extract_docs(&item_impl.attrs),
            });
        },
        Item::Mod(item_mod) => {
            if let Some((_, items)) = &item_mod.content {
                for item in items {
                    process_item(item, source, blocks);
                }
            }
        },
        Item::Trait(item_trait) => {
            let (start, end, source_code) = get_source_range(item_trait);
            blocks.push(CodeBlock {
                r#type: "Trait".to_string(),
                name: item_trait.ident.to_string(),
                source: source_code,
                start_line: start,
                end_line: end,
                documentation: extract_docs(&item_trait.attrs),
            });
        },
        Item::Enum(item_enum) => {
            let (start, end, source_code) = get_source_range(item_enum);
            blocks.push(CodeBlock {
                r#type: "Enum".to_string(),
                name: item_enum.ident.to_string(),
                source: source_code,
                start_line: start,
                end_line: end,
                documentation: extract_docs(&item_enum.attrs),
            });
        },
        _ => {}
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: {} <rust_file>", args[0]);
        std::process::exit(1);
    }

    let file_path = &args[1];
    let source = fs::read_to_string(file_path)?;
    
    // Parse the file into a syntax tree
    match parse_file(&source) {
        Ok(file) => {
            let mut blocks = Vec::new();
            
            // Process each item in the file
            for item in &file.items {
                process_item(item, &source, &mut blocks);
            }
            
            // Sort blocks by starting line number for consistent output
            blocks.sort_by_key(|b| b.start_line);
            
            // Output the result as JSON
            let output = serde_json::json!({
                "success": true,
                "blocks": blocks
            });
            
            println!("{}", output);
            Ok(())
        },
        Err(e) => {
            eprintln!("Failed to parse Rust file: {}", e);
            // Return error information as JSON
            let output = serde_json::json!({
                "success": false,
                "error": e.to_string(),
                "type": "ParseError"
            });
            println!("{}", output);
            Ok(())
        }
    }
}
