# Overleaf LaTeX Suite

**Type LaTeX faster in Overleaf using short, automatic snippets.** For example, type `@a` inside math to get `\alpha`, or type `(a+b)/` to create a fraction. Tab moves between the parts you need to fill in.

Overleaf LaTeX Suite is a browser userscript inspired by [Obsidian LaTeX Suite](https://github.com/artisticat1/obsidian-latex-suite) and [Gilles Castel's lecture-note workflow](https://castel.dev/post/lecture-notes-1/). It runs through Tampermonkey and works in Overleaf's Source editor, with optional Vim support. You do not need Obsidian, Vim, Node.js, or a local LaTeX installation to use it.

Current version: **0.3.0**. This is an independent project, not an official Overleaf or Obsidian extension.

## What is included?

- Automatic Greek letters, symbols, fractions, accents, subscripts, and calculus templates.
- Matrices with keyboard shortcuts for adding cells and rows.
- Physics and chemistry notation, plus shortcuts for wrapping selected math.
- Editable fields, nested snippets, and linked math placeholders.
- Display math that preserves the current line's indentation.

There are no preview effects, source concealment, bracket coloring, or live begin/end name matching. The [complete shortcut reference](SHORTCUTS.md) lists all imported rules and their Overleaf adaptations.

## Install for the first time

### 1. Install Tampermonkey

Install the browser extension from [Tampermonkey's official website](https://www.tampermonkey.net/), choosing your browser. Tampermonkey is the extension that runs the `.user.js` file.

For Chrome, open `chrome://extensions`, find **Tampermonkey → Details**, and enable **Allow User Scripts** if that setting is present. If it is unavailable, follow Tampermonkey's browser-specific instructions for enabling Developer Mode. Also allow Tampermonkey to run on Overleaf. See the [official permission guide](https://www.tampermonkey.net/faq.php#Q209) if the script does not start.

### 2. Add the userscript

1. Download and extract `overleaf-latex-suite.zip`.
2. Open `overleaf-latex-suite.user.js` in a plain-text or code editor and copy its **entire contents**, including the header starting with `// ==UserScript==`.
3. Click the Tampermonkey extension icon and choose **Create a new script** (or open its Dashboard and use the new-script button).
4. Select all of Tampermonkey's starter code and replace it with the copied script.
5. Save with **Ctrl+S** on Windows/Linux or **Cmd+S** on Mac. Check that the script is enabled in the Dashboard.

The code goes into Tampermonkey's editor. It does not go into your `.tex` file or Overleaf project uploads.

### 3. Open Overleaf

1. Open an editable project at `https://www.overleaf.com/project/...`.
2. Switch to the **Source** editor and reload the page.
3. Look for **Overleaf LaTeX Suite 0.3.0: ON** and the **Shortcuts** button.
4. If using Vim, enter insert mode before trying the examples below.

The included script matches the public `overleaf.com` project URLs. A university-hosted or self-hosted Overleaf instance is not enabled by default.

## Examples

Type these examples **one character at a time**. Pasting a trigger does not expand it.

### Inline math

On a blank line in the document body:

1. Type `mk`. It becomes `$…$` with the cursor between the dollar signs.
2. Type `@a`. It becomes `\alpha`.
3. Press `Tab` to leave the math.

The result is `$\alpha$`. The dots above only indicate the cursor position; they are not inserted.

### A fraction

On a new blank line:

1. Type `mk`.
2. Type `(a+b)/`. It becomes `\frac{a+b}{}` with the cursor in the denominator.
3. Type `c`, then press **Tab** to leave the fraction.
4. Press **Tab** again to leave inline math.

The result is `$\frac{a+b}{c}$`.

### Display math with matching indentation

On a new blank line, type four spaces and then `dm`. It inserts `\[` and `\]` on separate lines. The opening delimiter, expression line, and closing delimiter keep the same four-space indentation. Type `xsr` to get `x^{2}`, then press Tab to exit.

For a clean practice project, paste this ordinary LaTeX document into Overleaf, then type the examples on the blank line between `\begin{document}` and `\end{document}`:

```latex
\documentclass{article}
\usepackage{amsmath,amssymb}
\begin{document}

\end{document}
```

## Everyday shortcuts

| Type | What happens |
|---|---|
| `mk` / `dm` in text | Inline / display math |
| `@a`, `@b`, `@t`, `pi`, `epsilon`, `Psi` | Greek letters |
| `//`, `4ac/`, `(a+b)/` | Empty fraction or captured numerator |
| `sq`, `3rt` | Square root / cube root |
| `x12`, `xnn`, `xp1` | Numeric / named subscripts |
| `xhat`, `xbar`, `xvec`, `x,.` | Hat / bar / vector / bold |
| `sum` then **Tab** | Sum with editable index and bounds |
| `int` then **Tab**, `dint`, `infi` | Integral templates |
| `par` then **Tab**, `par2`, `parn` | Partial derivatives |
| `tayl` | Taylor expansion with linked function and variable fields |
| `pmat`, `bmat`, `cases`, `array`, `align` | Math environments |
| `iden3`, `23pmat` | Identity matrix / fixed 2×3 matrix |
| `norm`, `Norm`, `ceil`, `floor` | Absolute value / norm / ceiling / floor |
| `bra`, `ket`, `brk`, `outer` | Quantum notation |
| `cee`, `pu`, `iso` | Chemistry / quantity / isotope templates |

Most triggers expand automatically in math. Do not prepend a backslash to ordinary triggers. Explicitly typed commands are protected from unwanted expansion.

## Keys and fields

- **Tab / Shift+Tab:** next / previous field. Default values are selected for replacement. Nested snippets return to the enclosing snippet's fields.
- **Tab** after `sum`, `prod`, `int`, or `par`: expand the longer template.
- Inside a dynamic matrix: **Tab** adds `&`, **Enter** adds a row, **Shift+Enter** exits. Active nested snippet fields take precedence. Fixed-size matrices use their predefined fields.
- **Tab** also moves past a closing math bracket or delimiter when there are no active fields.
- Select math, then **U / O / B / C / K / S**: underbrace / overbrace / underset / cancel / cancel-to / square root. Typing `(`, `[`, or `{` wraps a selection.
- **Alt+/** (Option+/ on Mac): fraction around selected math.
- **Alt+Shift+B / Alt+Shift+S:** box / select the current equation. Your browser or OS may reserve a key combination.
- **Escape** clears active snippet fields and still reaches Vim.
- Repeated math fields update together while the snippet is active. This does not introduce begin/end name matching.

## Indentation

After four spaces, `dm` produces:

```latex
    \[
    
    \]
```

All three lines retain the same spaces or tabs, including inside a proof. The script preserves the current line's indentation; it does not infer missing indentation from the surrounding environment. `displayBodyIndent: ''` keeps the expression aligned. Other multiline environments add `environmentBodyIndent` (two spaces by default) to their body.

## Overleaf adaptations

- Markdown inline/display delimiters become TeX `$…$`, `\(…\)` inside text-in-math, and `\[…\]`.
- Markdown list/callout display rules use the ordinary indentation-preserving `dm` behavior.
- `deg` uses `^{\circ}`; `omicron` uses ordinary `o` because standard LaTeX has no `\omicron`.
- `pu` produces `\qty{1}{m}` with editable fields, using **siunitx** instead of MathJax's `\pu`.
- `array` includes an editable column specification; `align` inside math uses `aligned`.
- `parn` has a corrected final exit field. `Pi`, `Xi`, `Psi`, and compact Greek accents such as `\alphahat` are also supported.
- Automatic spacing applies to commands generated by the script by default. This protects manually typed custom macros. Set `smartMacroSpacing: 'all-known'` if preferred; add custom names to `customMacros`.

## Troubleshooting

| Problem | What to check |
|---|---|
| No button appears | Confirm Tampermonkey and the script are enabled, allow user scripts and site access, then reload the project. Confirm you are on an `overleaf.com/project/…` URL. |
| The button says `waiting` | The script loaded but has not connected to the Source editor. Switch to Source and reload. If it persists, Overleaf's editor integration may have changed. |
| The button says `OFF` | Click it to enable snippets. |
| Typing `@a` does nothing | Try it inside math created with `mk`. Most shortcuts do not run in ordinary prose. Type the characters instead of pasting them. In Vim, use insert mode. |
| `sum` only becomes `\sum` | Press Tab to open its editable index and bounds. |
| Expansion happens twice or keys behave oddly | Keep only one copy enabled. Temporarily disable other math/snippet userscripts to isolate a conflict. |
| The output appears, but LaTeX will not compile | Check the required packages below. A successful expansion does not automatically install LaTeX packages. |
| A shortcut conflicts with something you want to type | Click the ON/OFF button to pause snippets. Use the browser's normal undo command to reverse an unwanted expansion. |
| An Alt/Option shortcut does not work | The browser or operating system may already use that key combination. Test the ordinary text triggers first. |

If you ask someone for help, include your browser, script version, whether Vim is enabled, the exact characters you typed, and the expected versus actual result. A minimal example from a blank project is especially useful.

## Update an existing installation

1. Open **Tampermonkey → Dashboard** and edit your existing **Overleaf LaTeX Suite** script (older versions were called **Overleaf Fast Math**).
2. Copy any personal `CONFIG` or `CUSTOM_SNIPPETS` changes somewhere safe.
3. Replace the entire script with the new `overleaf-latex-suite.user.js`, restore any compatible personal settings, and save.
4. Reload Overleaf. Keep only one copy enabled.

This ZIP distribution does not configure automatic script updates.

## Pause or uninstall

Click the script's ON/OFF button to pause it in the current page. To disable it persistently or remove it, use the Tampermonkey Dashboard, then reload Overleaf. LaTeX text already inserted into your documents remains ordinary editable source.

## Share this with other people

Send the complete `overleaf-latex-suite.zip`. Ask recipients to extract it and begin with this README. Keep the userscript, `SHORTCUTS.md`, and `LICENSE-latex-suite.md` together so the instructions, reference, and upstream attribution travel with the code.

Each person installs the script in their own browser. Sharing an Overleaf project does not install it for collaborators; they can still read and edit the LaTeX it produces without installing the script.

## LaTeX packages

Add packages only for the notation you use:

```latex
\usepackage{amsmath,amssymb} % common math, environments, symbols
\usepackage{amsthm}         % proof environment
\usepackage{cancel}         % cancel / cancelto
\usepackage{braket}         % bra / ket / braket
\usepackage{siunitx}        % qty from the pu shortcut
\usepackage[version=4]{mhchem} % ce from the cee shortcut
```

## Custom snippets

Edit `CUSTOM_SNIPPETS` near the top of the script. For example:

```javascript
const CUSTOM_SNIPPETS = [
  {trigger:'rank', body:'\\operatorname{rank}(${1})${0}', mode:'math', auto:true},
];
```

Custom bodies use `${1}`, `${2}`, etc., `${1:default}` for a selected default, and `${0}` for the final exit. Upstream bodies use a different numbering convention; the imported rules are converted internally. Set `auto:false` to require Tab, or `projects:['YOUR_PROJECT_ID']` to scope a shortcut. Backslashes must be doubled in JavaScript strings.

## Changes from v0.2

Upstream meanings take precedence where shortcuts conflict:

| Trigger | v0.3 meaning |
|---|---|
| `sum`, `prod`, `int` | Bare command first; press Tab for a template |
| `dint` | Definite integral, default bounds 0 to 1; use `infi` for infinite bounds |
| `norm` / `Norm` | Absolute value / norm, respectively |
| `x,.` / `x.,` | Bold; use `xvec` for a vector accent |
| `bar` / `tilde` | `\bar` / `\tilde` |
| `pmat` / `bmat` | Dynamic empty matrix; Tab and Enter add cells and rows |
| `x12` | Subscript digits combine; the cursor stays after the subscript |

Use `@a`, `@b`, `@g`, `@t`, etc. in place of old abbreviated Greek aliases such as `alp` and `thet`. Those prefixes interfered with typing full Greek names. Use `cap`, `cup`, `subset`, or upstream alternatives instead of the old `nn`, `uu`, and `cc`. Nonconflicting extras remain: `ff`, `compl`, `td`, `iff`, `AA`, `EE`, `sse`, `~~`, `diff`, `fun`, `abs`, `txt`, `prob`.

Text-line extras expanded with Tab: `ali`, `eqn`, `proof`, `itemize`, `enum`. `today` inserts the local date.

## Verification and limits

`node test.cjs` runs 639 parser, indentation, context, and rule-coverage assertions. `tests/` contains a reproducible integration suite using actual CodeMirror and its Vim extension in JSDOM: 452 scenarios and 482 assertions pass with Vim on and off. These are simulated editor tests, not a signed-in live Overleaf browser test. Browser compatibility is not yet verified across every browser supported by Tampermonkey.

Automatic snippets apply to single-character typing with one cursor. Paste, composition, undo/redo, and multiple cursors do not trigger automatic expansion. Read-only states are respected. Context detection skips comments, verbatim, common labels/references, and text within math. It is a lexical scanner, not a full TeX parser; custom catcodes and arbitrary macro semantics are not interpreted. Overleaf's editor extension API is unstable and may change.

The script is self-contained, makes no network requests, and does not send or store document content. It ports the active default shortcut set and relevant typing helpers, not Obsidian's settings UI or arbitrary third-party snippet files.

## Attribution

The port accounts for 201 active upstream definitions, including two intentionally disabled begin/end rules. Some definitions share triggers or handle different contexts, so this is not 201 distinct shortcuts.

Default rules adapted from [artisticat1/obsidian-latex-suite](https://github.com/artisticat1/obsidian-latex-suite), pinned to commit `6095329e58c4ca159a494d16d21f72151eb512bb`. This project adapts its MIT license and in the userscript. Also inspired by [Gilles Castel's lecture-note workflow](https://castel.dev/post/lecture-notes-1/).
