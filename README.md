# DeMark ⚡

> **AST-Based AI Markdown Stripper for Cloudflare Pages**  
> Strip unwanted Markdown formatting, code fences, tables, emphasis, and AI conversational fluff from LLM-generated responses with zero latency and complete structural accuracy.

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20Functions-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/pages/)
[![Remark AST](https://img.shields.io/badge/Unified-Remark%20AST-1F2937?logo=markdown&logoColor=white)](https://github.com/remarkjs/remark)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Why DeMark?

AI models (ChatGPT, Claude, Gemini, DeepSeek, Copilot) frequently output responses loaded with Markdown formatting:
- `### Heading 3`
- `**bold**`, `*italic*`, `~~strikethrough~~`
- `> blockquotes`
- Complex markdown tables `| Col 1 | Col 2 |`
- Triple backtick code blocks ` ```lang ... ``` `
- Conversational filler: *"Certainly! Here is the breakdown..."* and *"Hope this helps! Let me know if you need anything else."*

When copying this text into corporate emails, Jira tickets, Slack, Word documents, Google Docs, Notion, or plaintext inputs, this formatting creates clutter and requires tedious manual cleanup.

### The AST Advantage (Unified & Remark)
Unlike regex-based search-and-replace tools that break on nested elements, multiline fences, or asterisks inside URLs, **DeMark uses an AST (Abstract Syntax Tree)** powered by `unified`, `remark-parse`, and `remark-gfm`:
- **Deterministic**: Understands the syntax tree hierarchy (no broken code fences or mangled inline symbols).
- **Isomorphic**: Runs client-side in the browser for **zero-latency instant feedback** AND in the Cloudflare V8 runtime via **Cloudflare Pages Functions**.
- **Configurable**: Fine-grained toggles for every Markdown element.

---

## 🚀 Live Features & Configurable Toggles

- **Split-View Workspace**: Real-time side-by-side editing (Input Markdown vs. Clean Output).
- **Output Modes**:
  - **Pure Plain Text**: Pristine, clean text ready for email or documents.
  - **Clean Markdown**: Selectively stripped Markdown preserving chosen structures.
- **Configurable Toggles**:
  - `stripHeadings`: Unwraps `#` to `######` headers into plain text.
  - `stripEmphasis`: Unwraps `**bold**`, `*italic*`, and `~~strikethrough~~`.
  - `stripInlineCode`: Strips backticks `` `x` `` to `x`.
  - `stripBlockquotes`: Unwraps `>` blockquotes into clean unquoted paragraphs.
  - `codeBlocks`:
    - `unwrap`: Strips ` ``` ` fences, keeping raw code lines.
    - `remove`: Drops code blocks entirely.
    - `preserve`: Keeps code fences intact.
  - `tables`:
    - `plain`: Formats tables into clean, aligned monospace plain text.
    - `tsv`: Converts tables to Tab-Separated Values (paste directly into Excel or Google Sheets).
    - `csv`: Converts tables to Comma-Separated Values.
    - `remove`: Drops tables entirely.
    - `preserve`: Keeps raw Markdown table syntax.
  - `links`:
    - `text_only`: `[Google](https://google.com)` → `Google`.
    - `text_and_url`: `Google (https://google.com)`.
    - `remove`: Drops link entirely.
    - `preserve`: Keeps `[text](url)`.
  - `stripLists`: Strips bullet (`- `, `* `) and numbered markers.
  - `stripThematicBreaks`: Strips `---` horizontal rules.
  - `cleanAIFluff`: Removes conversational intros (*"Certainly! Here is..."*) and outros (*"Hope this helps!"*).
  - `normalizeWhitespace`: Collapses redundant empty lines and trims line-endings.
- **Live Telemetry**: Real-time character counts, word counts, percentage reduction, and breakdown badges of stripped elements.
- **One-Click Actions**:
  - Copy to Clipboard (with visual confirmation).
  - Paste from Clipboard.
  - Export/Download as `.txt` or `.md`.
  - Drag-and-drop `.md` or `.txt` file support.
  - Quick Presets (*Max Strip*, *Default*, *Keep Code*).
  - Sample AI Texts (*Chatbot*, *Technical Code*, *Benchmarking Tables*, *Stress Test*).

---

## 📁 Project Structure

```
DeMark/
├── functions/
│   └── api/
│       └── demark.js             # Cloudflare Pages Function (Web Standard Fetch/Request/Response)
├── src/
│   ├── modules/
│   │   ├── demark.js             # Core AST Markdown stripping engine (Unified/Remark)
│   │   └── samples.js            # Preset AI response samples for testing
│   ├── main.js                   # Reactive UI controller, clipboard, telemetry, hotkeys
│   └── style.css                 # Tailwind CSS v4 setup and custom scrollbars
├── tests/
│   └── demark.test.js            # Automated unit tests for AST transformations
├── dist/                         # Production static assets for Cloudflare Pages Direct Upload
├── index.html                    # Responsive Split-View UI
├── package.json                  # Scripts & dependencies
├── vite.config.js                # Vite 6 configuration with @tailwindcss/vite
├── wrangler.toml                 # Cloudflare Pages deployment configuration
└── README.md
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v26)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Test Suite
```bash
npm test
```

### 4. Build Static Assets
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## ☁️ Cloudflare Pages Functions API

DeMark includes a serverless Cloudflare Pages Function located at `functions/api/demark.js`. It utilizes native Web Standard APIs (`Request`, `Response`, `fetch`) compatible with the Cloudflare V8 runtime.

### Endpoint: `POST /api/demark`

#### Request Headers:
```http
Content-Type: application/json
```

#### Request Body:
```json
{
  "markdown": "# Architecture Overview\nCertainly! Here is the breakdown: This is **bold** text.",
  "options": {
    "outputMode": "plain",
    "stripHeadings": true,
    "stripEmphasis": true,
    "cleanAIFluff": true
  }
}
```

#### Response Body:
```json
{
  "success": true,
  "result": "Architecture Overview\nThis is bold text.",
  "stats": {
    "inputLength": 88,
    "outputLength": 40,
    "charReduction": 48,
    "charReductionPercent": 54.5,
    "strippedCounts": {
      "headings": 1,
      "emphasis": 1,
      "fluff": 1
    }
  }
}
```

#### cURL Example:
```bash
curl -X POST https://demark.pages.dev/api/demark \
  -H "Content-Type: application/json" \
  -d '{
    "markdown": "Certainly! Here is your code:\n```js\nconsole.log(1);\n```\nHope this helps!",
    "options": { "outputMode": "plain", "cleanAIFluff": true, "codeBlocks": "unwrap" }
  }'
```

---

## 🚢 Cloudflare Pages Deployment Guide

### Option 1: Git Integration (Recommended)
1. Push this repository to **GitHub** or **GitLab**.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select the repository and configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Cloudflare will automatically build the static assets and deploy Pages Functions in `functions/`!

### Option 2: Direct Upload via Wrangler CLI
You can deploy directly from your local terminal using Wrangler:

```bash
# 1. Build the production bundle
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name demark
```

---

## ⚙️ `wrangler.toml` Reference

The included `wrangler.toml` file is pre-configured for Cloudflare Pages:

```toml
name = "demark"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
```

---

## 📜 License
MIT
