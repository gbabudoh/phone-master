import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser: boolean;
}

export default function FormattedMessage({ content, isUser }: FormattedMessageProps) {
  if (isUser) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  // Parse and format the bot's message
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListTag key={elements.length} className="my-2 space-y-1 pl-5">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-sm">
              {formatInlineText(item)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <pre key={elements.length} className="my-3 overflow-x-auto rounded-md bg-gray-800 p-3 text-sm text-gray-100">
          <code className="font-mono">{codeBlockContent.join('\n')}</code>
        </pre>
      );
      codeBlockContent = [];
    }
  };

  const formatInlineText = (text: string) => {
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong class="font-bold text-primary">$1</strong>');
    
    // Italic: *text* or _text_ (but not inside bold)
    text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>');
    text = text.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="italic">$1</em>');
    
    // Inline code: `code`
    text = text.replace(/`(.+?)`/g, '<code class="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono text-gray-800">$1</code>');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  lines.forEach((line, index) => {
    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Empty lines
    if (line.trim() === '') {
      flushList();
      if (elements.length > 0 && elements[elements.length - 1] !== 'br') {
        elements.push(<br key={`br-${elements.length}`} />);
      }
      return;
    }

    // Headers
    if (line.match(/^#{1,6}\s/)) {
      flushList();
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
      const sizeClasses = {
        1: 'text-lg font-bold mt-4 mb-2 text-primary',
        2: 'text-base font-bold mt-3 mb-2 text-primary',
        3: 'text-sm font-bold mt-3 mb-1 text-primary',
        4: 'text-sm font-semibold mt-2 mb-1',
        5: 'text-xs font-semibold mt-2 mb-1',
        6: 'text-xs font-semibold mt-2 mb-1',
      };
      elements.push(
        React.createElement(
          HeadingTag,
          { key: elements.length, className: sizeClasses[level as keyof typeof sizeClasses] },
          formatInlineText(text)
        )
      );
      return;
    }

    // Unordered lists
    const ulMatch = line.match(/^[\s]*[•\-\*]\s+(.+)/);
    if (ulMatch) {
      const indent = line.match(/^[\s]*/)?.[0].length || 0;
      const item = ulMatch[1];
      
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(item);
      return;
    }

    // Ordered lists
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)/);
    if (olMatch) {
      const item = olMatch[1];
      
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(item);
      return;
    }

    // Regular paragraphs
    flushList();
    if (line.trim()) {
      elements.push(
        <p key={elements.length} className="my-1 text-sm leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    }
  });

  // Flush any remaining list or code block
  flushList();
  flushCodeBlock();

  return <div className="chatbot-message space-y-1">{elements}</div>;
}
