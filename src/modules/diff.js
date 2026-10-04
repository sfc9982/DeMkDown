/**
 * DeMark Diff Engine
 * High-performance, zero-latency text diffing supporting Line Mode and Text/Word Mode
 * with Myers LCS algorithm and CJK character boundary awareness.
 */

/**
 * HTML escaping helper to prevent XSS in diff views
 */
export function escapeHTML(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Tokenizes text for Text Diff Mode.
 * Correctly handles:
 * - Line breaks (\r?\n)
 * - Whitespace runs ([^\S\r\n]+)
 * - CJK ideographs (individual characters)
 * - Latin/alphanumeric words ([\w]+)
 * - Punctuation & symbols ([^\s\w\u4e00-\u9fa5])
 */
export function tokenizeText(text = '') {
  if (!text) return [];
  const regex = /(\r?\n|[^\S\r\n]+|[\u4e00-\u9fa5]|[\w]+|[^\s\w\u4e00-\u9fa5])/g;
  return text.match(regex) || [];
}

/**
 * Core Myers Difference Algorithm with Common Prefix/Suffix Optimization
 *
 * @param {string[]} a - Old tokens/lines
 * @param {string[]} b - New tokens/lines
 * @returns {Array<{ type: 'unchanged' | 'removed' | 'added', value: string }>}
 */
export function myersDiff(a = [], b = []) {
  const n = a.length;
  const m = b.length;
  if (n === 0 && m === 0) return [];
  if (n === 0) return b.map((v) => ({ type: 'added', value: v }));
  if (m === 0) return a.map((v) => ({ type: 'removed', value: v }));

  // 1. Common Prefix Optimization
  let start = 0;
  while (start < n && start < m && a[start] === b[start]) {
    start++;
  }

  // 2. Common Suffix Optimization
  let aEnd = n - 1;
  let bEnd = m - 1;
  while (aEnd >= start && bEnd >= start && a[aEnd] === b[bEnd]) {
    aEnd--;
    bEnd--;
  }

  const prefix = a.slice(0, start).map((v) => ({ type: 'unchanged', value: v }));
  const suffix = a.slice(aEnd + 1).map((v) => ({ type: 'unchanged', value: v }));

  const subA = a.slice(start, aEnd + 1);
  const subB = b.slice(start, bEnd + 1);

  const subN = subA.length;
  const subM = subB.length;

  if (subN === 0) {
    const middle = subB.map((v) => ({ type: 'added', value: v }));
    return [...prefix, ...middle, ...suffix];
  }
  if (subM === 0) {
    const middle = subA.map((v) => ({ type: 'removed', value: v }));
    return [...prefix, ...middle, ...suffix];
  }

  // Myers on middle section
  const offset = subM;
  const max = subN + subM;
  const v = new Int32Array(2 * max + 2);
  v[1 + offset] = 0;
  const trace = [];

  let foundD = -1;
  const MAX_D = 2500; // Bailout threshold for huge divergent inputs to prevent UI hang

  for (let d = 0; d <= max; d++) {
    if (d > MAX_D) {
      // Safety fallback: replace remaining subA with subB
      const middle = [
        ...subA.map((val) => ({ type: 'removed', value: val })),
        ...subB.map((val) => ({ type: 'added', value: val })),
      ];
      return [...prefix, ...middle, ...suffix];
    }

    trace.push(new Int32Array(v));
    for (let k = -d; k <= d; k += 2) {
      let x;
      if (k === -d || (k !== d && v[k - 1 + offset] < v[k + 1 + offset])) {
        x = v[k + 1 + offset];
      } else {
        x = v[k - 1 + offset] + 1;
      }
      let y = x - k;
      while (x < subN && y < subM && subA[x] === subB[y]) {
        x++;
        y++;
      }
      v[k + offset] = x;
      if (x >= subN && y >= subM) {
        foundD = d;
        break;
      }
    }
    if (foundD !== -1) break;
  }

  // Backtrack
  const middle = [];
  let x = subN;
  let y = subM;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vPrev = trace[d];
    const k = x - y;
    let prevK;
    if (k === -d || (k !== d && vPrev[k - 1 + offset] < vPrev[k + 1 + offset])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = vPrev[prevK + offset];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      middle.unshift({ type: 'unchanged', value: subA[x - 1] });
      x--;
      y--;
    }
    if (d > 0) {
      if (x === prevX) {
        middle.unshift({ type: 'added', value: subB[prevY] });
        y--;
      } else {
        middle.unshift({ type: 'removed', value: subA[prevX] });
        x--;
      }
    }
  }

  return [...prefix, ...middle, ...suffix];
}

/**
 * Collapses consecutive tokens of the same type
 */
export function collapseTokens(tokens = []) {
  if (tokens.length === 0) return [];
  const result = [];
  let current = { type: tokens[0].type, value: tokens[0].value };

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === current.type) {
      current.value += t.value;
    } else {
      result.push(current);
      current = { type: t.type, value: t.value };
    }
  }
  result.push(current);
  return result;
}

/**
 * Compute Line Diff between old and new strings
 */
export function computeLineDiff(oldStr = '', newStr = '') {
  const oldLines = oldStr ? oldStr.split('\n') : [];
  const newLines = newStr ? newStr.split('\n') : [];

  const rawDiff = myersDiff(oldLines, newLines);

  let oldLineNum = 1;
  let newLineNum = 1;
  let additions = 0;
  let deletions = 0;

  const lines = rawDiff.map((item) => {
    let lineObj = {
      type: item.type,
      value: item.value,
      oldLine: null,
      newLine: null,
    };

    if (item.type === 'unchanged') {
      lineObj.oldLine = oldLineNum++;
      lineObj.newLine = newLineNum++;
    } else if (item.type === 'removed') {
      lineObj.oldLine = oldLineNum++;
      deletions++;
    } else if (item.type === 'added') {
      lineObj.newLine = newLineNum++;
      additions++;
    }

    return lineObj;
  });

  return {
    lines,
    stats: {
      additions,
      deletions,
      totalChanges: additions + deletions,
    },
  };
}

/**
 * Compute Text/Word Diff between old and new strings
 */
export function computeTextDiff(oldStr = '', newStr = '') {
  const oldTokens = tokenizeText(oldStr);
  const newTokens = tokenizeText(newStr);

  const rawDiff = myersDiff(oldTokens, newTokens);
  const collapsed = collapseTokens(rawDiff);

  let deletions = 0;
  let additions = 0;

  collapsed.forEach((item) => {
    if (item.type === 'removed') {
      const trimmed = item.value.trim();
      if (trimmed) deletions += trimmed.length;
    } else if (item.type === 'added') {
      const trimmed = item.value.trim();
      if (trimmed) additions += trimmed.length;
    }
  });

  return {
    tokens: collapsed,
    stats: {
      deletions,
      additions,
      totalChanges: additions + deletions,
    },
  };
}

/**
 * Renders Line Diff HTML
 */
export function renderLineDiffHTML(diffResult, labels = { noChanges: 'No differences detected' }) {
  const { lines, stats } = diffResult;
  if (!lines || lines.length === 0) {
    return `<div class="p-12 text-center text-slate-400 font-sans text-sm">${escapeHTML(labels.noChanges)}</div>`;
  }

  const noChangesBanner = stats && stats.totalChanges === 0
    ? `<div class="mx-4 my-2.5 px-3.5 py-2 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs sm:text-sm flex items-center gap-2 select-none">
        <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>${escapeHTML(labels.noChanges)}</span>
      </div>`
    : '';

  const rows = lines.map((line) => {
    let rowClass = 'flex items-start py-1 px-3.5 border-l-2 text-xs sm:text-sm font-mono select-text transition-colors ';
    let symbol = ' ';
    let symbolClass = 'w-5 select-none shrink-0 font-bold text-xs sm:text-sm ';

    if (line.type === 'removed') {
      rowClass += 'bg-red-500/15 text-red-200 border-red-500/80 hover:bg-red-500/20';
      symbol = '-';
      symbolClass += 'text-red-400';
    } else if (line.type === 'added') {
      rowClass += 'bg-emerald-500/15 text-emerald-200 border-emerald-500/80 hover:bg-emerald-500/20';
      symbol = '+';
      symbolClass += 'text-emerald-400';
    } else {
      rowClass += 'border-transparent text-slate-300 hover:bg-slate-800/40';
      symbolClass += 'text-slate-600';
    }

    return `
      <div class="${rowClass}">
        <span class="${symbolClass}">${symbol}</span>
        <span class="flex-1 whitespace-pre-wrap break-all leading-relaxed">${escapeHTML(line.value) || '&nbsp;'}</span>
      </div>
    `;
  }).join('');

  return `<div class="flex flex-col min-w-full py-2">${noChangesBanner}<div class="divide-y divide-slate-800/30">${rows}</div></div>`;
}

/**
 * Renders Text Diff HTML (inline text flow with red/green highlights)
 */
export function renderTextDiffHTML(diffResult, labels = { noChanges: 'No differences detected' }) {
  const { tokens, stats } = diffResult;
  if (!tokens || tokens.length === 0) {
    return `<div class="p-12 text-center text-slate-400 font-sans text-sm">${escapeHTML(labels.noChanges)}</div>`;
  }

  const noChangesBanner = stats && stats.totalChanges === 0
    ? `<div class="mb-4 px-3.5 py-2 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs sm:text-sm flex items-center gap-2 select-none">
        <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>${escapeHTML(labels.noChanges)}</span>
      </div>`
    : '';

  const spans = tokens.map((token) => {
    const escaped = escapeHTML(token.value);
    if (token.type === 'removed') {
      return `<span class="bg-red-500/25 text-red-200 line-through decoration-red-500/80 px-1.5 py-0.5 mx-0.5 border border-red-500/30 select-text font-normal" title="Removed / Stripped">${escaped}</span>`;
    }
    if (token.type === 'added') {
      return `<span class="bg-emerald-500/25 text-emerald-200 font-medium px-1.5 py-0.5 mx-0.5 border border-emerald-500/30 select-text" title="Added / Formatted">${escaped}</span>`;
    }
    return `<span class="text-slate-200 select-text">${escaped}</span>`;
  }).join('');

  return `<div class="p-5 whitespace-pre-wrap font-mono-code text-sm sm:text-[15px] lg:text-base leading-relaxed tracking-normal">${noChangesBanner}${spans}</div>`;
}
