import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

/**
 * Default stripping configuration options
 */
export const DEFAULT_OPTIONS = {
  // Output format: 'plain' (pure clean text) | 'markdown' (cleaned markdown)
  outputMode: 'plain',

  // Configurable element toggles
  stripHeadings: true,
  stripEmphasis: true,        // **bold**, *italic*, ~~strikethrough~~
  stripInlineCode: true,      // `code`
  stripBlockquotes: true,     // > blockquote
  codeBlocks: 'unwrap',       // 'unwrap' | 'remove' | 'preserve'
  tables: 'plain',            // 'plain' (aligned text) | 'tsv' | 'csv' | 'remove' | 'preserve'
  links: 'text_only',         // 'text_only' | 'text_and_url' | 'remove' | 'preserve'
  images: 'remove',           // 'remove' | 'alt_only' | 'preserve'
  stripLists: false,          // true: remove bullet/number markers | false: preserve
  stripThematicBreaks: true,  // strip --- lines
  stripHtml: true,            // strip raw HTML tags
  cleanAIFluff: true,         // strip common AI conversational opening and closing phrases
  normalizeWhitespace: true,  // collapse redundant blank lines, trim lines
};

/**
 * Calculates display visual column width taking East Asian Wide (CJK) characters into account
 */
export function getVisualWidth(str = '') {
  let width = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0);
    // East Asian Wide / Fullwidth characters, CJK ideographs, Hangul, Katakana, Hiragana
    if (
      (code >= 0x1100 && code <= 0x115F) || // Hangul Jamo
      (code >= 0x2E80 && code <= 0xA4CF && code !== 0x303F) || // CJK Radicals, Kangxi, CJK Ideographs
      (code >= 0xAC00 && code <= 0xD7A3) || // Hangul Syllables
      (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
      (code >= 0xFE10 && code <= 0xFE19) || // Vertical forms
      (code >= 0xFE30 && code <= 0xFE6F) || // CJK Compatibility Forms
      (code >= 0xFF00 && code <= 0xFF60) || // Fullwidth Forms
      (code >= 0xFFE0 && code <= 0xFFE6) ||
      (code >= 0x20000 && code <= 0x2FFFD) ||
      (code >= 0x30000 && code <= 0x3FFFD)
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

/**
 * Visual padding that accounts for wide CJK characters
 */
export function padEndVisual(str = '', targetWidth = 0) {
  const currentWidth = getVisualWidth(str);
  const diff = targetWidth - currentWidth;
  if (diff <= 0) return str;
  return str + ' '.repeat(diff);
}

/**
 * Multilingual AI conversational opening detection patterns
 * Supports English, Chinese (Simplified/Traditional), Japanese, Spanish, French, German, Korean, Portuguese
 */
const AI_PREAMBLE_PATTERNS = [
  // English
  /^(?:Certainly|Sure thing|Sure|Of course|Absolutely|Definitely|Here(?:'s| is| are)|Below is|Below are|As requested|Glad to help|Great question|Happy to help|I'd be glad to help|I'd be happy to help|No problem|Understood|Right away)[^.\n]*[.:!]?$/i,
  /^(?:Certainly|Sure thing|Sure|Of course|Absolutely|Definitely|Here(?:'s| is| are)|Below is|Below are|As requested|Glad to help|Great question|Happy to help|I'd be glad to help|I'd be happy to help|No problem|Understood|Right away)[^.\n]*[.:!]?\s+(?:here is|here are|below is|below are|this is|the breakdown|the solution|the response|an overview|what you asked for)[^.\n]*[.:!]?$/i,
  /^(?:Here is what you need to know|Here is the requested information|Here's the generated|I've summarized|To answer your question)[^.\n]*[.:!]?$/i,

  // Chinese (Simplified & Traditional)
  /^(?:好的|当然可以|当然没问题|没问题|很高兴为您解答|根据您的需求|以下是|下面是|为您整理如下|为您提供如下|如您所愿|这里是|这是为您整理的|这是您需要的)[，,！!：: ]?.*$/i,
  /^(?:针对您的问题|对于您提到的|为您生成的方案如下|为您准备的解答如下)[，,！!：: ]?.*$/i,

  // Japanese
  /^(?:もちろんです|承知いたしました|かしこまりました|ご質問ありがとうございます|以下に|以下が|以下をご参照ください|ご要望の|お答えいたします)[。、！!：: ]?.*$/i,

  // Spanish
  /^(?:¡?(?:Por supuesto|Claro que sí|Claro|Con gusto|Absolutamente|Aquí tienes|A continuación|Como solicitaste|Con mucho gusto))[!.,: ]?.*$/i,

  // French
  /^(?:Bien sûr|Certainement|Avec plaisir|Absolument|Voici|Ci-dessous|Comme demandé|Ravi de vous aider)[!.,: ]?.*$/i,

  // German
  /^(?:Sicher|Natürlich|Sehr gerne|Hier ist|Hier sind|Im Folgenden finden Sie|Wie gewünscht|Gerne helfe ich)[!.,: ]?.*$/i,

  // Korean
  /^(?:네[!,.]?|물론입니다[!,.]?|요청하신|아래는|다음은|질문해 주셔서 감사합니다|도움이 되어 기쁩니다)[!,.: ]?.*$/i,

  // Portuguese
  /^(?:Com certeza|Claro|Com prazer|Aqui está|Abaixo está|Conforme solicitado)[!.,: ]?.*$/i,
];

/**
 * Multilingual AI conversational closing detection patterns
 */
const AI_POSTAMBLE_PATTERNS = [
  // English
  /(?:(?:I\s+)?hope this helps[^\n]*|Let me know if you (?:have any|need|require|would like)[^\n]*|Feel free to (?:ask|reach out|let me know)[^\n]*|Cheers[!,.]?|Best regards[!,.]?|Happy coding[!,.]?|Good luck[!,.]?)[^\n]*$/i,

  // Chinese (Simplified & Traditional)
  /(?:(?:希望(?:这(?:些)?|以上(?:内容)?)?(?:对您|对你)?有(?:所)?帮助|如果(?:您|你)有任何(?:其他)?(?:问题|疑问)|如有疑问[，,]?欢迎|祝您(?:工作|生活)?顺利|期待您的反馈)[^\n]*)$/i,

  // Japanese
  /(?:(?:(?:上記の内容が)?お役に立てれば幸いです|(?:何か)?ご不明な点(?:やご質問)?がございましたら|よろしくお願い(?:いたし|致し)ます)[^\n]*)$/i,

  // Spanish
  /(?:(?:¡?Espero que esto te (?:sea de ayuda|sirva)|¡?No dudes en (?:preguntar|consultar)|¡?Quedo a tu disposición|Saludos)[^\n]*)$/i,

  // French
  /(?:(?:J'espère que cela vous aide|N'hésitez pas si vous avez d'autres questions|Cordialement|Bonne journée)[^\n]*)$/i,

  // German
  /(?:(?:Ich hoffe(?:,| dass) das hilft(?: Ihnen)? weiter|Lassen Sie mich wissen, falls Sie weitere Fragen haben|Viele Grüße)[^\n]*)$/i,

  // Korean
  /(?:(?:도움이 되기를 바랍니다|추가 질문이 있으시면 언제든지 말씀해 주세요|감사합니다)[^\n]*)$/i,

  // Portuguese
  /(?:(?:Espero que isso ajude|Se tiver alguma dúvida, estou à disposição|Abraços)[^\n]*)$/i,
];

/**
 * Multilingual word counting supporting English, Latin, CJK, and Cyrillic scripts
 */
export function countWords(text = '') {
  if (!text || !text.trim()) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
      let count = 0;
      for (const segment of segmenter.segment(text)) {
        if (segment.isWordLike) count++;
      }
      return count;
    } catch {
      // Fallback if segmenter fails
    }
  }

  // Regex fallback: count CJK characters + Latin words
  const cjkChars = (text.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const latinWords = text
    .replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return cjkChars + latinWords;
}

/**
 * Format an AST table node into clean plain-text columns with CJK fullwidth support
 */
export function formatTableAsPlainText(tableNode) {
  const rows = [];
  for (const row of tableNode.children) {
    if (row.type === 'tableRow') {
      const cells = row.children.map(cell => toString(cell).trim());
      rows.push(cells);
    }
  }
  if (rows.length === 0) return '';

  const colCount = Math.max(...rows.map(r => r.length));
  const colWidths = Array(colCount).fill(0);
  rows.forEach(r => {
    r.forEach((cell, idx) => {
      const visualWidth = getVisualWidth(cell);
      if (visualWidth > colWidths[idx]) colWidths[idx] = visualWidth;
    });
  });

  const lines = rows.map((r, rowIdx) => {
    const padded = r.map((cell, idx) => padEndVisual(cell, colWidths[idx] || 0)).join('   ');
    if (rowIdx === 0 && rows.length > 1) {
      const divider = colWidths.map(w => '-'.repeat(Math.max(w, 3))).join('   ');
      return padded + '\n' + divider;
    }
    return padded;
  });

  return lines.join('\n');
}

/**
 * Format an AST table node into TSV (Tab-Separated Values)
 */
export function formatTableAsTSV(tableNode) {
  return tableNode.children
    .filter(row => row.type === 'tableRow')
    .map(row => row.children.map(cell => toString(cell).trim().replace(/\t/g, ' ')).join('\t'))
    .join('\n');
}

/**
 * Format an AST table node into CSV (Comma-Separated Values)
 */
export function formatTableAsCSV(tableNode) {
  return tableNode.children
    .filter(row => row.type === 'tableRow')
    .map(row =>
      row.children
        .map(cell => {
          const val = toString(cell).trim().replace(/"/g, '""');
          return val.includes(',') || val.includes('"') || val.includes('\n') ? `"${val}"` : val;
        })
        .join(',')
    )
    .join('\n');
}

/**
 * Serializes an mdast AST into clean Plain Text based on options
 */
function serializeASTToPlainText(rootNode, options, stats) {
  function processNode(n) {
    if (!n) return '';

    switch (n.type) {
      case 'root':
        return n.children
          .map(child => processNode(child))
          .filter(str => str !== null && str !== undefined && str.length > 0)
          .join('\n\n');

      case 'heading': {
        const text = n.children.map(processNode).join('');
        if (options.stripHeadings) {
          stats.strippedCounts.headings = (stats.strippedCounts.headings || 0) + 1;
          return text;
        }
        return '#'.repeat(n.depth) + ' ' + text;
      }

      case 'paragraph':
        return n.children.map(processNode).join('');

      case 'blockquote': {
        const bqContent = n.children.map(processNode).join('\n\n');
        if (options.stripBlockquotes) {
          stats.strippedCounts.blockquotes = (stats.strippedCounts.blockquotes || 0) + 1;
          return bqContent;
        }
        return bqContent
          .split('\n')
          .map(line => '> ' + line)
          .join('\n');
      }

      case 'strong':
      case 'emphasis':
      case 'delete': {
        if (options.stripEmphasis) {
          stats.strippedCounts.emphasis = (stats.strippedCounts.emphasis || 0) + 1;
          return n.children.map(processNode).join('');
        }
        const inner = n.children.map(processNode).join('');
        if (n.type === 'strong') return `**${inner}**`;
        if (n.type === 'emphasis') return `*${inner}*`;
        if (n.type === 'delete') return `~~${inner}~~`;
        return inner;
      }

      case 'inlineCode': {
        if (options.stripInlineCode) {
          stats.strippedCounts.inlineCode = (stats.strippedCounts.inlineCode || 0) + 1;
          return n.value;
        }
        return '`' + n.value + '`';
      }

      case 'code': {
        if (options.codeBlocks === 'remove') {
          stats.strippedCounts.codeBlocks = (stats.strippedCounts.codeBlocks || 0) + 1;
          return '';
        }
        if (options.codeBlocks === 'unwrap') {
          stats.strippedCounts.codeBlocks = (stats.strippedCounts.codeBlocks || 0) + 1;
          return n.value;
        }
        // preserve
        return '```' + (n.lang || '') + '\n' + n.value + '\n```';
      }

      case 'table': {
        stats.strippedCounts.tables = (stats.strippedCounts.tables || 0) + 1;
        if (options.tables === 'remove') return '';
        if (options.tables === 'tsv') return formatTableAsTSV(n);
        if (options.tables === 'csv') return formatTableAsCSV(n);
        if (options.tables === 'plain') return formatTableAsPlainText(n);
        // preserve markdown table
        return n.children
          .map(
            row =>
              '| ' +
              row.children.map(cell => cell.children.map(processNode).join('')).join(' | ') +
              ' |'
          )
          .join('\n');
      }

      case 'list': {
        return n.children
          .map((item, idx) => {
            const itemText = item.children.map(processNode).join('\n');
            if (options.stripLists) {
              stats.strippedCounts.lists = (stats.strippedCounts.lists || 0) + 1;
              return itemText;
            }
            const bullet = n.ordered ? `${(n.start || 1) + idx}. ` : '- ';
            return bullet + itemText.replace(/\n/g, '\n  ');
          })
          .join('\n');
      }

      case 'listItem':
        return n.children.map(processNode).join('\n');

      case 'link': {
        const linkText = n.children.map(processNode).join('');
        if (options.links === 'remove') {
          stats.strippedCounts.links = (stats.strippedCounts.links || 0) + 1;
          return '';
        }
        if (options.links === 'text_only') {
          stats.strippedCounts.links = (stats.strippedCounts.links || 0) + 1;
          return linkText;
        }
        if (options.links === 'text_and_url') {
          stats.strippedCounts.links = (stats.strippedCounts.links || 0) + 1;
          return linkText ? `${linkText} (${n.url})` : n.url;
        }
        return `[${linkText}](${n.url})`;
      }

      case 'image': {
        if (options.images === 'remove') {
          stats.strippedCounts.images = (stats.strippedCounts.images || 0) + 1;
          return '';
        }
        if (options.images === 'alt_only') {
          stats.strippedCounts.images = (stats.strippedCounts.images || 0) + 1;
          return n.alt ? `[Image: ${n.alt}]` : '';
        }
        return `![${n.alt || ''}](${n.url})`;
      }

      case 'thematicBreak': {
        if (options.stripThematicBreaks) {
          stats.strippedCounts.thematicBreaks = (stats.strippedCounts.thematicBreaks || 0) + 1;
          return '';
        }
        return '---';
      }

      case 'text':
        return n.value;

      case 'html': {
        if (options.stripHtml) {
          stats.strippedCounts.html = (stats.strippedCounts.html || 0) + 1;
          return '';
        }
        return n.value;
      }

      default:
        if (n.children) {
          return n.children.map(processNode).join('');
        }
        return n.value || '';
    }
  }

  return processNode(rootNode);
}

/**
 * Transforms AST for selective Clean Markdown serialization
 */
function transformASTForCleanMarkdown(tree, options, stats) {
  // 1. Headings -> Paragraphs
  if (options.stripHeadings) {
    visit(tree, 'heading', (node) => {
      stats.strippedCounts.headings = (stats.strippedCounts.headings || 0) + 1;
      node.type = 'paragraph';
    });
  }

  // 2. Unwrap inline emphasis (strong, emphasis, delete)
  if (options.stripEmphasis || options.stripInlineCode) {
    function unwrapInlineChildren(node) {
      if (!node.children) return;
      const newChildren = [];
      for (const child of node.children) {
        if (
          options.stripEmphasis &&
          (child.type === 'strong' || child.type === 'emphasis' || child.type === 'delete')
        ) {
          stats.strippedCounts.emphasis = (stats.strippedCounts.emphasis || 0) + 1;
          unwrapInlineChildren(child);
          newChildren.push(...child.children);
        } else if (options.stripInlineCode && child.type === 'inlineCode') {
          stats.strippedCounts.inlineCode = (stats.strippedCounts.inlineCode || 0) + 1;
          newChildren.push({ type: 'text', value: child.value });
        } else {
          unwrapInlineChildren(child);
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    }
    unwrapInlineChildren(tree);
  }

  // 3. Blockquotes -> unwrap into parent
  if (options.stripBlockquotes) {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.blockquotes = (stats.strippedCounts.blockquotes || 0) + 1;
        parent.children.splice(index, 1, ...node.children);
        return index;
      }
    });
  }

  // 4. Code blocks
  if (options.codeBlocks !== 'preserve') {
    visit(tree, 'code', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.codeBlocks = (stats.strippedCounts.codeBlocks || 0) + 1;
        if (options.codeBlocks === 'remove') {
          parent.children.splice(index, 1);
          return index;
        }
        if (options.codeBlocks === 'unwrap') {
          parent.children.splice(index, 1, {
            type: 'paragraph',
            children: [{ type: 'text', value: node.value }],
          });
          return index;
        }
      }
    });
  }

  // 5. Tables
  if (options.tables !== 'preserve') {
    visit(tree, 'table', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.tables = (stats.strippedCounts.tables || 0) + 1;
        if (options.tables === 'remove') {
          parent.children.splice(index, 1);
          return index;
        }
        let formatted = '';
        if (options.tables === 'plain') formatted = formatTableAsPlainText(node);
        else if (options.tables === 'tsv') formatted = formatTableAsTSV(node);
        else if (options.tables === 'csv') formatted = formatTableAsCSV(node);

        parent.children.splice(index, 1, {
          type: 'paragraph',
          children: [{ type: 'text', value: formatted }],
        });
        return index;
      }
    });
  }

  // 6. Links
  if (options.links !== 'preserve') {
    visit(tree, 'link', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.links = (stats.strippedCounts.links || 0) + 1;
        if (options.links === 'remove') {
          parent.children.splice(index, 1);
          return index;
        }
        const linkText = toString(node);
        const replacement =
          options.links === 'text_and_url' ? `${linkText} (${node.url})` : linkText;
        parent.children.splice(index, 1, {
          type: 'text',
          value: replacement,
        });
        return index;
      }
    });
  }

  // 7. Images
  if (options.images !== 'preserve') {
    visit(tree, 'image', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.images = (stats.strippedCounts.images || 0) + 1;
        if (options.images === 'remove') {
          parent.children.splice(index, 1);
          return index;
        }
        if (options.images === 'alt_only') {
          parent.children.splice(index, 1, {
            type: 'text',
            value: node.alt ? `[Image: ${node.alt}]` : '',
          });
          return index;
        }
      }
    });
  }

  // 8. Thematic breaks
  if (options.stripThematicBreaks) {
    visit(tree, 'thematicBreak', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.thematicBreaks = (stats.strippedCounts.thematicBreaks || 0) + 1;
        parent.children.splice(index, 1);
        return index;
      }
    });
  }

  // 9. Raw HTML
  if (options.stripHtml) {
    visit(tree, 'html', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.html = (stats.strippedCounts.html || 0) + 1;
        parent.children.splice(index, 1);
        return index;
      }
    });
  }

  // 10. Strip Lists
  if (options.stripLists) {
    visit(tree, 'list', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        stats.strippedCounts.lists = (stats.strippedCounts.lists || 0) + 1;
        const paragraphs = node.children.map(item => ({
          type: 'paragraph',
          children: item.children.flatMap(c => c.children || [c]),
        }));
        parent.children.splice(index, 1, ...paragraphs);
        return index;
      }
    });
  }
}

/**
 * Filter out AI conversation filler phrases from text
 */
export function removeAIFluff(text, stats) {
  let paragraphs = text.split(/\n\n+/);
  if (paragraphs.length === 0) return text;

  // Check first 1-2 paragraphs for opening fluff
  for (let i = 0; i < Math.min(2, paragraphs.length); i++) {
    const p = paragraphs[i].trim();
    let matched = false;
    for (const pattern of AI_PREAMBLE_PATTERNS) {
      if (pattern.test(p)) {
        paragraphs.splice(i, 1);
        stats.strippedCounts.fluff = (stats.strippedCounts.fluff || 0) + 1;
        i--;
        matched = true;
        break;
      }
    }
    if (matched) continue;
  }

  // Check last paragraph for closing fluff
  if (paragraphs.length > 0) {
    const lastP = paragraphs[paragraphs.length - 1].trim();
    for (const pattern of AI_POSTAMBLE_PATTERNS) {
      if (pattern.test(lastP)) {
        paragraphs.pop();
        stats.strippedCounts.fluff = (stats.strippedCounts.fluff || 0) + 1;
        break;
      }
    }
  }

  return paragraphs.join('\n\n');
}

/**
 * Normalize whitespace and redundant blank lines
 */
export function cleanWhitespace(text) {
  return text
    // Replace carriage returns
    .replace(/\r\n/g, '\n')
    // Trim trailing spaces on each line
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    // Collapse 3 or more newlines into maximum 2 newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Main DeMark processing function
 * Takes raw Markdown text, parses into AST with remark-parse & remark-gfm,
 * applies AST transformations, and outputs clean Plain Text or Clean Markdown.
 *
 * @param {string} inputMarkdown - Raw markdown input string
 * @param {Partial<typeof DEFAULT_OPTIONS>} userOptions - Configuration toggles
 * @returns {{ result: string, stats: object }}
 */
export function demark(inputMarkdown = '', userOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  const stats = {
    inputLength: inputMarkdown.length,
    inputWords: countWords(inputMarkdown),
    inputLines: inputMarkdown ? inputMarkdown.split('\n').length : 0,
    strippedCounts: {
      headings: 0,
      emphasis: 0,
      inlineCode: 0,
      blockquotes: 0,
      codeBlocks: 0,
      tables: 0,
      links: 0,
      images: 0,
      thematicBreaks: 0,
      lists: 0,
      html: 0,
      fluff: 0,
    },
  };

  if (!inputMarkdown || !inputMarkdown.trim()) {
    return {
      result: '',
      stats: {
        ...stats,
        outputLength: 0,
        outputWords: 0,
        outputLines: 0,
        charReduction: 0,
        charReductionPercent: 0,
      },
    };
  }

  let textToParse = inputMarkdown;

  // Parse markdown into AST with GFM support (tables, autolinks, strikethrough)
  const tree = unified().use(remarkParse).use(remarkGfm).parse(textToParse);

  let outputText = '';

  if (options.outputMode === 'plain') {
    // Pure plain-text AST traversal
    outputText = serializeASTToPlainText(tree, options, stats);
  } else {
    // Clean Markdown AST transformation & remark stringification
    transformASTForCleanMarkdown(tree, options, stats);
    outputText = unified()
      .use(remarkGfm)
      .use(remarkStringify, {
        bullet: '-',
        emphasis: '*',
        strong: '**',
        fences: true,
        listItemIndent: 'one',
      })
      .stringify(tree);
  }

  // Strip AI conversational preamble / postamble if toggled
  if (options.cleanAIFluff) {
    outputText = removeAIFluff(outputText, stats);
  }

  // Normalize whitespace
  if (options.normalizeWhitespace) {
    outputText = cleanWhitespace(outputText);
  }

  const outputLength = outputText.length;
  const outputWords = countWords(outputText);
  const outputLines = outputText ? outputText.split('\n').length : 0;
  const charReduction = Math.max(0, stats.inputLength - outputLength);
  const charReductionPercent =
    stats.inputLength > 0 ? Number(((charReduction / stats.inputLength) * 100).toFixed(1)) : 0;

  return {
    result: outputText,
    stats: {
      ...stats,
      outputLength,
      outputWords,
      outputLines,
      charReduction,
      charReductionPercent,
    },
  };
}
