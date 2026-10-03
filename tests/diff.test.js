import {
  tokenizeText,
  myersDiff,
  collapseTokens,
  computeLineDiff,
  computeTextDiff,
  renderLineDiffHTML,
  renderTextDiffHTML,
  escapeHTML,
} from '../src/modules/diff.js';

console.log('=== RUNNING DIFF ENGINE TESTS ===');

// 1. HTML Escaping Test
console.log('\n--- TEST 1: XSS Safety Escaping ---');
const unsafe = `<script>alert("XSS & attack")</script> 'test'`;
const safe = escapeHTML(unsafe);
if (safe.includes('<script>') || safe.includes('"') || safe.includes('& ')) {
  throw new Error(`escapeHTML failed: ${safe}`);
}
if (!safe.includes('&lt;script&gt;') || !safe.includes('&amp;') || !safe.includes('&quot;')) {
  throw new Error(`escapeHTML output incorrect: ${safe}`);
}
console.log('✓ XSS Safety Escaping passed');

// 2. Tokenize Text Test
console.log('\n--- TEST 2: Tokenize Text ---');
const tokens = tokenizeText('Hello 世界! **DeMark** 123');
console.log('Tokens:', tokens);
// Expected: ['Hello', ' ', '世', '界', '!', ' ', '*', '*', 'DeMark', '*', '*', ' ', '123']
if (!tokens.includes('Hello') || !tokens.includes('世') || !tokens.includes('界') || !tokens.includes('DeMark')) {
  throw new Error(`tokenizeText did not separate tokens properly: ${JSON.stringify(tokens)}`);
}
console.log('✓ Tokenize Text passed');

// 3. Myers Diff Algorithm
console.log('\n--- TEST 3: Myers Algorithm ---');
const a = ['A', 'B', 'C', 'D'];
const b = ['A', 'X', 'C', 'D', 'E'];
const diff = myersDiff(a, b);
console.log('Myers diff result:', diff);

// Verification: reconstructing b from a + diff operations
const reconstructed = [];
diff.forEach((item) => {
  if (item.type !== 'removed') {
    reconstructed.push(item.value);
  }
});
if (reconstructed.join('') !== b.join('')) {
  throw new Error(`Myers diff reconstruction failed. Expected ${b.join('')}, got ${reconstructed.join('')}`);
}
console.log('✓ Myers Algorithm passed');

// 4. Token Collapsing
console.log('\n--- TEST 4: Collapse Consecutive Tokens ---');
const rawDiff = [
  { type: 'removed', value: '*' },
  { type: 'removed', value: '*' },
  { type: 'unchanged', value: 'Bold' },
  { type: 'removed', value: '*' },
  { type: 'removed', value: '*' },
];
const collapsed = collapseTokens(rawDiff);
if (collapsed.length !== 3 || collapsed[0].value !== '**' || collapsed[2].value !== '**') {
  throw new Error(`collapseTokens failed: ${JSON.stringify(collapsed)}`);
}
console.log('✓ Collapse Consecutive Tokens passed');

// 5. Compute Text Diff (Markdown stripping case)
console.log('\n--- TEST 5: Compute Text Diff ---');
const rawInput = '**Hello World** and `inline code`';
const cleanOutput = 'Hello World and inline code';
const textDiff = computeTextDiff(rawInput, cleanOutput);

console.log('Text Diff Stats:', textDiff.stats);
if (textDiff.stats.deletions === 0) {
  throw new Error('Text diff should detect deleted markdown asterisks and backticks');
}
const renderedTextHTML = renderTextDiffHTML(textDiff);
if (!renderedTextHTML.includes('line-through') || !renderedTextHTML.includes('bg-red-500/25')) {
  throw new Error('Rendered text HTML missing red strike-through styling');
}
console.log('✓ Compute Text Diff passed');

// 6. Compute Line Diff
console.log('\n--- TEST 6: Compute Line Diff ---');
const oldMultiline = `Line 1: Intro\nLine 2: Fluff to remove\nLine 3: Keep this\nLine 4: End`;
const newMultiline = `Line 1: Intro\nLine 3: Keep this\nLine 4: End\nLine 5: Added conclusion`;

const lineDiff = computeLineDiff(oldMultiline, newMultiline);
console.log('Line Diff Stats:', lineDiff.stats);

if (lineDiff.stats.deletions !== 1 || lineDiff.stats.additions !== 1) {
  throw new Error(`Line diff stats incorrect: deletions=${lineDiff.stats.deletions}, additions=${lineDiff.stats.additions}`);
}

const renderedLineHTML = renderLineDiffHTML(lineDiff);
if (!renderedLineHTML.includes('text-red-400') || !renderedLineHTML.includes('text-emerald-400')) {
  throw new Error('Rendered line HTML missing diff indicators');
}
console.log('✓ Compute Line Diff passed');

// 7. Identical Text (Zero changes)
console.log('\n--- TEST 7: Identical Content ---');
const sameText = 'Identical content with no changes.';
const sameTextDiff = computeTextDiff(sameText, sameText);
const sameLineDiff = computeLineDiff(sameText, sameText);

if (sameTextDiff.stats.totalChanges !== 0 || sameLineDiff.stats.totalChanges !== 0) {
  throw new Error('Identical text should have 0 totalChanges');
}

const sameTextHTML = renderTextDiffHTML(sameTextDiff, { noChanges: 'Identical' });
const sameLineHTML = renderLineDiffHTML(sameLineDiff, { noChanges: 'Identical' });

if (!sameTextHTML.includes('Identical') || !sameLineHTML.includes('Identical')) {
  throw new Error('Identical content should render noChanges message banner');
}
console.log('✓ Identical Content test passed');

// 8. Chinese Markdown Diffing
console.log('\n--- TEST 8: Chinese Markdown Diffing ---');
const zhRaw = '当然，请看以下内容：\n\n### 核心功能\n**DeMark** 可以快速过滤 AI 语气。';
const zhClean = '核心功能\nDeMark 可以快速过滤 AI 语气。';
const zhDiff = computeTextDiff(zhRaw, zhClean);

if (zhDiff.stats.deletions === 0) {
  throw new Error('Chinese diff failed to detect deletions');
}
const zhHTML = renderTextDiffHTML(zhDiff);
if (!zhHTML.includes('当然，请看以下内容：') || !zhHTML.includes('line-through')) {
  throw new Error('Chinese fluff deletion not highlighted in HTML');
}
console.log('✓ Chinese Markdown Diffing passed');

console.log('\n=== ALL DIFF TESTS PASSED! ===');
