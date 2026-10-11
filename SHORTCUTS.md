# Complete shortcut inventory — v0.3.0

All 201 active definitions from the pinned LaTeX Suite defaults are accounted for below. Rules 4 and 5 are intentionally disabled. “Adapted” means the Overleaf behavior described in README.md; it also includes consolidated display-math rules. Rows can share triggers or cover different contexts.

Outputs show initial text before filling fields; blank fields are empty, defaults are visible. `\n` denotes a newline. Use Tab to move between fields. Regex rules show a concrete example; Greek and symbol groups are listed below. Selection rules use `x+y`.

**GREEK:** `alpha`, `beta`, `gamma`, `Gamma`, `delta`, `Delta`, `epsilon`, `varepsilon`, `zeta`, `eta`, `theta`, `vartheta`, `Theta`, `iota`, `kappa`, `lambda`, `Lambda`, `mu`, `nu`, `xi`, `omicron`, `pi`, `rho`, `varrho`, `sigma`, `Sigma`, `tau`, `upsilon`, `Upsilon`, `phi`, `varphi`, `Phi`, `chi`, `psi`, `omega`, `Omega`, `Pi`, `Xi`, `Psi`.

**SYMBOL:** `parallel`, `perp`, `partial`, `nabla`, `hbar`, `ell`, `infty`, `oplus`, `ominus`, `otimes`, `oslash`, `square`, `star`, `dagger`, `vee`, `wedge`, `subseteq`, `subset`, `supseteq`, `supset`, `emptyset`, `exists`, `nexists`, `forall`, `implies`, `impliedby`, `iff`, `setminus`, `neg`, `lor`, `land`, `bigcup`, `bigcap`, `cdot`, `times`, `simeq`, `approx`.

**MORE_SYMBOLS:** `leq`, `geq`, `neq`, `gg`, `ll`, `equiv`, `sim`, `propto`, `rightarrow`, `leftarrow`, `Rightarrow`, `Leftarrow`, `leftrightarrow`, `to`, `top`, `mapsto`, `cap`, `cup`, `in`, `sum`, `prod`, `exp`, `ln`, `log`, `det`, `dots`, `vdots`, `ddots`, `pm`, `mp`, `int`, `iint`, `iiint`, `oint`.

**ACCENT:** `dot`, `ddot`, `hat`, `bar`, `tilde`, `vec`, `underline`, `overline`, `mathbf`, `mathcal`, `mathrm`, `mathbb`.

| Rule | Type / example | Activation | Context | Initial output | Status |
|---|---|---|---|---|---|
| 1 | `mk` | Auto | Text | `$$` | Adapted |
| 2 | `mk` | Auto | Text inside math | `\(\)` | Adapted |
| 3 | `dm` | Auto | Text | `\[\n\n\]` | Adapted |
| 4 | ` beg` | Auto | Display math | `Disabled` | Disabled |
| 5 | ` beg` | Auto | Inline math | `Disabled` | Disabled |
| 6 | `@a` | Auto | Math | `\alpha` | Imported |
| 7 | `@b` | Auto | Math | `\beta` | Imported |
| 8 | `@g` | Auto | Math | `\gamma` | Imported |
| 9 | `@G` | Auto | Math | `\Gamma` | Imported |
| 10 | `@d` | Auto | Math | `\delta` | Imported |
| 11 | `@D` | Auto | Math | `\Delta` | Imported |
| 12 | `@e` | Auto | Math | `\epsilon` | Imported |
| 13 | `:e` | Auto | Math | `\varepsilon` | Imported |
| 14 | `@z` | Auto | Math | `\zeta` | Imported |
| 15 | `@t` | Auto | Math | `\theta` | Imported |
| 16 | `@T` | Auto | Math | `\Theta` | Imported |
| 17 | `:t` | Auto | Math | `\vartheta` | Imported |
| 18 | `@i` | Auto | Math | `\iota` | Imported |
| 19 | `@k` | Auto | Math | `\kappa` | Imported |
| 20 | `@l` | Auto | Math | `\lambda` | Imported |
| 21 | `@L` | Auto | Math | `\Lambda` | Imported |
| 22 | `@s` | Auto | Math | `\sigma` | Imported |
| 23 | `@S` | Auto | Math | `\Sigma` | Imported |
| 24 | `@u` | Auto | Math | `\upsilon` | Imported |
| 25 | `@U` | Auto | Math | `\Upsilon` | Imported |
| 26 | `@o` | Auto | Math | `\omega` | Imported |
| 27 | `@O` | Auto | Math | `\Omega` | Imported |
| 28 | `ome` | Auto | Math | `\omega` | Imported |
| 29 | `Ome` | Auto | Math | `\Omega` | Imported |
| 30 | `\n  "` | Auto | Math | `\text{ } ` | Adapted |
| 31 | `text` | Auto | Math | `\text{}` | Imported |
| 32 | `"` | Auto | Math | `\text{}` | Imported |
| 33 | `sr` | Auto | Math | `^{2}` | Imported |
| 34 | `cb` | Auto | Math | `^{3}` | Imported |
| 35 | `rd` | Auto | Math | `^{}` | Imported |
| 36 | `_` | Auto | Math | `_{}` | Imported |
| 37 | `sts` | Auto | Math | `_\text{}` | Imported |
| 38 | `sq` | Auto | Math | `\sqrt{  }` | Imported |
| 39 | `3rt` | Auto | Math | `\sqrt[3]{  }` | Imported |
| 40 | `//` | Auto | Math | `\frac{}{}` | Imported |
| 41 | `ee` | Auto | Math | `e^{  }` | Imported |
| 42 | `invs` | Auto | Math | `^{-1}` | Imported |
| 43 | ` log` | Auto | Math | `\log` | Imported |
| 44 | `conj` | Auto | Math | `^{*}` | Imported |
| 45 | `Re` | Auto | Math | `\mathrm{Re}` | Imported |
| 46 | `Im` | Auto | Math | `\mathrm{Im}` | Imported |
| 47 | `bf` | Auto | Math | `\mathbf{}` | Imported |
| 48 | `rm` | Auto | Math | `\mathrm{}` | Imported |
| 49 | ` det` | Auto | Math | `\det` | Imported |
| 50 | `trace` | Auto | Math | `\mathrm{Tr}` | Imported |
| 51 | `xhat` | Auto | Math | `\hat{x}` | Imported |
| 52 | `xbar` | Auto | Math | `\bar{x}` | Imported |
| 53 | `xdot` | Auto | Math | `\dot{x}` | Imported |
| 54 | `xddot` | Auto | Math | `\ddot{x}` | Imported |
| 55 | `xtilde` | Auto | Math | `\tilde{x}` | Imported |
| 56 | `xund` | Auto | Math | `\underline{x}` | Imported |
| 57 | `xvec` | Auto | Math | `\vec{x}` | Imported |
| 58 | `x,.` | Auto | Math | `\mathbf{x}` | Imported |
| 59 | `x.,` | Auto | Math | `\mathbf{x}` | Imported |
| 60 | `\alpha,.` | Auto | Math | `\boldsymbol{\alpha}` | Imported |
| 61 | `\alpha.,` | Auto | Math | `\boldsymbol{\alpha}` | Imported |
| 62 | `hat` | Auto | Math | `\hat{}` | Imported |
| 63 | `bar` | Auto | Math | `\bar{}` | Imported |
| 64 | `dot` | Auto | Math | `\dot{}` | Imported |
| 65 | `ddot` | Auto | Math | `\ddot{}` | Imported |
| 66 | `cdot` | Auto | Math | `\cdot` | Imported |
| 67 | `tilde` | Auto | Math | `\tilde{}` | Imported |
| 68 | `und` | Auto | Math | `\underline{}` | Imported |
| 69 | `vec` | Auto | Math | `\vec{}` | Imported |
| 70 | `pmod` | Auto | Math | `\pmod{n}` | Imported |
| 71 | `x2` | Auto | Math | `x_{2}` | Imported |
| 72 | `x_{1}2` | Auto | Math | `_{12}` | Imported |
| 73 | `\hat{x}2` | Auto | Math | `\hat{x}_{2}` | Imported |
| 74 | `\hat{\bar{x}}2` | Auto | Math | `\hat{\bar{x}}_{2}` | Imported |
| 75 | `xnn` | Auto | Math | `x_{n}` | Imported |
| 76 | `\xii` | Auto | Math | `x_{i}` | Imported |
| 77 | `xjj` | Auto | Math | `x_{j}` | Imported |
| 78 | `xp1` | Auto | Math | `x_{n+1}` | Imported |
| 79 | `ynn` | Auto | Math | `y_{n}` | Imported |
| 80 | `yii` | Auto | Math | `y_{i}` | Imported |
| 81 | `yjj` | Auto | Math | `y_{j}` | Imported |
| 82 | `ooo` | Auto | Math | `\infty` | Imported |
| 83 | `sum` | Auto | Math | `\sum` | Imported |
| 84 | `prod` | Auto | Math | `\prod` | Imported |
| 85 | `\sum` | Tab | Math | `\sum_{i=1}^{N} ` | Imported |
| 86 | `\prod` | Tab | Math | `\prod_{i=1}^{N} ` | Imported |
| 87 | `lim` | Auto | Math | `\lim_{ n \to \infty } ` | Imported |
| 88 | `+-` | Auto | Math | `\pm` | Imported |
| 89 | `-+` | Auto | Math | `\mp` | Imported |
| 90 | `...` | Auto | Math | `\dots` | Imported |
| 91 | `nabl` | Auto | Math | `\nabla` | Imported |
| 92 | `xx` | Auto | Math | `\times` | Imported |
| 93 | `**` | Auto | Math | `\cdot` | Imported |
| 94 | `para` | Auto | Math | `\parallel` | Imported |
| 95 | `deg` | Auto | Math | `^{\circ}` | Adapted |
| 96 | `===` | Auto | Math | `\equiv` | Imported |
| 97 | `!=` | Auto | Math | `\neq` | Imported |
| 98 | `>=` | Auto | Math | `\geq` | Imported |
| 99 | `<=` | Auto | Math | `\leq` | Imported |
| 100 | `>>` | Auto | Math | `\gg` | Imported |
| 101 | `<<` | Auto | Math | `\ll` | Imported |
| 102 | `simm` | Auto | Math | `\sim` | Imported |
| 103 | `sim=` | Auto | Math | `\simeq` | Imported |
| 104 | `prop` | Auto | Math | `\propto` | Imported |
| 105 | `<->` | Auto | Math | `\leftrightarrow ` | Imported |
| 106 | `->` | Auto | Math | `\to` | Imported |
| 107 | `!>` | Auto | Math | `\mapsto` | Imported |
| 108 | `=>` | Auto | Math | `\implies` | Imported |
| 109 | `=<` | Auto | Math | `\impliedby` | Imported |
| 110 | `and` | Auto | Math | `\cap` | Imported |
| 111 | `orr` | Auto | Math | `\cup` | Imported |
| 112 | `inn` | Auto | Math | `\in` | Imported |
| 113 | `notin` | Auto | Math | `\not\in` | Imported |
| 114 | `\\\` | Auto | Math | `\setminus` | Imported |
| 115 | `sub=` | Auto | Math | `\subseteq` | Imported |
| 116 | `sup=` | Auto | Math | `\supseteq` | Imported |
| 117 | `eset` | Auto | Math | `\emptyset` | Imported |
| 118 | `set` | Auto | Math | `\{  \}` | Imported |
| 119 | `ne\xi sts` | Auto | Math | `\nexists` | Imported |
| 120 | `LL` | Auto | Math | `\mathcal{L}` | Imported |
| 121 | `HH` | Auto | Math | `\mathcal{H}` | Imported |
| 122 | `CC` | Auto | Math | `\mathbb{C}` | Imported |
| 123 | `RR` | Auto | Math | `\mathbb{R}` | Imported |
| 124 | `ZZ` | Auto | Math | `\mathbb{Z}` | Imported |
| 125 | `NN` | Auto | Math | `\mathbb{N}` | Imported |
| 126 | `QQ` | Auto | Math | `\mathbb{Q}` | Imported |
| 127 | ` alpha` | Auto | Math | `\alpha` | Imported |
| 128 | ` parallel` | Auto | Math | `\parallel` | Imported |
| 129 | `\alpha sr` | Auto | Math | `\alpha^{2}` | Imported |
| 130 | `\alpha cb` | Auto | Math | `\alpha^{3}` | Imported |
| 131 | `\alpha rd` | Auto | Math | `\alpha^{}` | Imported |
| 132 | `\alpha hat` | Auto | Math | `\hat{\alpha}` | Imported |
| 133 | `\alpha dot` | Auto | Math | `\dot{\alpha}` | Imported |
| 134 | `\alpha bar` | Auto | Math | `\bar{\alpha}` | Imported |
| 135 | `\alpha vec` | Auto | Math | `\vec{\alpha}` | Imported |
| 136 | `\alpha tilde` | Auto | Math | `\tilde{\alpha}` | Imported |
| 137 | `\alpha und` | Auto | Math | `\underline{\alpha}` | Imported |
| 138 | `par` | Tab | Math | `\frac{ \partial y }{ \partial x } ` | Imported |
| 139 | `par2` | Auto | Math | `\frac{ \partial^{2} y }{ \partial x^{2} } ` | Imported |
| 140 | `parn` | Auto | Math | `\frac{ \partial^{n} y }{ \partial x^{n} } ` | Adapted |
| 141 | `paxy` | Tab | Math | `\frac{ \partial x }{ \partial y } ` | Imported |
| 142 | `ddt` | Auto | Math | `\frac{d}{dt} ` | Imported |
| 143 | ` int` | Auto | Math | `\int` | Imported |
| 144 | `\int` | Tab | Math | `\int  \, dx ` | Imported |
| 145 | `dint` | Auto | Math | `\int_{0}^{1}  \, dx ` | Imported |
| 146 | `oint` | Auto | Math | `\oint` | Imported |
| 147 | `iint` | Auto | Math | `\iint` | Imported |
| 148 | `iiint` | Auto | Math | `\iiint` | Imported |
| 149 | `oinf` | Auto | Math | `\int_{0}^{\infty}  \, dx ` | Imported |
| 150 | `infi` | Auto | Math | `\int_{-\infty}^{\infty}  \, dx ` | Imported |
| 151 | ` sin` | Auto | Math | `\sin` | Imported |
| 152 | `arccsc` | Auto | Math | `\operatorname{arccsc}` | Imported |
| 153 | `U` | Selection | Math | `\underbrace{ x+y }_{  }` | Imported |
| 154 | `O` | Selection | Math | `\overbrace{ x+y }^{  }` | Imported |
| 155 | `B` | Selection | Math | `\underset{  }{ x+y }` | Imported |
| 156 | `C` | Selection | Math | `\cancel{ x+y }` | Imported |
| 157 | `K` | Selection | Math | `\cancelto{  }{ x+y }` | Imported |
| 158 | `S` | Selection | Math | `\sqrt{ x+y }` | Imported |
| 159 | `kbt` | Auto | Math | `k_{B}T` | Imported |
| 160 | `msun` | Auto | Math | `M_{\odot}` | Imported |
| 161 | `dag` | Auto | Math | `^{\dagger}` | Imported |
| 162 | `o+` | Auto | Math | `\oplus ` | Imported |
| 163 | `ox` | Auto | Math | `\otimes ` | Imported |
| 164 | `bra` | Auto | Math | `\bra{} ` | Imported |
| 165 | `ket` | Auto | Math | `\ket{} ` | Imported |
| 166 | `brk` | Auto | Math | `\braket{  &#124;  } ` | Imported |
| 167 | `outer` | Auto | Math | `\ket{\psi} \bra{\psi} ` | Imported |
| 168 | `pu` | Auto | Math | `\qty{1}{m}` | Adapted |
| 169 | `cee` | Auto | Math | `\ce{  }` | Imported |
| 170 | `he4` | Auto | Math | `{}^{4}_{2}He ` | Imported |
| 171 | `he3` | Auto | Math | `{}^{3}_{2}He ` | Imported |
| 172 | `iso` | Auto | Math | `{}^{4}_{2}He` | Imported |
| 173 | `pmat` | Auto | Display math | `\begin{pmatrix}\n  \n\end{pmatrix}` | Adapted |
| 174 | `array` | Auto | Display math | `\begin{array}{cc}\n  \n\end{array}` | Adapted |
| 175 | `bmat` | Auto | Inline math | `\begin{bmatrix}\end{bmatrix}` | Adapted |
| 176 | `matrix` | Auto | Inline math | `\begin{matrix}\end{matrix}` | Adapted |
| 177 | `align` | Auto | Display math | `\begin{aligned}\n  \n\end{aligned}` | Adapted |
| 178 | `align` | Auto | Inline math | `\begin{aligned}\end{aligned}` | Adapted |
| 179 | `avg` | Auto | Math | `\langle  \rangle ` | Imported |
| 180 | `norm` | Auto | Math | `\lvert  \rvert ` | Imported |
| 181 | `Norm` | Auto | Math | `\lVert  \rVert ` | Imported |
| 182 | `ceil` | Auto | Math | `\lceil  \rceil ` | Imported |
| 183 | `floor` | Auto | Math | `\lfloor  \rfloor ` | Imported |
| 184 | `mod` | Auto | Math | `&#124;&#124;` | Imported |
| 185 | `(` | Selection | Math | `(x+y)` | Imported |
| 186 | `[` | Selection | Math | `[x+y]` | Imported |
| 187 | `{` | Selection | Math | `{x+y}` | Imported |
| 188 | `(` | Auto | Math | `()` | Imported |
| 189 | `{` | Auto | Math | `{}` | Imported |
| 190 | `[` | Auto | Math | `[]` | Imported |
| 191 | `lr(` | Auto | Math | `\left(  \right) ` | Imported |
| 192 | `lr{` | Auto | Math | `\left\{  \right\} ` | Imported |
| 193 | `lr[` | Auto | Math | `\left[  \right] ` | Imported |
| 194 | `lr&#124;` | Auto | Math | `\left&#124;  \right&#124; ` | Imported |
| 195 | `lra` | Auto | Math | `\left<  \right> ` | Imported |
| 196 | `\alpha` | Auto | Math | `\alpha` | Adapted |
| 197 | `\alphax` | Auto | Math | `\alpha x` | Adapted |
| 198 | `tayl` | Auto | Math | `f(x + h) = f(x) + f'(x)h + f''(x) \frac{h^{2}}{2!} + \dots` | Imported |
| 199 | `iden3` | Auto | Math | `\begin{pmatrix}\n  1 & 0 & 0 \\\n  0 & 1 & 0 \\\n  0 & 0 & 1\n\end{pmatrix}` | Imported |
| 200 | `- note dm` | Auto | Text | `\[\n\n\]` | Adapted |
| 201 | `\n    dm` | Auto | Text | `\[\n    \n    \]` | Adapted |

Rules 196–197 are command-protection/spacing helpers rather than new text triggers. Rule 196 deliberately leaves a recognized command prefix unchanged. Rules 200–201 are handled by the general `dm` implementation. Standard-LaTeX omicron substitution applies throughout.

See README.md for matrix keyboard behavior, equation commands, preserved extra shortcuts, package requirements, and changes from v0.2.
