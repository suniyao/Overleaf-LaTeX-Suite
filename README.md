# Overleaf LaTeX Suite

Type LaTeX faster in Overleaf's **Source** editor. This userscript turns short triggers into math commands and templates: type `mk` in ordinary text to start inline math, then type `@a` to insert `\alpha`. It also makes fractions, matrices, calculus templates, and more. **Tab** moves through editable fields.

This is an independent project inspired by [Obsidian LaTeX Suite](https://github.com/artisticat1/obsidian-latex-suite) and [Gilles Castel's lecture-note workflow](https://castel.dev/post/lecture-notes-1/). This script is also published at [Greasy Fork](https://greasyfork.org/en/scripts/599779-overleaf-latex-suite).

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser. It is the extension that runs the userscript.
2. **If you are on Greasy Fork:** click **Install this script** on this page, then confirm in Tampermonkey. **If you are using the repository before the Greasy Fork listing is available:** open [`overleaf-latex-suite.user.js`](https://github.com/suniyao/Overleaf-LaTeX-Suite/blob/main/overleaf-latex-suite.user.js), click **Raw**, copy its entire contents, choose **Create a new script** in Tampermonkey, replace the starter code, and save.
3. Open an editable project at `https://www.overleaf.com/project/...`. Select the **Source** editor and reload the page. You should see **Overleaf LaTeX Suite 0.3.0: ON** and a **Shortcuts** button at the bottom right.

For Chrome, you may need to enable **Allow User Scripts** in **Extensions → Tampermonkey → Details**. Also give Tampermonkey access to Overleaf. See [Tampermonkey's permission guide](https://www.tampermonkey.net/faq.php#Q209) if the buttons do not appear.

The script runs on public `overleaf.com` project URLs. University-hosted and self-hosted Overleaf instances are not included by default. If you use Vim mode, enter insert mode before typing a trigger.

## Try it in one minute

Type each trigger **one character at a time** in the document body. Pasting a trigger does not expand it.

1. Type `mk` on an empty line. It inserts `$...$` with the cursor where the dots are shown; the dots are not inserted.
2. Type `@a`. It becomes `\alpha`.
3. Press **Tab** to leave the math. Your source now contains `$\alpha$`.

For a fraction, type `mk`, then `(a+b)/`, then `c`. The slash turns `(a+b)` into the numerator and places the cursor in the denominator. Press **Tab** to leave the fraction, then **Tab** again to leave math. The result is `$\frac{a+b}{c}$`.

If you want a clean practice project, paste this into Overleaf and type on the blank line inside the document:

```latex
\documentclass{article}
\usepackage{amsmath,amssymb}
\begin{document}

\end{document}
```

## Shortcuts to start with

**Auto** means the trigger expands as you finish typing it. **Tab** means you type the trigger and then press Tab. Most shortcuts below work only while the cursor is in math, such as between `$...$` or `\[...\]`. Type triggers without a leading backslash.

- **Start math:** `mk` in text creates inline `$...$`; `dm` on an empty text line creates display `\[...\]`.
- **Greek letters:** `@a`, `@b`, and `@t` become `\alpha`, `\beta`, and `\theta`. Full names such as `pi`, `epsilon`, and `Psi` also work.
- **Fractions:** `//` creates an empty numerator and denominator. `(a+b)/` puts `a+b` in the numerator.
- **Roots, accents, and subscripts:** `sq` makes a square root; `3rt` makes a cube root. Try `xhat`, `xvec`, or `x12`.
- **Calculus:** type `sum`, `int`, or `par`, then press **Tab** for an editable template.
- **Matrices:** `pmat` and `bmat` create editable matrices.
- **Chemistry and quantities:** `cee` and `pu` need the LaTeX packages listed below.

Use the on-page **Shortcuts** button for a quick reminder. The [complete shortcut guide](https://github.com/suniyao/Overleaf-LaTeX-Suite/blob/main/SHORTCUTS.md) lists every imported rule, plus the extra shortcuts.

## Keys and editable fields

- **Tab / Shift+Tab:** move to the next / previous field. A field with a default value is selected so you can type over it. After the last field, Tab exits the snippet.
- **Tab** after `sum`, `prod`, `int`, or `par`: expand the longer template.
- In a dynamic matrix, **Tab** adds a cell, **Enter** adds a row, and **Shift+Enter** exits. If a cell contains an active snippet, its fields take priority.
- With math selected, **Alt+/** (Option+/ on Mac) wraps it in a fraction. **U / O / B / C / K / S** wrap selected math with underbrace / overbrace / underset / cancel / cancel-to / square root. Typing `(`, `[`, or `{` also wraps selected math.
- **Alt+Shift+B / Alt+Shift+S:** box / select the current equation. A browser or operating system may reserve these keys.
- **Escape** clears active fields. In Vim mode, it still reaches Vim. Without an active field, **Tab** can move past a closing math delimiter.

## Where it works

Most automatic shortcuts work in math only. `mk` and `dm` work in ordinary text; `dm` preserves the current line's indentation. For example, after four spaces, `dm` produces:

```latex
    \[
    
    \]
```

The script does not add missing indentation based on the surrounding environment. Its defaults keep the display-math body aligned with the delimiters and indent other multiline environments by two additional spaces.

The script skips comments, verbatim text, common reference/label arguments, and text inside math. Automatic expansion expects one cursor and individual keystrokes; pasting, composition input, undo/redo, and multiple cursors do not trigger it. It does not add equation previews, bracket coloring, source concealment, or live matching of `\begin` and `\end` names.

## LaTeX packages for some shortcuts

Start with `amsmath,amssymb` for the math examples. Add only the packages needed for shortcuts you use:

```latex
\usepackage{amsmath,amssymb} % common math, environments, symbols
\usepackage{amsthm}          % proof environment
\usepackage{cancel}          % cancel / cancelto
\usepackage{braket}          % bra / ket / braket
\usepackage{siunitx}         % \qty from pu
\usepackage[version=4]{mhchem} % \ce from cee
```

An expansion can succeed even if the required package is missing; Overleaf will then report a LaTeX compile error.

## Troubleshooting

- **No buttons:** Check that Tampermonkey and this script are enabled, grant site access, open a public `overleaf.com/project/…` URL, select **Source**, and reload.
- **Status is `waiting`:** The script loaded but has not connected to the Source editor. Select **Source** and reload.
- **Status is `OFF`:** Click the status button to enable snippets.
- **`@a` does not expand:** Put the cursor inside math, type rather than paste, and use Vim insert mode if enabled.
- **`sum` becomes only `\sum`:** Press **Tab** to expand its index-and-bounds template.
- **A shortcut runs twice:** Keep only one copy of the script enabled. Try disabling other math or snippet userscripts.
- **The document stops compiling:** Check whether that shortcut needs a LaTeX package from the list above.
- **An Alt/Option key does nothing:** The browser or operating system may already use that shortcut. Try a text trigger first.

Click the **ON/OFF** button to pause snippets for the current page. To disable or remove the script, use Tampermonkey's Dashboard and reload Overleaf. Text already inserted into your document stays editable.

## Updates, sharing, and customization

If installed from Greasy Fork, use Tampermonkey's normal update mechanism. If you installed by pasting from the repository, replace the code in your existing Tampermonkey script when you update; that manual installation does not set up automatic updates. Before replacing a customized copy, save your changes to `CONFIG` and `CUSTOM_SNIPPETS`. Keep only one copy enabled.

Share the Greasy Fork listing or this repository with collaborators. Each person installs the script in their own browser; sharing an Overleaf project does not install it for them. They can still read and edit the LaTeX it produces without the script.

You can add personal rules in `CUSTOM_SNIPPETS` near the top of the userscript:

```javascript
const CUSTOM_SNIPPETS = [
  {trigger:'rank', body:'\\operatorname{rank}(${1})${0}', mode:'math', auto:true},
];
```

`${1}` is the first editable field; `${0}` is the final cursor position. Use `${1:default}` to prefill a field, `auto:false` to expand with Tab, or `projects:['YOUR_PROJECT_ID']` to restrict a rule to one Overleaf project. Double backslashes inside JavaScript strings. Editing the userscript can make it harder to apply future updates.


## Project and attribution

The userscript is self-contained and makes no network requests. It does not send or store document content. Its Overleaf editor integration may need changes if Overleaf changes its editor API. Automated tests cover parsing and simulated CodeMirror editing; browser behavior has not been verified across every Tampermonkey-supported browser.

This project adapts the default shortcuts from [artisticat1/obsidian-latex-suite](https://github.com/artisticat1/obsidian-latex-suite), pinned to commit `6095329e58c4ca159a494d16d21f72151eb512bb`. See the [MIT license](https://github.com/suniyao/Overleaf-LaTeX-Suite/blob/main/LICENSE) and the license notice in the userscript. It is also inspired by [Gilles Castel's lecture-note workflow](https://castel.dev/post/lecture-notes-1/).
