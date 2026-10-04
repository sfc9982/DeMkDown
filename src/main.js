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

/**
 * Safely load user options from browser storage
 */
function loadSavedOptions() {
  try {
    const raw = localStorage.getItem('demkdown_options') || localStorage.getItem('demark_options');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_OPTIONS, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved options from localStorage:', e);
  }
  return { ...DEFAULT_OPTIONS };
}

/**
 * Persist user options into browser storage
 */
function saveOptionsToStorage() {
  try {
    localStorage.setItem('demkdown_options', JSON.stringify(state.options));
  } catch (e) {
    console.warn('Failed to save options to localStorage:', e);
  }
}

// Application State
const state = {
  options: loadSavedOptions(),
  currentLang: localStorage.getItem('demkdown_lang') || localStorage.getItem('demark_lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en'),
  optionsCollapsed: (localStorage.getItem('demkdown_options_collapsed') || localStorage.getItem('demark_options_collapsed')) === 'true',
  widthMode: localStorage.getItem('demkdown_width_mode') || 'standard',
  theme: localStorage.getItem('demkdown_theme') || 'system',
  viewMode: localStorage.getItem('demkdown_view_mode') || 'clean', // 'clean' | 'diff'
  diffMode: localStorage.getItem('demkdown_diff_mode') || 'text',  // 'text' | 'line'
  lastResult: '',
  lastStats: null,
};

// DOM Element References
// Width & Theme Controls
const btnToggleWidth = document.getElementById('btnToggleWidth');
const iconWidthExpand = document.getElementById('iconWidthExpand');
const iconWidthCollapse = document.getElementById('iconWidthCollapse');
const txtWidthMode = document.getElementById('txtWidthMode');

const themeDropdownContainer = document.getElementById('themeDropdownContainer');
const themeDropdownBtn = document.getElementById('themeDropdownBtn');
const themeMenu = document.getElementById('themeMenu');
const themeChevron = document.getElementById('themeChevron');
const themeCurrentIcon = document.getElementById('themeCurrentIcon');
const themeCurrentLabel = document.getElementById('themeCurrentLabel');

const langDropdownContainer = document.getElementById('langDropdownContainer');
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langMenu = document.getElementById('langMenu');
const langChevron = document.getElementById('langChevron');
const langCurrentLabel = document.getElementById('langCurrentLabel');

// Sample Presets Dropdown Elements
const sampleDropdownContainer = document.getElementById('sampleDropdownContainer');
const sampleDropdownBtn = document.getElementById('sampleDropdownBtn');
const sampleMenu = document.getElementById('sampleMenu');
const sampleChevron = document.getElementById('sampleChevron');
const sampleCurrentLabel = document.getElementById('sampleCurrentLabel');

// Collapsible Options Panel Elements
const optionsHeaderBar = document.getElementById('optionsHeaderBar');
const optionsBody = document.getElementById('optionsBody');
const btnToggleOptions = document.getElementById('btnToggleOptions');
const txtToggleOptions = document.getElementById('txtToggleOptions');
const iconToggleOptions = document.getElementById('iconToggleOptions');
const btnNavToggleOptions = document.getElementById('btnNavToggleOptions');
const navToggleOptionsText = document.getElementById('navToggleOptionsText');
const navToggleOptionsChevron = document.getElementById('navToggleOptionsChevron');
const configSummaryBadge = document.getElementById('configSummaryBadge');

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
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  localStorage.setItem('demkdown_lang', lang);
  localStorage.setItem('demark_lang', lang);

  if (langCurrentLabel) {
    langCurrentLabel.textContent = LANG_LABELS[lang] || 'English (US)';
  }

  // Update checkmarks in custom dropdown menu
  document.querySelectorAll('.lang-option').forEach((opt) => {
    const optLang = opt.getAttribute('data-lang');
    const checkIcon = opt.querySelector('.check-icon');
    if (optLang === lang) {
      opt.classList.add('bg-orange-600/20', 'text-orange-300', 'font-medium');
      opt.classList.remove('text-slate-300');
      if (checkIcon) checkIcon.classList.remove('hidden');
    } else {
      opt.classList.remove('bg-orange-600/20', 'text-orange-300', 'font-medium');
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

  // Update collapsible toggle labels and summary
  if (txtToggleOptions) {
    txtToggleOptions.textContent = state.optionsCollapsed ? t('expandOptions', '展开配置') : t('collapseOptions', '收起配置');
  }
  if (navToggleOptionsText) {
    navToggleOptionsText.textContent = t('navConfigBtn', '规则配置');
  }
  if (txtWidthMode) {
    txtWidthMode.textContent = state.widthMode === 'widescreen' ? t('widthWidescreen', '适应宽屏') : t('widthStandard', '正常宽度');
  }
  updateThemeUI();
  updateConfigSummary();

  // Re-run process to refresh localized badges
  processText();
}

/**
 * Apply width mode (Standard: 1280px / Widescreen: fluid 98vw)
 */
function applyWidthMode(mode, showFeedback = false) {
  state.widthMode = mode;
  localStorage.setItem('demkdown_width_mode', mode);

  if (mode === 'widescreen') {
    document.documentElement.classList.add('layout-widescreen');
    if (iconWidthExpand) iconWidthExpand.classList.add('hidden');
    if (iconWidthCollapse) iconWidthCollapse.classList.remove('hidden');
    if (txtWidthMode) txtWidthMode.textContent = t('widthWidescreen', '适应宽屏');
    if (showFeedback) showToast(t('toastWidthWidescreen', '已切换为适应宽屏模式 (全宽流式)'));
  } else {
    document.documentElement.classList.remove('layout-widescreen');
    if (iconWidthExpand) iconWidthExpand.classList.remove('hidden');
    if (iconWidthCollapse) iconWidthCollapse.classList.add('hidden');
    if (txtWidthMode) txtWidthMode.textContent = t('widthStandard', '正常宽度');
    if (showFeedback) showToast(t('toastWidthStandard', '已切换为正常宽度 (1280px)'));
  }
}

function toggleWidthMode() {
  const nextMode = state.widthMode === 'widescreen' ? 'standard' : 'widescreen';
  applyWidthMode(nextMode, true);
}

/**
 * Determine theme based on preference or system media query
 */
function getResolvedTheme(theme = state.theme) {
  if (theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

/**
 * Apply theme: dark | light | system
 */
function applyTheme(theme, showFeedback = false) {
  state.theme = theme;
  localStorage.setItem('demkdown_theme', theme);

  const resolved = getResolvedTheme(theme);
  if (resolved === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }

  updateThemeUI();

  if (showFeedback) {
    const themeNames = {
      dark: t('themeDark', '夜间模式'),
      light: t('themeLight', '白天模式'),
      system: t('themeSystem', '跟随系统'),
    };
    showToast(`${t('themeLabel', '外观')}: ${themeNames[theme] || theme}`);
  }
}

/**
 * Update Theme Dropdown UI (Label, Icons, Active Checkmarks)
 */
function updateThemeUI() {
  if (!themeCurrentLabel || !themeCurrentIcon) return;

  const themeKeyMap = {
    dark: 'themeDark',
    light: 'themeLight',
    system: 'themeSystem',
  };
  themeCurrentLabel.textContent = t(themeKeyMap[state.theme] || 'themeDark', '外观');

  // Set current icon SVG
  if (state.theme === 'light') {
    themeCurrentIcon.innerHTML = `<svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="4" stroke-width="2" stroke="currentColor"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M8.34 15.66l-1.41 1.41m12.14 0l-1.41-1.41M8.34 8.34L6.93 6.93" /></svg>`;
  } else if (state.theme === 'system') {
    themeCurrentIcon.innerHTML = `<svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="0" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8m-4-4v4" /></svg>`;
  } else {
    themeCurrentIcon.innerHTML = `<svg class="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
  }

  // Update checkmarks in themeMenu
  document.querySelectorAll('.theme-option').forEach((opt) => {
    const optTheme = opt.getAttribute('data-theme');
    const checkIcon = opt.querySelector('.theme-check');
    if (optTheme === state.theme) {
      opt.classList.add('bg-orange-600/20', 'text-orange-300', 'font-medium');
      opt.classList.remove('text-slate-200');
      if (checkIcon) checkIcon.classList.remove('hidden');
    } else {
      opt.classList.remove('bg-orange-600/20', 'text-orange-300', 'font-medium');
      opt.classList.add('text-slate-200');
      if (checkIcon) checkIcon.classList.add('hidden');
    }
  });
}

/**
 * Toggle custom theme dropdown menu
 */
function toggleThemeDropdown(open) {
  if (!themeMenu) return;
  const shouldOpen = typeof open === 'boolean' ? open : themeMenu.classList.contains('hidden');
  if (shouldOpen) {
    if (langMenu) toggleLangDropdown(false);
    if (sampleMenu) toggleSampleDropdown(false);
    themeMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      themeMenu.classList.remove('opacity-0', 'scale-95');
      themeMenu.classList.add('opacity-100', 'scale-100');
      if (themeChevron) themeChevron.classList.add('rotate-180');
      if (themeDropdownBtn) themeDropdownBtn.setAttribute('aria-expanded', 'true');
    });
  } else {
    themeMenu.classList.remove('opacity-100', 'scale-100');
    themeMenu.classList.add('opacity-0', 'scale-95');
    if (themeChevron) themeChevron.classList.remove('rotate-180');
    if (themeDropdownBtn) themeDropdownBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      themeMenu.classList.add('hidden');
    }, 150);
  }
}

/**
 * Toggle custom language dropdown menu
 */
function toggleLangDropdown(open) {
  if (!langMenu) return;
  const shouldOpen = typeof open === 'boolean' ? open : langMenu.classList.contains('hidden');
  if (shouldOpen) {
    if (sampleMenu) toggleSampleDropdown(false);
    if (themeMenu) toggleThemeDropdown(false);
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
 * Toggle custom sample presets dropdown menu
 */
function toggleSampleDropdown(open) {
  if (!sampleMenu) return;
  const shouldOpen = typeof open === 'boolean' ? open : sampleMenu.classList.contains('hidden');
  if (shouldOpen) {
    if (langMenu) toggleLangDropdown(false);
    if (themeMenu) toggleThemeDropdown(false);
    sampleMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      sampleMenu.classList.remove('opacity-0', 'scale-95');
      sampleMenu.classList.add('opacity-100', 'scale-100');
      if (sampleChevron) sampleChevron.classList.add('rotate-180');
      if (sampleDropdownBtn) sampleDropdownBtn.setAttribute('aria-expanded', 'true');
    });
  } else {
    sampleMenu.classList.remove('opacity-100', 'scale-100');
    sampleMenu.classList.add('opacity-0', 'scale-95');
    if (sampleChevron) sampleChevron.classList.remove('rotate-180');
    if (sampleDropdownBtn) sampleDropdownBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      sampleMenu.classList.add('hidden');
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
    modePlainBtn.className = 'px-3.5 py-1 bg-orange-700 text-white font-medium shadow-[0_0_12px_rgba(194,65,12,0.5)] border border-orange-500/50 transition';
    modeMarkdownBtn.className = 'px-3.5 py-1 text-slate-400 hover:text-orange-300 transition';
  } else {
    modeMarkdownBtn.className = 'px-3.5 py-1 bg-orange-700 text-white font-medium shadow-[0_0_12px_rgba(194,65,12,0.5)] border border-orange-500/50 transition';
    modePlainBtn.className = 'px-3.5 py-1 text-slate-400 hover:text-orange-300 transition';
  }

  updateConfigSummary();
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

  saveOptionsToStorage();
  updateConfigSummary();
}

/**
 * Update the dynamic telemetry summary badge in the options header bar
 */
function updateConfigSummary() {
  if (!configSummaryBadge) return;
  const isZh = state.currentLang === 'zh';

  // Count basic active strip options
  let basicCount = 0;
  if (state.options.stripHeadings) basicCount++;
  if (state.options.stripEmphasis) basicCount++;
  if (state.options.stripInlineCode) basicCount++;
  if (state.options.stripBlockquotes) basicCount++;
  if (state.options.stripLists) basicCount++;

  const basicStr = isZh ? `${basicCount}项基础剥离` : `${basicCount} Strip Rules`;

  // Code Block Mode
  let codeStr = '';
  if (state.options.codeBlocks === 'unwrap') codeStr = isZh ? '保留代码' : 'Unwrap Code';
  else if (state.options.codeBlocks === 'remove') codeStr = isZh ? '剔除代码' : 'Remove Code';
  else codeStr = isZh ? '保留代码框' : 'Keep Fences';

  // Table Mode
  let tableStr = '';
  if (state.options.tables === 'plain') tableStr = isZh ? '纯文本表格' : 'Aligned Tables';
  else if (state.options.tables === 'tsv') tableStr = 'TSV';
  else if (state.options.tables === 'csv') tableStr = 'CSV';
  else if (state.options.tables === 'remove') tableStr = isZh ? '剔除表格' : 'Remove Tables';
  else tableStr = isZh ? '保留表格' : 'Keep Tables';

  // Links Mode
  let linkStr = '';
  if (state.options.links === 'text_only') linkStr = isZh ? '仅文字' : 'Text Only';
  else if (state.options.links === 'url_only') linkStr = 'URL Only';
  else if (state.options.links === 'text_and_url') linkStr = isZh ? '文字+URL' : 'Text+URL';
  else if (state.options.links === 'remove') linkStr = isZh ? '剔除链接' : 'No Links';
  else linkStr = isZh ? '保留链接' : 'Keep Links';

  // AI Fluff
  const aiStr = state.options.cleanAIFluff 
    ? (isZh ? '✨AI过滤开启' : '✨AI Filter On')
    : (isZh ? 'AI过滤关闭' : 'AI Filter Off');

  configSummaryBadge.textContent = `${basicStr} · ${codeStr} · ${tableStr} · ${linkStr} · ${aiStr}`;
}

/**
 * Set and animate the collapsed/expanded state of the Options & Config Bar
 */
function setOptionsCollapsed(collapsed) {
  state.optionsCollapsed = Boolean(collapsed);
  localStorage.setItem('demkdown_options_collapsed', state.optionsCollapsed ? 'true' : 'false');
  localStorage.setItem('demark_options_collapsed', state.optionsCollapsed ? 'true' : 'false');

  if (!optionsBody) return;

  if (state.optionsCollapsed) {
    // Collapse
    optionsBody.classList.remove('max-h-[600px]', 'opacity-100', 'pb-2.5');
    optionsBody.classList.add('max-h-0', 'opacity-0', 'pointer-events-none', 'pb-0');

    if (txtToggleOptions) txtToggleOptions.textContent = t('expandOptions', '展开配置');
    if (iconToggleOptions) iconToggleOptions.classList.remove('rotate-180');
    if (navToggleOptionsChevron) navToggleOptionsChevron.classList.remove('rotate-180');
  } else {
    // Expand
    optionsBody.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none', 'pb-0');
    optionsBody.classList.add('max-h-[600px]', 'opacity-100', 'pb-2.5');

    if (txtToggleOptions) txtToggleOptions.textContent = t('collapseOptions', '收起配置');
    if (iconToggleOptions) iconToggleOptions.classList.add('rotate-180');
    if (navToggleOptionsChevron) navToggleOptionsChevron.classList.add('rotate-180');
  }
}

function toggleOptionsCollapsed() {
  setOptionsCollapsed(!state.optionsCollapsed);
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
  localStorage.setItem('demkdown_view_mode', mode);
  if (mode === 'clean') {
    if (viewModeClean) viewModeClean.className = 'px-3.5 py-1 bg-orange-700 text-white font-semibold shadow-[0_0_12px_rgba(194,65,12,0.5)] border border-orange-500/50 transition';
    if (viewModeDiff) viewModeDiff.className = 'px-3.5 py-1 text-slate-400 hover:text-orange-300 transition flex items-center gap-1.5';
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
    if (viewModeDiff) viewModeDiff.className = 'px-3.5 py-1 bg-orange-700 text-white font-semibold shadow-[0_0_12px_rgba(194,65,12,0.5)] border border-orange-500/50 transition flex items-center gap-1.5';
    if (viewModeClean) viewModeClean.className = 'px-3.5 py-1 text-slate-400 hover:text-orange-300 transition';
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
  localStorage.setItem('demkdown_diff_mode', mode);
  if (mode === 'text') {
    if (diffModeText) diffModeText.className = 'px-2.5 py-1 bg-orange-700 text-white font-medium transition shadow-[0_0_10px_rgba(194,65,12,0.4)]';
    if (diffModeLine) diffModeLine.className = 'px-2.5 py-1 text-slate-400 hover:text-orange-300 transition';
  } else {
    if (diffModeLine) diffModeLine.className = 'px-2.5 py-1 bg-orange-700 text-white font-medium transition shadow-[0_0_10px_rgba(194,65,12,0.4)]';
    if (diffModeText) diffModeText.className = 'px-2.5 py-1 text-slate-400 hover:text-orange-300 transition';
  }
  renderDiffView();
}

/**
 * Core processing function: runs AST-based DeMark on input text
 */
function processText() {
  cancelInputDebounce();
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
    { count: counts.headings, label: t('optHeadings', 'headings'), highlight: 'text-orange-400' },
    { count: counts.emphasis, label: t('optEmphasis', 'bold/italic'), highlight: 'text-orange-400' },
    { count: counts.codeBlocks, label: t('codeBlocksLabel', 'code').replace(':', ''), highlight: 'text-orange-400' },
    { count: counts.tables, label: t('tablesLabel', 'tables').replace(':', ''), highlight: 'text-orange-400' },
    { count: counts.blockquotes, label: t('optBlockquotes', 'quotes'), highlight: 'text-orange-400' },
    { count: counts.fluff, label: t('fluffCount', 'fluff'), highlight: 'text-amber-300' },
  ];
  statsBadgesEl.textContent = '';
  for (const { count, label, highlight } of badgeData) {
    const span = document.createElement('span');
    span.className = `px-2 py-0.5 bg-slate-800 text-xs ${count ? `${highlight} font-semibold` : 'text-slate-300'}`;
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
    btnCopy.classList.replace('bg-orange-700', 'bg-emerald-600');
    btnCopy.classList.replace('hover:bg-orange-600', 'hover:bg-emerald-500');
    btnCopy.title = t('btnCopied', 'Copied!');
    btnCopy.setAttribute('aria-label', t('btnCopied', 'Copied!'));

    setSvgPath(iconCopy, 'M5 13l4 4L19 7', '2.5');

    showToast(t('toastCopied', 'Cleaned text copied to clipboard!'));

    setTimeout(() => {
      if (textCopy) textCopy.textContent = t('btnCopy', 'Copy');
      btnCopy.classList.replace('bg-emerald-600', 'bg-orange-700');
      btnCopy.classList.replace('hover:bg-emerald-500', 'hover:bg-orange-600');
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
 * Handle paste action (Intelligent Probe & Graceful Fallback):
 * - If clipboard-read permission is already 'granted', reads and pastes silently (zero prompt).
 * - If permission is 'prompt' or 'denied' (or unsupported), avoids triggering the browser's scary popup,
 *   focuses the input area with tactical visual feedback, and guides to native shortcut (Ctrl+V / ⌘V).
 */
async function pasteInput() {
  inputEl.focus();

  let isGranted = false;
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const status = await navigator.permissions.query({ name: 'clipboard-read' });
      if (status && status.state === 'granted') {
        isGranted = true;
      }
    }
  } catch (e) {
    // permissions.query({ name: 'clipboard-read' }) not supported or rejected (e.g. Firefox)
    isGranted = false;
  }

  // If already granted, silently read clipboard without any permission popup
  if (isGranted && navigator.clipboard && navigator.clipboard.readText) {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        inputEl.value = text;
        processText();
        showToast(t('toastPasted', 'Pasted text from clipboard'));
        return;
      }
    } catch (err) {
      // If reading fails for any reason, gracefully fall through
    }
  }

  // Not pre-granted or read text was empty: provide zero-prompt focus + shortcut guidance
  inputEl.classList.add('ring-2', 'ring-orange-500');
  setTimeout(() => {
    inputEl.classList.remove('ring-2', 'ring-orange-500');
  }, 400);

  const isMac = typeof navigator !== 'undefined' && /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform);
  const key = isMac ? '⌘V' : 'Ctrl+V';
  const promptTemplate = t('toastPastePrompt', 'Input focused — press {key} to paste');
  showToast(promptTemplate.replace('{key}', key));
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
  a.download = `demkdown-clean-output.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`${t('toastDownloaded', 'Downloaded')} (demkdown-clean-output.${ext})`);
}

/**
 * Load a sample preset into input
 */
function loadSample(sampleKey) {
  toggleSampleDropdown(false);
  const sample = SAMPLES[sampleKey];
  if (sample) {
    inputEl.value = sample.content;
    processText();
    showToast(`${t('toastSampleLoaded', 'Loaded sample:')} ${sample.title}`);
  }
}

// Event Listeners

// Width Mode Toggle listener
if (btnToggleWidth) {
  btnToggleWidth.addEventListener('click', toggleWidthMode);
}

// Custom Theme Dropdown listeners
if (themeDropdownBtn) {
  themeDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleThemeDropdown();
  });
}

document.querySelectorAll('.theme-option').forEach((opt) => {
  opt.addEventListener('click', (e) => {
    e.stopPropagation();
    const theme = opt.getAttribute('data-theme');
    applyTheme(theme, true);
    toggleThemeDropdown(false);
  });
});

// Custom Language Dropdown listeners
if (langDropdownBtn) {
  langDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLangDropdown();
  });
}

// Custom Sample Dropdown listeners
if (sampleDropdownBtn) {
  sampleDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSampleDropdown();
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
  if (sampleDropdownContainer && !sampleDropdownContainer.contains(e.target)) {
    toggleSampleDropdown(false);
  }
  if (themeDropdownContainer && !themeDropdownContainer.contains(e.target)) {
    toggleThemeDropdown(false);
  }
});

// Debounce timer for real-time input typing (120ms)
let inputDebounceTimer = null;

function cancelInputDebounce() {
  if (inputDebounceTimer) {
    clearTimeout(inputDebounceTimer);
    inputDebounceTimer = null;
  }
}

// Input typing (debounced at 120ms for peak performance with large texts)
inputEl.addEventListener('input', () => {
  cancelInputDebounce();
  inputDebounceTimer = setTimeout(() => {
    processText();
  }, 120);
});

// Native paste feedback
inputEl.addEventListener('paste', () => {
  showToast(t('toastPasted', 'Pasted text from clipboard'));
});

// Drag and drop markdown file into input area
inputEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  inputEl.classList.add('ring-2', 'ring-orange-500');
});

inputEl.addEventListener('dragleave', () => {
  inputEl.classList.remove('ring-2', 'ring-orange-500');
});

inputEl.addEventListener('drop', (e) => {
  e.preventDefault();
  inputEl.classList.remove('ring-2', 'ring-orange-500');
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
  saveOptionsToStorage();
  syncControlsFromState();
  processText();
});

modeMarkdownBtn.addEventListener('click', () => {
  state.options.outputMode = 'markdown';
  saveOptionsToStorage();
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
  saveOptionsToStorage();
  syncControlsFromState();
  processText();
  showToast(t('presetMax', 'Applied Max Strip preset'));
});

btnPresetDefault.addEventListener('click', () => {
  state.options = { ...DEFAULT_OPTIONS };
  saveOptionsToStorage();
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
  saveOptionsToStorage();
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
    toggleSampleDropdown(false);
    toggleThemeDropdown(false);
  }
});

// System prefers-color-scheme dynamic listener
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'system') {
      applyTheme('system', false);
    }
  });
}

// Collapsible Options Panel Listeners
if (optionsHeaderBar) {
  optionsHeaderBar.addEventListener('click', toggleOptionsCollapsed);
}
if (btnToggleOptions) {
  btnToggleOptions.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleOptionsCollapsed();
  });
}
if (btnNavToggleOptions) {
  btnNavToggleOptions.addEventListener('click', toggleOptionsCollapsed);
}

// Initialize on page load
applyWidthMode(state.widthMode, false);
applyTheme(state.theme, false);
setLanguage(state.currentLang);
syncControlsFromState();
setOptionsCollapsed(state.optionsCollapsed);
if (state.viewMode !== 'clean') {
  switchViewMode(state.viewMode);
}
if (state.diffMode !== 'text') {
  switchDiffMode(state.diffMode);
}
loadSample(state.currentLang === 'zh' ? 'chinese' : 'conversational');
