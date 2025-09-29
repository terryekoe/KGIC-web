import React from "react";

// Small, safe subset formatter for prayers
// Supports **bold**, *italic*, __underline__, [text](url), and emojis
// Safety: only http(s), mailto, relative (/ or #) links are clickable; everything else renders as plain text

function isSafeUrl(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("#")) return true;
  try {
    const u = new URL(href);
    return u.protocol === "http:" || u.protocol === "https:" || u.protocol === "mailto:";
  } catch {
    return false;
  }
}

export function parseAndRenderText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Enhanced parser supporting multiple formats
  // Order matters: process from most specific to least specific patterns
  const patterns = [
    // Links: [text](url)
    { regex: /(\[([^\]]+)\]\(([^)]+)\))/g, type: 'link' as const },
    // Bold: **text**
    { regex: /(\*\*([^*]+)\*\*)/g, type: 'bold' as const },
    // Italic: *text*
    { regex: /(\*([^*]+)\*)/g, type: 'italic' as const },
    // Underline: __text__
    { regex: /(__([^_]+)__)/g, type: 'underline' as const },
  ];

  let parts: Array<string | React.ReactNode> = [text];
  let keyCounter = 0;

  // Process each pattern
  patterns.forEach(pattern => {
    const newParts: Array<string | React.ReactNode> = [];

    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }

      const matches = [...part.matchAll(pattern.regex)];
      if (matches.length === 0) {
        newParts.push(part);
        return;
      }

      let lastIndex = 0;
      matches.forEach(match => {
        const fullMatch = match[1];
        const content = match[2];
        const url = match[3]; // For links
        const startIndex = match.index!;

        // Add text before match
        if (startIndex > lastIndex) {
          newParts.push(part.slice(lastIndex, startIndex));
        }

        // Add formatted element
        switch (pattern.type) {
          case 'link': {
            const safe = isSafeUrl(url);
            newParts.push(
              safe ? (
                <a
                  key={keyCounter++}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline"
                >
                  {content}
                </a>
              ) : (
                <span key={keyCounter++}>{content}</span>
              )
            );
            break;
          }
          case 'bold':
            newParts.push(
              <strong key={keyCounter++} className="font-bold">
                {content}
              </strong>
            );
            break;
          case 'italic':
            newParts.push(
              <em key={keyCounter++} className="italic">
                {content}
              </em>
            );
            break;
          case 'underline':
            newParts.push(
              <u key={keyCounter++} className="underline">
                {content}
              </u>
            );
            break;
        }

        lastIndex = startIndex + fullMatch.length;
      });

      // Add remaining text
      if (lastIndex < part.length) {
        newParts.push(part.slice(lastIndex));
      }
    });

    parts = newParts;
  });

  // Convert any remaining strings to span elements
  return parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={`text-${index}`}>{part}</span>;
    }
    return part;
  });
}

// Alternative: Support both markdown and limited HTML tags
export function parseAndRenderTextWithHtml(text: string): React.ReactNode[] {
  if (!text) return [];

  // Convert markdown to HTML-like tokens for uniform processing
  let processedText = text
    // Links: [text](url) -> <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Underline: __text__ -> <u>text</u>
    .replace(/__(.*?)__/g, "<u>$1</u>")
    // Normalize existing HTML tags
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>");

  // First, split the entire text by line breaks to preserve original structure
  const lines = processedText.split('\n');
  const result: React.ReactNode[] = [];
  let keyCounter = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    
    // Add line break between lines (except for the first line)
    if (lineIndex > 0) {
      result.push(<br key={keyCounter++} />);
    }

    // Handle empty lines - preserve them as empty space
    if (line.trim() === '') {
      // For empty lines, we still want to maintain the line structure
      // The <br> above handles the line break, so we can continue
      continue;
    }

    // Process formatting for this specific line
    const parts = line.split(/(<\/?(?:strong|em|u|a[^>]*)>)/g);
    const lineElements: React.ReactNode[] = [];
    let tagStack: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part.startsWith('<')) {
        // Handle HTML tags
        if (part.startsWith('</')) {
          // Closing tag
          tagStack.pop();
        } else {
          // Opening tag
          const tagMatch = part.match(/<(\w+)(?:\s[^>]*)?>/);
          if (tagMatch) {
            tagStack.push(tagMatch[1]);
          }
        }
        continue;
      }

      if (part === '') {
        continue;
      }

      // Apply formatting based on current tag stack
      let element: React.ReactNode = part;

      if (tagStack.includes('strong')) {
        element = <strong key={keyCounter++} className="font-bold">{element}</strong>;
      }
      if (tagStack.includes('em')) {
        element = <em key={keyCounter++} className="italic">{element}</em>;
      }
      if (tagStack.includes('u')) {
        element = <u key={keyCounter++} className="underline">{element}</u>;
      }
      if (tagStack.includes('a')) {
        // Extract href from the opening tag
        const linkTagIndex = Math.max(0, i - 2);
        const linkTag = parts[linkTagIndex];
        const hrefMatch = linkTag?.match(/href="([^"]+)"/);
        const href = hrefMatch ? hrefMatch[1] : '#';
        const safe = isSafeUrl(href);

        element = safe ? (
          <a
            key={keyCounter++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 underline"
          >
            {element}
          </a>
        ) : (
          <span key={keyCounter++}>{element as any}</span>
        );
      }

      lineElements.push(element);
    }

    // Add all elements from this line to the result
    result.push(...lineElements);
  }

  return result.length > 0 ? result : [<span key="empty">{text}</span>];
}

// Text manipulation helpers for the editor toolbar
// Parse prayer content to separate scripture references from main content
export function parsePrayerContent(content: string): {
  references: string | null;
  prayerText: string;
} {
  if (!content) return { references: null, prayerText: '' };

  // Look for "References:" at the beginning of the content
  const referencesMatch = content.match(/^References:\s*([^\n]+(?:\n[^A-Z\n][^\n]*)*)/i);
  
  if (referencesMatch) {
    const references = referencesMatch[0].trim();
    // Remove the references section from the main content
    const prayerText = content.replace(referencesMatch[0], '').trim();
    return { references, prayerText };
  }

  // If no "References:" section found, return all content as prayer text
  return { references: null, prayerText: content };
}

export function insertFormatting(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  formatType: 'bold' | 'italic' | 'underline' | 'link'
): { newText: string; newCursorPos: number } {
  const selectedText = text.slice(selectionStart, selectionEnd);
  const hasSelection = selectionStart !== selectionEnd;

  let wrapper: { start: string; end: string; placeholder?: string };

  switch (formatType) {
    case 'bold':
      wrapper = { start: '**', end: '**', placeholder: 'bold text' };
      break;
    case 'italic':
      wrapper = { start: '*', end: '*', placeholder: 'italic text' };
      break;
    case 'underline':
      wrapper = { start: '__', end: '__', placeholder: 'underlined text' };
      break;
    case 'link':
      wrapper = { start: '[', end: '](url)', placeholder: 'link text' };
      break;
  }

  const insertText = hasSelection ? selectedText : (wrapper.placeholder || '');
  const formattedText = wrapper.start + insertText + wrapper.end;

  const newText = text.slice(0, selectionStart) + formattedText + text.slice(selectionEnd);
  const newCursorPos = hasSelection
    ? selectionStart + formattedText.length
    : selectionStart + wrapper.start.length + insertText.length;

  return { newText, newCursorPos };
}