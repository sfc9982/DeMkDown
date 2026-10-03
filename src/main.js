import { demark, DEFAULT_OPTIONS } from './modules/demark.js';
import { SAMPLES } from './modules/samples.js';
import { TRANSLATIONS } from './modules/i18n.js';
import {
  computeLineDiff,
  computeTextDiff,
  renderLineDiffHTML,
  renderTextDiffHTML,
} from './modules/diff.js';

/**
 * Safely replace SVG icon path content without innerHTML (XSS-safe)
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
function setSvgPath(svgEl, d, strokeWidth = '2') {
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('d', d);
  svgEl.appendChild(path);
}

const LANG_LABELS = {
  en: 'English (US)',
  zh: '简体中文',
};

// Application State
const state = {
  options: { ...DEFAULT_OPTIONS },
  currentLang: localStorage.getItem('demark_lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en'),
  viewMode: 'clean', // 'clean' | 'diff'
  diffMode: 'text',  // 'text' | 'line'
  lastResult: '',
  lastStats: null,
};

// DOM Element References
const langDropdownContainer = document.getElementById('langDropdownContainer');
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langMenu = document.getElementById('langMenu');
const langChevron = document.getElementById('langChevron');
const langCurrentLabel = document.getElementById('langCurrentLabel');

const inputEl = document.getElementById('inputMarkdown');
const outputEl = document.getElementById('outputClean');

// View & Diff Mode Switchers
const viewModeClean = document.getElementById('viewModeClean');
const viewModeDiff = document.getElementById('viewModeDiff');
const diffModeSelector = document.getElementById('diffModeSelector');
const diffModeText = document.getElementById('diffModeText');
const diffModeLine = document.getElementById('diffModeLine');
const diffContainer = document.getElementById('diffContainer');
const diffStatsBadge = document.getElementById('diffStatsBadge');
const diffDeletionsCount = document.getElementById('diffDeletionsCount');
const diffAdditionsCount = document.getElementById('diffAdditionsCount');

const inputBadgeEl = document.getElementById('inputBadgeStats');
const outputBadgeEl = document.getElementById('outputBadgeStats');
const badgeReductionEl = document.getElementById('badgeReduction');
const inputLinesEl = document.getElementById('inputLinesCount');
const statsBadgesEl = document.getElementById('statsBadges');
const outputPerfEl = document.getElementById('outputPerf');

// Mode Buttons
const modePlainBtn = document.getElementById('modePlain');
const modeMarkdownBtn = document.getElementById('modeMarkdown');

// Option Inputs
const optStripHeadings = document.getElementById('optStripHeadings');
const optStripEmphasis = document.getElementById('optStripEmphasis');
const optStripInlineCode = document.getElementById('optStripInlineCode');
const optStripBlockquotes = document.getElementById('optStripBlockquotes');
const optCodeBlocks = document.getElementById('optCodeBlocks');
const optTables = document.getElementById('optTables');
const optLinks = document.getElementById('optLinks');
const optStripLists = document.getElementById('optStripLists');
const optCleanFluff = document.getElementById('optCleanFluff');

// Action Buttons
const btnCopy = document.getElementById('btnCopy');
const textCopy = document.getElementById('textCopy');
const iconCopy = document.getElementById('iconCopy');
const btnPaste = document.getElementById('btnPaste');
const btnClear = document.getElementById('btnClear');
const btnDownload = document.getElementById('btnDownload');

// Sample Buttons
const btnSampleChat = document.getElementById('btnSampleChat');
const btnSampleCode = document.getElementById('btnSampleCode');
const btnSampleTable = document.getElementById('btnSampleTable');
const btnSampleChinese = document.getElementById('btnSampleChinese');
const btnSampleStress = document.getElementById('btnSampleStress');

// Preset Buttons
const btnPresetMax = document.getElementById('btnPresetMax');
const btnPresetDefault = document.getElementById('btnPresetDefault');
const btnPresetPreserveCode = document.getElementById('btnPresetPreserveCode');

// API Modal Elements
const apiModal = document.getElementById('apiModal');
const btnOpenApiModal = document.getElementById('btnOpenApiModal');
const btnCloseApiModal = document.getElementById('btnCloseApiModal');
const btnGotItApiModal = document.getElementById('btnGotItApiModal');

// Toast Element
const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toastMessage');
let toastTimer = null;

/**
 * Get current dictionary translations
 */
function t(key, fallback = '') {
  const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || fallback || key;
}

/**
 * Switch UI language dynamically and update custom dropdown state
 */
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  state.currentLang = lang;
  localStorage.setItem('demark_lang', lang);

  if (langCurrentLabel) {
    langCurrentLabel.textContent = LANG_LABELS[lang] || 'English (US)';
  }

  // Update checkmarks in custom dropdown menu
  document.querySelectorAll('.lang-option').forEach((opt) => {
    const optLang = opt.getAttribute('data-lang');
    const checkIcon = opt.querySelector('.check-icon');
    if (optLang === lang) {
      opt.classList.add('bg-indigo-600/20', 'text-indigo-200', 'font-medium');
      opt.classList.remove('text-slate-300');
      if (checkIcon) checkIcon.classList.remove('hidden');
    } else {
      opt.classList.remove('bg-indigo-600/20', 'text-indigo-200', 'font-medium');
      opt.classList.add('text-slate-300');
      if (checkIcon) checkIcon.classList.add('hidden');
    }
  });

  // Update text of all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Update tooltips and aria-labels with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation) {
      el.title = translation;
      el.setAttribute('aria-label', translation);
    }
  });

  // Update placeholders
  inputEl.placeholder = t('inputPlaceholder');
  outputEl.placeholder = t('outputPlaceholder');

  // Re-run process to refresh localized badges
  processText();
}

/**
 * Toggle custom language dropdown menu
 */
function toggleLangDropdown(open) {
  if (!langMenu) return;
  const shouldOpen = typeof open === 'boolean' ? open : langMenu.classList.contains('hidden');
  if (shouldOpen) {
    langMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      langMenu.classList.remove('opacity-0', 'scale-95');
      langMenu.classList.add('opacity-100', 'scale-100');
      if (langChevron) langChevron.classList.add('rotate-180');
      if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'true');
    });
  } else {
    langMenu.classList.remove('opacity-100', 'scale-100');
    langMenu.classList.add('opacity-0', 'scale-95');
    if (langChevron) langChevron.classList.remove('rotate-180');
    if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      langMenu.classList.add('hidden');
    }, 150);
  }
}

/**
 * Show temporary toast message
 */
function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer);
  toastMessageEl.textContent = message;
  toastEl.classList.remove('hidden');
  toastEl.classList.add('flex', 'animate-toast');

  toastTimer = setTimeout(() => {
    toastEl.classList.remove('flex', 'animate-toast');
    toastEl.classList.add('hidden');
  }, 2200);
}

/**
 * Synchronize UI controls from current state options
 */
function syncControlsFromState() {
  optStripHeadings.checked = state.options.stripHeadings;
  optStripEmphasis.checked = state.options.stripEmphasis;
  optStripInlineCode.checked = state.options.stripInlineCode;
  optStripBlockquotes.checked = state.options.stripBlockquotes;
  optCodeBlocks.value = state.options.codeBlocks;
  optTables.value = state.options.tables;
  optLinks.value = state.options.links;
  optStripLists.checked = state.options.stripLists;
  optCleanFluff.checked = state.options.cleanAIFluff;

  if (state.options.outputMode === 'plain') {
    modePlainBtn.className = 'px-3.5 py-1 rounded-lg bg-indigo-600 text-white font-medium shadow-sm transition';
    modeMarkdownBtn.className = 'px-3.5 py-1 rounded-lg text-slate-400 hover:text-white transition';
  } else {
    modeMarkdownBtn.className = 'px-3.5 py-1 rounded-lg bg-indigo-600 text-white font-medium shadow-sm transition';
    modePlainBtn.className = 'px-3.5 py-1 rounded-lg text-slate-400 hover:text-white transition';
  }
}

/**
 * Read current UI control values into state options
 */
function readOptionsFromControls() {
  state.options.stripHeadings = optStripHeadings.checked;
  state.options.stripEmphasis = optStripEmphasis.checked;
  state.options.stripInlineCode = optStripInlineCode.checked;
  state.options.stripBlockquotes = optStripBlockquotes.checked;
  state.options.codeBlocks = optCodeBlocks.value;
  state.options.tables = optTables.value;
  state.options.links = optLinks.value;
  state.options.stripLists = optStripLists.checked;
  state.options.cleanAIFluff = optCleanFluff.checked;
}

/**
 * Render Diff View (Line or Text mode)
 */
function renderDiffView() {
  if (!diffContainer) return;
  const oldText = inputEl.value;
  const newText = state.lastResult;
  const noChangesLabel = t('diffNoChanges', 'No differences detected. Content is identical.');

  if (state.diffMode === 'line') {
    const lineDiff = computeLineDiff(oldText, newText);
    diffContainer.innerHTML = renderLineDiffHTML(lineDiff, { noChanges: noChangesLabel });
    if (diffDeletionsCount) diffDeletionsCount.textContent = `-${lineDiff.stats.deletions}`;
    if (diffAdditionsCount) diffAdditionsCount.textContent = `+${lineDiff.stats.additions}`;
  } else {
    const textDiff = computeTextDiff(oldText, newText);
    diffContainer.innerHTML = renderTextDiffHTML(textDiff, { noChanges: noChangesLabel });
    if (diffDeletionsCount) diffDeletionsCount.textContent = `-${textDiff.stats.deletions}`;
    if (diffAdditionsCount) diffAdditionsCount.textContent = `+${textDiff.stats.additions}`;
  }
}

/**
 * Switch between Clean and Diff view
 */
function switchViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'clean') {
    if (viewModeClean) viewModeClean.className = 'px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm transition';
    if (viewModeDiff) viewModeDiff.className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5';
    if (outputEl) outputEl.classList.remove('hidden');
    if (diffContainer) diffContainer.classList.add('hidden');
    if (diffModeSelector) {
      diffModeSelector.classList.add('hidden');
      diffModeSelector.classList.remove('inline-flex');
    }
    if (diffStatsBadge) {
      diffStatsBadge.classList.add('hidden');
      diffStatsBadge.classList.remove('flex');
    }
    if (state.lastStats?.inputLength > 0 && state.lastStats?.charReductionPercent > 0) {
      badgeReductionEl.classList.remove('hidden');
    }
  } else {
    if (viewModeDiff) viewModeDiff.className = 'px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm transition flex items-center gap-1.5';
    if (viewModeClean) viewModeClean.className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition';
    if (outputEl) outputEl.classList.add('hidden');
    if (diffContainer) diffContainer.classList.remove('hidden');
    if (diffModeSelector) {
      diffModeSelector.classList.remove('hidden');
      diffModeSelector.classList.add('inline-flex');
    }
    if (diffStatsBadge) {
      diffStatsBadge.classList.remove('hidden');
      diffStatsBadge.classList.add('flex');
    }
    badgeReductionEl.classList.add('hidden');
    renderDiffView();
  }
}

/**
 * Switch Diff Mode (Text vs Line)
 */
function switchDiffMode(mode) {
  state.diffMode = mode;
  if (mode === 'text') {
    if (diffModeText) diffModeText.className = 'px-2.5 py-1 rounded-md bg-indigo-600 text-white font-medium transition';
    if (diffModeLine) diffModeLine.className = 'px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 transition';
  } else {
    if (diffModeLine) diffModeLine.className = 'px-2.5 py-1 rounded-md bg-indigo-600 text-white font-medium transition';
    if (diffModeText) diffModeText.className = 'px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 transition';
  }
  renderDiffView();
}

/**
 * Core processing function: runs AST-based DeMark on input text
 */
function processText() {
  const text = inputEl.value;
  const start = performance.now();

  const { result, stats } = demark(text, state.options);
  const elapsed = (performance.now() - start).toFixed(1);

  state.lastResult = result;
  state.lastStats = stats;

  // Update output
  outputEl.value = result;

  const charsUnit = t('chars', 'chars');
  const wordsUnit = t('words', 'words');
  const linesUnit = t('lines', 'lines');

  // Update Input Badges
  inputBadgeEl.textContent = `${stats.inputLength.toLocaleString()} ${charsUnit} • ${stats.inputWords.toLocaleString()} ${wordsUnit}`;
  inputLinesEl.textContent = `${stats.inputLines.toLocaleString()} ${linesUnit}`;

  // Update Output Badges
  outputBadgeEl.textContent = `${stats.outputLength.toLocaleString()} ${charsUnit} • ${stats.outputWords.toLocaleString()} ${wordsUnit}`;

  if (state.viewMode !== 'diff') {
    if (stats.inputLength > 0 && stats.charReductionPercent > 0) {
      badgeReductionEl.textContent = `-${stats.charReductionPercent}%`;
      badgeReductionEl.title = `-${stats.charReduction.toLocaleString()} ${charsUnit}`;
      badgeReductionEl.classList.remove('hidden');
    } else {
      badgeReductionEl.classList.add('hidden');
    }
  }

  // Update stripped elements telemetry (safe DOM construction — no innerHTML)
  const counts = stats.strippedCounts;
  const badgeData = [
    { count: counts.headings, label: t('optHeadings', 'headings'), highlight: 'text-indigo-300' },
    { count: counts.emphasis, label: t('optEmphasis', 'bold/italic'), highlight: 'text-indigo-300' },
    { count: counts.codeBlocks, label: t('codeBlocksLabel', 'code').replace(':', ''), highlight: 'text-indigo-300' },
    { count: counts.tables, label: t('tablesLabel', 'tables').replace(':', ''), highlight: 'text-indigo-300' },
    { count: counts.blockquotes, label: t('optBlockquotes', 'quotes'), highlight: 'text-indigo-300' },
    { count: counts.fluff, label: t('fluffCount', 'fluff'), highlight: 'text-amber-300' },
  ];
  statsBadgesEl.textContent = '';
  for (const { count, label, highlight } of badgeData) {
    const span = document.createElement('span');
    span.className = `px-2 py-0.5 rounded bg-slate-800 text-xs ${count ? `${highlight} font-semibold` : 'text-slate-400'}`;
    span.textContent = `${count || 0} ${label}`;
    statsBadgesEl.appendChild(span);
  }

  outputPerfEl.textContent = `${elapsed}ms`;

  // Render Diff View if active
  if (state.viewMode === 'diff') {
    renderDiffView();
  }
}

/**
 * Handle copy to clipboard
 */
async function copyOutput() {
  const text = outputEl.value;
  if (!text) {
    showToast(t('toastNothingToCopy', 'Nothing to copy!'));
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    if (textCopy) textCopy.textContent = t('btnCopied', 'Copied!');
    btnCopy.classList.replace('bg-indigo-600', 'bg-emerald-600');
    btnCopy.classList.replace('hover:bg-indigo-500', 'hover:bg-emerald-500');
    btnCopy.title = t('btnCopied', 'Copied!');
    btnCopy.setAttribute('aria-label', t('btnCopied', 'Copied!'));

    setSvgPath(iconCopy, 'M5 13l4 4L19 7', '2.5');

    showToast(t('toastCopied', 'Cleaned text copied to clipboard!'));

    setTimeout(() => {
      if (textCopy) textCopy.textContent = t('btnCopy', 'Copy');
      btnCopy.classList.replace('bg-emerald-600', 'bg-indigo-600');
      btnCopy.classList.replace('hover:bg-emerald-500', 'hover:bg-indigo-500');
      btnCopy.title = t('tooltipCopy', 'Copy cleaned text (Ctrl+Enter)');
      btnCopy.setAttribute('aria-label', t('tooltipCopy', 'Copy cleaned text (Ctrl+Enter)'));
      setSvgPath(iconCopy, 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', '2');
    }, 1800);
  } catch (err) {
    outputEl.select();
    document.execCommand('copy');
    showToast(t('toastCopied', 'Copied to clipboard'));
  }
}

/**
 * Handle paste from clipboard
 */
async function pasteInput() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputEl.value = text;
      processText();
      showToast(t('toastPasted', 'Pasted text from clipboard'));
    }
  } catch (err) {
    inputEl.focus();
    showToast('Ctrl+V / Cmd+V');
  }
}

/**
 * Handle download of clean text
 */
function downloadOutput() {
  const text = outputEl.value;
  if (!text) {
    showToast(t('toastNothingToDownload', 'Nothing to download!'));
    return;
  }

  const ext = state.options.outputMode === 'markdown' ? 'md' : 'txt';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `demark-clean-output.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`${t('toastDownloaded', 'Downloaded')} (demark-clean-output.${ext})`);
}

/**
 * Load a sample preset into input
 */
function loadSample(sampleKey) {
  const sample = SAMPLES[sampleKey];
  if (sample) {
    inputEl.value = sample.content;
    processText();
    showToast(`${t('toastSampleLoaded', 'Loaded sample:')} ${sample.title}`);
  }
}

// Event Listeners

// Custom Language Dropdown listeners
if (langDropdownBtn) {
  langDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLangDropdown();
  });
}

document.querySelectorAll('.lang-option').forEach((opt) => {
  opt.addEventListener('click', (e) => {
    e.stopPropagation();
    const lang = opt.getAttribute('data-lang');
    setLanguage(lang);
    toggleLangDropdown(false);
  });
});

document.addEventListener('click', (e) => {
  if (langDropdownContainer && !langDropdownContainer.contains(e.target)) {
    toggleLangDropdown(false);
  }
});

// Input typing
inputEl.addEventListener('input', () => {
  processText();
});

// Drag and drop markdown file into input area
inputEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  inputEl.classList.add('ring-2', 'ring-indigo-500');
});

inputEl.addEventListener('dragleave', () => {
  inputEl.classList.remove('ring-2', 'ring-indigo-500');
});

inputEl.addEventListener('drop', (e) => {
  e.preventDefault();
  inputEl.classList.remove('ring-2', 'ring-indigo-500');
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    // Validate file type — only accept text-based files
    const ALLOWED_TYPES = ['text/plain', 'text/markdown', 'text/x-markdown', 'text/html', 'application/json', 'text/csv'];
    const ALLOWED_EXTENSIONS = /\.(md|markdown|txt|text|html|htm|json|csv|log|rst|adoc|yaml|yml|toml|xml)$/i;
    const isTypeAllowed = !file.type || ALLOWED_TYPES.includes(file.type) || file.type.startsWith('text/');
    const isExtAllowed = ALLOWED_EXTENSIONS.test(file.name);
    if (!isTypeAllowed && !isExtAllowed) {
      showToast('Unsupported file type. Please drop a text or Markdown file.');
      return;
    }
    // Enforce 5 MB size limit
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      showToast('File too large (max 5 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      inputEl.value = event.target.result;
      processText();
      showToast(`${t('toastSampleLoaded', 'Loaded file:')} ${file.name}`);
    };
    reader.readAsText(file);
  }
});

// Output Mode Switchers (Plain vs Markdown)
modePlainBtn.addEventListener('click', () => {
  state.options.outputMode = 'plain';
  syncControlsFromState();
  processText();
});

modeMarkdownBtn.addEventListener('click', () => {
  state.options.outputMode = 'markdown';
  syncControlsFromState();
  processText();
});

// View Mode Switchers (Clean vs Diff)
if (viewModeClean) viewModeClean.addEventListener('click', () => switchViewMode('clean'));
if (viewModeDiff) viewModeDiff.addEventListener('click', () => switchViewMode('diff'));

// Diff Sub-mode Switchers (Text vs Line)
if (diffModeText) diffModeText.addEventListener('click', () => switchDiffMode('text'));
if (diffModeLine) diffModeLine.addEventListener('click', () => switchDiffMode('line'));

// Option Toggles
const optionInputs = [
  optStripHeadings,
  optStripEmphasis,
  optStripInlineCode,
  optStripBlockquotes,
  optCodeBlocks,
  optTables,
  optLinks,
  optStripLists,
  optCleanFluff,
];

optionInputs.forEach((input) => {
  input.addEventListener('change', () => {
    readOptionsFromControls();
    processText();
  });
});

// Action buttons
btnCopy.addEventListener('click', copyOutput);
btnPaste.addEventListener('click', pasteInput);
btnDownload.addEventListener('click', downloadOutput);

btnClear.addEventListener('click', () => {
  inputEl.value = '';
  processText();
  showToast(t('toastCleared', 'Cleared input'));
});

// Presets
btnPresetMax.addEventListener('click', () => {
  state.options = {
    ...DEFAULT_OPTIONS,
    outputMode: 'plain',
    stripHeadings: true,
    stripEmphasis: true,
    stripInlineCode: true,
    stripBlockquotes: true,
    codeBlocks: 'remove',
    tables: 'remove',
    links: 'text_only',
    images: 'remove',
    stripLists: true,
    stripThematicBreaks: true,
    cleanAIFluff: true,
    normalizeWhitespace: true,
  };
  syncControlsFromState();
  processText();
  showToast(t('presetMax', 'Applied Max Strip preset'));
});

btnPresetDefault.addEventListener('click', () => {
  state.options = { ...DEFAULT_OPTIONS };
  syncControlsFromState();
  processText();
  showToast(t('presetDefault', 'Reset to Default rules'));
});

btnPresetPreserveCode.addEventListener('click', () => {
  state.options = {
    ...DEFAULT_OPTIONS,
    outputMode: 'markdown',
    stripHeadings: true,
    stripEmphasis: true,
    codeBlocks: 'preserve',
    tables: 'preserve',
    stripBlockquotes: true,
    cleanAIFluff: true,
  };
  syncControlsFromState();
  processText();
  showToast(t('presetKeepCode', 'Applied Preserve Code & Tables preset'));
});

// Sample Buttons
btnSampleChat.addEventListener('click', () => loadSample('conversational'));
btnSampleCode.addEventListener('click', () => loadSample('technicalCode'));
btnSampleTable.addEventListener('click', () => loadSample('tablesAndData'));
if (btnSampleChinese) btnSampleChinese.addEventListener('click', () => loadSample('chinese'));
if (btnSampleStress) btnSampleStress.addEventListener('click', () => loadSample('messyMarkdown'));

// Modal Controls
btnOpenApiModal.addEventListener('click', () => {
  apiModal.classList.remove('hidden');
  apiModal.classList.add('flex');
});

function closeModal() {
  apiModal.classList.remove('flex');
  apiModal.classList.add('hidden');
}

btnCloseApiModal.addEventListener('click', closeModal);
btnGotItApiModal.addEventListener('click', closeModal);
apiModal.addEventListener('click', (e) => {
  if (e.target === apiModal) closeModal();
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    copyOutput();
  }
  if (e.key === 'Escape') {
    closeModal();
    toggleLangDropdown(false);
  }
});

// Initialize on page load
setLanguage(state.currentLang);
syncControlsFromState();
loadSample(state.currentLang === 'zh' ? 'chinese' : 'conversational');
