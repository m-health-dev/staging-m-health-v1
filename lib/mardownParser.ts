export interface TextNode {
  type:
    | "text"
    | "bold"
    | "italic"
    | "underline"
    | "bold-italic"
    | "newline"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "list";
  content: string;
}

export function parseMarkdown(text: string): TextNode[] {
  const nodes: TextNode[] = [];

  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    // Check for headings first
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      nodes.push({
        type: `heading-${level}` as const,
        content: headingMatch[2],
      });
      if (lineIndex < lines.length - 1) {
        nodes.push({ type: "newline", content: "" });
      }
      return;
    }

    const listMatch = line.match(/^([-*])\s+(.+)$/);
    if (listMatch) {
      nodes.push({
        type: "list",
        content: listMatch[2],
      });
      if (lineIndex < lines.length - 1) {
        nodes.push({ type: "newline", content: "" });
      }
      return;
    }

    // Parse inline formatting for regular text lines
    parseInlineFormatting(line, nodes);

    if (lineIndex < lines.length - 1) {
      nodes.push({
        type: "newline",
        content: "",
      });
    }
  });

  return nodes.length === 0 ? [{ type: "text", content: text }] : nodes;
}

// Handles bold, italic, underline within text, avoiding false matches for list items
function parseInlineFormatting(line: string, nodes: TextNode[]): void {
  // Regex for formatting: ***bold-italic***, **bold**, __underline__, *italic* (not at line start)
  const formatRegex =
    /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|__.*?__|_.*?_|\*(?!\s).*?\*)/g;

  let lastIndex = 0;

  line.replace(formatRegex, (match, p1, offset) => {
    // Add plain text before formatting
    if (offset > lastIndex) {
      nodes.push({
        type: "text",
        content: line.substring(lastIndex, offset),
      });
    }

    // Parse formatting
    if (match.startsWith("***") && match.endsWith("***")) {
      nodes.push({
        type: "bold-italic",
        content: match.slice(3, -3),
      });
    } else if (match.startsWith("**") && match.endsWith("**")) {
      nodes.push({
        type: "bold",
        content: match.slice(2, -2),
      });
    } else if (match.startsWith("__") && match.endsWith("__")) {
      nodes.push({
        type: "underline",
        content: match.slice(2, -2),
      });
    } else if (
      (match.startsWith("*") && match.endsWith("*")) ||
      (match.startsWith("_") && match.endsWith("_"))
    ) {
      nodes.push({
        type: "italic",
        content: match.slice(1, -1),
      });
    }

    lastIndex = offset + match.length;
    return match;
  });

  // Add remaining text from line
  if (lastIndex < line.length) {
    nodes.push({
      type: "text",
      content: line.substring(lastIndex),
    });
  }
}
