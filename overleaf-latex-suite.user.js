// ==UserScript==
// @name         Overleaf LaTeX Suite
// @namespace    local.overleaf.fast-math
// @version      0.3.0
// @description  Context-aware LaTeX snippets, smart fractions, accents and indented math.
// @match        https://www.overleaf.com/project/*
// @match        https://overleaf.com/project/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
MIT License

Copyright (c) 2022 artisticat1

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(() => {
  'use strict';
  const VERSION = '0.3.0';
  const CONFIG = {
    autoSubscripts: true,
    matrixShortcuts: true,
    tabout: true,
    smartMacroSpacing: "generated", // or "all-known" for stricter upstream behavior
    customMacros: [], // e.g. "\\mycommand"; protects commands defined in other files

    autoFractions: true,
    smartInlineSpace: true,
    // All display-math lines keep the trigger line's leading whitespace.
    // Set this to '  ' if you prefer two EXTRA spaces on the expression line.
    displayBodyIndent: '',
    environmentBodyIndent: '  ',
  };
  // Optional per-project snippets. Use a project ID from the Overleaf URL.
  // Templates accept ${1}, ${2:default}, ... and ${0} for the final cursor.
  // auto:false expands with Tab. Omit projects to enable in every project.
  const CUSTOM_SNIPPETS = [
    // {trigger:'ker', body:'\\ker(${1})${0}', mode:'math', auto:true, projects:['YOUR_PROJECT_ID']},
  ];
  const SNIPPETS = [
    ['mk', '$${1}$${0}', 'text'],
    ['dm', "\\[\n${1}\n\\]${0}", 'text'],
    ['ff', "\\frac{${1}}{${2}}${0}"], ['//', "\\frac{${1}}{${2}}${0}"],
    ['sq', "\\sqrt{${1}}${0}"], ['sr', '^{2}${0}'], ['cb', '^{3}${0}'],
    ['compl', '^{c}${0}'], ['invs', '^{-1}${0}'], ['td', '^{${1}}${0}'], ['__', '_{${1}}${0}'],
    ['ooo', "\\infty${0}"], ['->', "\\to ${0}"], ['=>', "\\implies ${0}"],
    ['!>', "\\mapsto ${0}"], ['iff', "\\iff ${0}"], ['AA', "\\forall ${0}"], ['EE', "\\exists ${0}"],
    ['!=', "\\neq ${0}"], ['<=', "\\leq ${0}"], ['>=', "\\geq ${0}"],
    ['xx', "\\times ${0}"], ['cdot', "\\cdot ${0}"], ['cc', "\\subset ${0}"],
    ['sse', "\\subseteq ${0}"], ['nn', "\\cap ${0}"], ['uu', "\\cup ${0}"],
    ['notin', "\\notin ${0}"], ['empty', "\\varnothing${0}"], ['~~', "\\sim ${0}"],
    ['hat', "\\hat{${1}}${0}"], ['bar', "\\overline{${1}}${0}"], ['vec', "\\vec{${1}}${0}"],
    ['dot', "\\dot{${1}}${0}"], ['tilde', "\\widetilde{${1}}${0}"],
    ['lim', "\\lim_{${1:n} \\to ${2:\\infty}} ${0}"],
    ['sum', "\\sum_{${1:n}=${2:1}}^{${3:\\infty}} ${0}"],
    ['prod', "\\prod_{${1:n}=${2:1}}^{${3:\\infty}} ${0}"],
    ['int', "\\int_{${1:a}}^{${2:b}} ${3} \\,d${4:x}${0}"],
    ['dint', "\\int_{-\\infty}^{\\infty} ${1} \\,d${2:x}${0}"],
    ['part', "\\frac{\\partial ${1:f}}{\\partial ${2:x}}${0}"],
    ['diff', "\\frac{d${1:f}}{d${2:x}}${0}"],
    ['fun', "${1:f}: ${2:\\mathbb{R}} \\to ${3:\\mathbb{R}},\\quad ${4:x}\\mapsto ${0}"],
    ['lr(', "\\left(${1}\\right)${0}"], ['lr[', "\\left[${1}\\right]${0}"],
    ['lr{', "\\left\\{${1}\\right\\}${0}"], ['abs', "\\left|${1}\\right|${0}"],
    ['norm', "\\left\\lVert ${1}\\right\\rVert${0}"],
    ['txt', "\\text{${1}}${0}"], ['expec', "\\mathbb{E}\\left[${1}\\right]${0}"],
    ['prob', "\\mathbb{P}\\left(${1}\\right)${0}"],
    ['alp', "\\alpha${0}"], ['bet', "\\beta${0}"], ['gam', "\\gamma${0}"],
    ['thet', "\\theta${0}"], ['eps', "\\varepsilon${0}"], ['del', "\\delta${0}"],
    ['lam', "\\lambda${0}"], ['sig', "\\sigma${0}"], ['ome', "\\omega${0}"],
    ['RR', "\\mathbb{R}${0}"], ['NN', "\\mathbb{N}${0}"], ['ZZ', "\\mathbb{Z}${0}"],
    ['QQ', "\\mathbb{Q}${0}"], ['CC', "\\mathbb{C}${0}"],
  ].map(([trigger,body,mode='math'])=>({trigger,body,mode,auto:true}));
  const MANUAL = [
    ['ali', "\\begin{align*}\n${1}\n\\end{align*}${0}"],
    ['eqn', "\\begin{equation}\n${1}\n\\end{equation}${0}"],
    ['itemize', "\\begin{itemize}\n\\item ${1}\n\\end{itemize}${0}"],
    ['enum', "\\begin{enumerate}\n\\item ${1}\n\\end{enumerate}${0}"],
    ['proof', "\\begin{proof}\n${1}\n\\end{proof}${0}"],
  ].map(([trigger,body])=>({trigger,body,mode:'text',auto:false,line:true}));
  const MATH_ENVS = new Set(['math','displaymath','equation','equation*','align','align*','aligned','alignedat','alignat','alignat*','gather','gather*','gathered','multline','multline*','flalign','flalign*','split','cases','array','Bmatrix','matrix','pmatrix','bmatrix','vmatrix','Vmatrix','smallmatrix']);
  const TEXT_COMMANDS = new Set(['text','textrm','textnormal','textbf','textit','mbox','hbox','operatorname']);
  const LITERAL_COMMANDS = new Set(['begin','end','label','ref','eqref','cite','url','include','input','includegraphics']);
  const GREEK = new Set('alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta iota kappa lambda mu nu xi pi varpi rho varrho sigma varsigma tau upsilon phi varphi chi psi omega Gamma Delta Theta Lambda Xi Pi Sigma Upsilon Phi Psi Omega'.split(' '));

  function scanContext(s) {
    const stack=[{kind:'root',mode:'text'}], regions=[];
    const top=()=>stack[stack.length-1];
    function finish(index,at,end){const f=stack[index];if(f.kind==='math'||f.equation)regions.push({...f,innerEnd:at,end});stack.length=index;}
    function close(kind,key,at,end){for(let j=stack.length-1;j>0;j--)if(stack[j].kind===kind&&(key===undefined||stack[j].key===key)){finish(j,at,end);return;}}
    function info(mode=top().mode){
      const equation=[...stack].reverse().find(f=>f.kind==='math'||f.equation);
      return {mode,stack,regions,equation,inline:equation?.key==='$'||equation?.key==='(',textMath:mode==='text'&&stack.some(f=>f.mode==='math'),macros:stack.filter(f=>f.macro).map(f=>f.macro)};
    }
    for(let i=0;i<s.length;){
      if(s[i]==='%'){const n=s.indexOf('\n',i);if(n<0)return info('comment');i=n+1;continue;}
      if(s[i]==='\\'){
        const env=/^\\(begin|end)\{([^}]*)\}/.exec(s.slice(i));
        if(env){
          if(env[1]==='begin'&&/^(verbatim\*?|lstlisting|minted|comment)$/.test(env[2])){const tag='\\end{'+env[2]+'}',end=s.indexOf(tag,i+env[0].length);if(end<0)return info('verbatim');i=end+tag.length;continue;}
          if(env[1]==='begin'){const math=MATH_ENVS.has(env[2]);stack.push({kind:'env',key:env[2],mode:math?'math':top().mode,start:i,inner:i+env[0].length,equation:math&&!stack.some(f=>f.mode==='math')});}
          else close('env',env[2],i,i+env[0].length);
          i+=env[0].length;continue;
        }
        const verb=/^\\verb\*?([^a-zA-Z\s])/.exec(s.slice(i));
        if(verb){const end=s.indexOf(verb[1],i+verb[0].length);if(end<0)return info('verbatim');i=end+1;continue;}
        const cmd=/^\\([a-zA-Z]+)\*?\s*\{/.exec(s.slice(i));
        if(cmd){const kind=TEXT_COMMANDS.has(cmd[1])?'text':LITERAL_COMMANDS.has(cmd[1])?'literal':'group';stack.push({kind,mode:kind==='group'?top().mode:kind,macro:cmd[1]});i+=cmd[0].length;continue;}
        const d=s[i+1];
        if(d==='('||d==='['){stack.push({kind:'math',key:d,mode:'math',start:i,inner:i+2});i+=2;continue;}
        if(d===')'||d===']'){close('math',d===')'?'(':'[',i,i+2);i+=2;continue;}
        const word=/^\\[a-zA-Z]+/.exec(s.slice(i));i+=word?word[0].length:2;continue;
      }
      if(s[i]==='{')stack.push({kind:'group',mode:top().mode});
      else if(s[i]==='}'){
        for(let j=stack.length-1;j>0;j--)if(['group','text','literal'].includes(stack[j].kind)){stack.length=j;break;}
      }else if(s[i]==='$'&&top().mode!=='literal'){
        const key=s[i+1]==='$'?'$$':'$';let j=stack.length-1;
        while(j>0&&!['math','text','literal'].includes(stack[j].kind))j--;
        if(stack[j].kind==='math'&&stack[j].key===key)finish(j,i,i+key.length);
        else stack.push({kind:'math',key,mode:'math',start:i,inner:i+key.length});
        i+=key.length;continue;
      }
      i++;
    }
    return info();
  }
  function context(s){return scanContext(s).mode;}
  function equationBounds(doc,pos){return scanContext(doc).regions.filter(r=>r.inner<=pos&&r.innerEnd>=pos).sort((a,b)=>(a.end-a.start)-(b.end-b.start))[0]||null;}

  // Parse numbered fields, including LaTeX braces inside default values.
  function template(body) {
    const tokens=[];let cursor=0;
    for(let i=0;i<body.length;i++) {
      if(body[i]!=='$'||body[i+1]!=='{')continue;
      const head=/^\$\{(\d+)(:|\})/.exec(body.slice(i));if(!head)continue;
      let end=i+head[0].length, value='';
      if(head[2]===':') {
        const start=end;let depth=1;
        while(end<body.length && depth){if(body[end]==='{')depth++;if(body[end]==='}')depth--;if(depth)end++;}
        if(depth)continue;value=body.slice(start,end);end++;
      }
      tokens.push({before:body.slice(cursor,i),n:Number(head[1]),value});cursor=end;i=end-1;
    }
    const defaults=new Map();for(const t of tokens)if(t.value && !defaults.has(t.n))defaults.set(t.n,t.value);
    const groups=new Map();let text='';
    for(const t of tokens){text+=t.before;const value=defaults.get(t.n)||'',range={from:text.length,to:text.length+value.length};text+=value;if(!groups.has(t.n))groups.set(t.n,[]);groups.get(t.n).push(range);}
    text+=body.slice(cursor);
    if(!groups.has(0))groups.set(0,[{from:text.length,to:text.length}]);
    return {text,groups:[...groups].map(([n,ranges])=>({n,ranges})).sort((a,b)=>(a.n||1e6)-(b.n||1e6))};
  }
  function literalResult(text, cursor=text.length) {return {text,groups:[{n:0,ranges:[{from:cursor,to:cursor}]}]};}
  const escaped=(s,i)=>{let n=0;while(i>0 && s[--i]==='\\')n++;return n%2===1;};
  function matchingOpen(s,end) {
    const pairs={')':'(',']':'[','}':'{'}, pending=[];
    for(let i=end-1;i>=0;i--){if(escaped(s,i))continue;const c=s[i];if(pairs[c])pending.push(pairs[c]);else if('([{'.includes(c)){if(pending.pop()!==c)return null;if(!pending.length)return i;}}
    return null;
  }
  const OP_COMMAND=/^\\(?:begin|end|to|mapsto|implies|iff|in|notin|subset|subseteq|supset|supseteq|cup|cap|times|cdot|pm|mp|leq|geq|neq|sim|approx|sum|prod|int|lim|left|right|text|quad|qquad)$/;
  function unitStart(s,end) {
    if(end<=0)return null;
    let start;
    if(')}]'.includes(s[end-1]) && !escaped(s,end-1)) {
      start=matchingOpen(s,end);if(start===null)return null;
      if(s[start]==='{') {
        let argStart=start;
        while(argStart>0 && s[argStart-1]==='}') {const p=matchingOpen(s,argStart);if(p===null)break;argStart=p;}
        const cmd=/\\[a-zA-Z]+\*?$/.exec(s.slice(0,argStart));
        if(cmd){if(OP_COMMAND.test(cmd[0]))return null;start=argStart-cmd[0].length;}
      } else if(s.slice(Math.max(0,start-5),start)==='\\left') start-=5;
    } else {
      const m=/(?:\\[a-zA-Z]+|[a-zA-Z]+|\d+(?:\.\d+)?)$/.exec(s.slice(0,end));
      if(!m||OP_COMMAND.test(m[0]))return null;start=end-m[0].length;
    }
    while(start>0 && /[_^]/.test(s[start-1])) {const base=unitStart(s,start-1);if(base===null)return null;start=base;}
    return start;
  }
  function atomStart(s,end) {
    let start=unitStart(s,end);if(start===null)return null;
    while(start>0){const prev=unitStart(s,start);if(prev===null||prev===start)break;start=prev;}
    return start;
  }
  function ungroup(s) {
    if(s[0]==='(' && matchingOpen(s,s.length)===0)return s.slice(1,-1);
    if(s.startsWith('\\left(')&&s.endsWith('\\right)'))return s.slice(6,-7);
    return s;
  }
  function indentation(prefix) {return /^[\t ]*/.exec(prefix.slice(prefix.lastIndexOf('\n')+1))[0];}
  function multiline(body,prefix,display=false) {
    const indent=indentation(prefix),lines=body.split('\n');
    if(lines.length===1)return body;
    return lines.map((line,i)=>i===0?line:indent+(i===lines.length-1?'':display?CONFIG.displayBodyIndent:CONFIG.environmentBodyIndent)+line).join('\n');
  }
  function matrixBody(rows,cols,env) {
    let n=1;const lines=[];for(let r=0;r<rows;r++){const cells=[];for(let c=0;c<cols;c++)cells.push('${'+n+++'}');lines.push(cells.join(' & '));}
    return '\\begin{'+env+'}\n'+lines.join(' \\\\\n')+'\n\\end{'+env+'}${0}';
  }
  function fractionResult(numerator) {
    const text='\\frac{'+numerator+'}{}',p=text.length-1;
    return {text,groups:[{n:1,ranges:[{from:p,to:p}]},{n:0,ranges:[{from:p+1,to:p+1}]}]};
  }
  // Default snippet definitions adapted from artisticat1/obsidian-latex-suite (MIT).
  // Pinned upstream commit: 6095329e58c4ca159a494d16d21f72151eb512bb
  const SUITE_VARIABLES = {"${GREEK}":"(?:alpha|beta|gamma|Gamma|delta|Delta|epsilon|varepsilon|zeta|eta|theta|vartheta|Theta|iota|kappa|lambda|Lambda|mu|nu|xi|omicron|pi|rho|varrho|sigma|Sigma|tau|upsilon|Upsilon|phi|varphi|Phi|chi|psi|omega|Omega)","${SYMBOL}":"(?:parallel|perp|partial|nabla|hbar|ell|infty|oplus|ominus|otimes|oslash|square|star|dagger|vee|wedge|subseteq|subset|supseteq|supset|emptyset|exists|nexists|forall|implies|impliedby|iff|setminus|neg|lor|land|bigcup|bigcap|cdot|times|simeq|approx)","${MORE_SYMBOLS}":"(?:leq|geq|neq|gg|ll|equiv|sim|propto|rightarrow|leftarrow|Rightarrow|Leftarrow|leftrightarrow|to|top|mapsto|cap|cup|in|sum|prod|exp|ln|log|det|dots|vdots|ddots|pm|mp|int|iint|iiint|oint)","${ACCENT}":"(?:dot|ddot|hat|bar|tilde|vec|underline|overline|mathbf|mathcal|mathrm|mathbb)"};
  const SUITE_MACROS = ["\\above","\\abovewithdelims","\\Aboxed","\\abs","\\absolutevalue","\\acomm","\\acos","\\acosecant","\\acosine","\\acot","\\acotangent","\\acsc","\\acute","\\adjustlimits","\\admat","\\aleph","\\alpha","\\alwaysDashedLine","\\alwaysNoLine","\\alwaysRootAtBottom","\\alwaysRootAtTop","\\alwaysSingleLine","\\alwaysSolidLine","\\amalg","\\And","\\angle","\\anticommutator","\\antidiagonalmatrix","\\approx","\\approxeq","\\arccos","\\arccosecant","\\arccosine","\\arccot","\\arccotangent","\\arccsc","\\arcsec","\\arcsecant","\\arcsin","\\arcsine","\\arctan","\\arctangent","\\arg","\\array","\\ArrowBetweenLines","\\arrowvert","\\Arrowvert","\\asec","\\asecant","\\asin","\\asine","\\ast","\\asymp","\\atan","\\atangent","\\atop","\\atopwithdelims","\\AXC","\\Axiom","\\AxiomC","\\backepsilon","\\backprime","\\backsim","\\backsimeq","\\backslash","\\bar","\\barwedge","\\Bbb","\\Bbbk","\\bbFont","\\bbox","\\bcancel","\\because","\\begin","\\beta","\\beth","\\between","\\bf","\\BIC","\\big","\\Big","\\bigcap","\\bigcirc","\\bigcup","\\bigg","\\Bigg","\\biggl","\\Biggl","\\biggm","\\Biggm","\\biggr","\\Biggr","\\bigl","\\Bigl","\\bigm","\\Bigm","\\bigodot","\\bigoplus","\\bigotimes","\\bigr","\\Bigr","\\bigsqcup","\\bigstar","\\bigtimes","\\bigtriangledown","\\bigtriangleup","\\biguplus","\\bigvee","\\bigwedge","\\BinaryInf","\\BinaryInfC","\\binom","\\blacklozenge","\\blacksquare","\\blacktriangle","\\blacktriangledown","\\blacktriangleleft","\\blacktriangleright","\\bmod","\\bmqty","\\boldsymbol","\\bot","\\bowtie","\\Box","\\boxdot","\\boxed","\\boxminus","\\boxplus","\\boxtimes","\\bqty","\\Bqty","\\bra","\\Bra","\\brace","\\bracevert","\\brack","\\braket","\\Braket","\\breve","\\buildrel","\\bullet","\\bumpeq","\\Bumpeq","\\cal","\\cancel","\\cancelto","\\cap","\\Cap","\\cases","\\cdot","\\cdotp","\\cdots","\\ce","\\cellcolor","\\celsius","\\centercolon","\\centerdot","\\centernot","\\centerOver","\\cfrac","\\check","\\checkmark","\\chi","\\choose","\\circ","\\circeq","\\circlearrowleft","\\circlearrowright","\\circledast","\\circledcirc","\\circleddash","\\circledR","\\circledS","\\clap","\\class","\\clubsuit","\\colon","\\colonapprox","\\Colonapprox","\\coloneq","\\Coloneq","\\coloneqq","\\Coloneqq","\\colonsim","\\Colonsim","\\color","\\colorbox","\\columncolor","\\comm","\\commutator","\\complement","\\cong","\\coprod","\\cos","\\cosecant","\\cosh","\\cosine","\\cot","\\cotangent","\\coth","\\cp","\\cr","\\cramped","\\crampedclap","\\crampedllap","\\crampedrlap","\\crampedsubstack","\\cross","\\crossproduct","\\csc","\\csch","\\cssId","\\cup","\\Cup","\\curl","\\curlyeqprec","\\curlyeqsucc","\\curlyvee","\\curlywedge","\\curvearrowleft","\\curvearrowright","\\dagger","\\daleth","\\dashedLine","\\dashleftarrow","\\dashrightarrow","\\dashv","\\dbinom","\\dblcolon","\\dd","\\ddagger","\\ddddot","\\dddot","\\ddot","\\ddots","\\DeclareMathOperator","\\DeclarePairedDelimiters","\\DeclarePairedDelimitersX","\\DeclarePairedDelimitersXPP","\\def","\\definecolor","\\deg","\\degree","\\delta","\\Delta","\\derivative","\\det","\\determinant","\\dfrac","\\diagdown","\\diagonalmatrix","\\diagup","\\diamond","\\Diamond","\\diamondsuit","\\diffd","\\differential","\\digamma","\\dim","\\displaylines","\\displaystyle","\\div","\\divergence","\\divideontimes","\\divsymbol","\\dmat","\\dot","\\doteq","\\Doteq","\\doteqdot","\\dotplus","\\dotproduct","\\dots","\\dotsb","\\dotsc","\\dotsi","\\dotsm","\\dotso","\\doublebarwedge","\\doublecap","\\doublecup","\\downarrow","\\Downarrow","\\downdownarrows","\\downharpoonleft","\\downharpoonright","\\dv","\\dyad","\\ell","\\empheqbigl","\\empheqbiglangle","\\empheqbiglbrace","\\empheqbiglbrack","\\empheqbiglceil","\\empheqbiglfloor","\\empheqbiglparen","\\empheqbiglvert","\\empheqbiglVert","\\empheqbigr","\\empheqbigrangle","\\empheqbigrbrace","\\empheqbigrbrack","\\empheqbigrceil","\\empheqbigrfloor","\\empheqbigrparen","\\empheqbigrvert","\\empheqbigrVert","\\empheql","\\empheqlangle","\\empheqlbrace","\\empheqlbrack","\\empheqlceil","\\empheqlfloor","\\empheqlparen","\\empheqlvert","\\empheqlVert","\\empheqr","\\empheqrangle","\\empheqrbrace","\\empheqrbrack","\\empheqrceil","\\empheqrfloor","\\empheqrparen","\\empheqrvert","\\empheqrVert","\\emptyset","\\enclose","\\end","\\enspace","\\epsilon","\\eqalign","\\eqalignno","\\eqcirc","\\eqcolon","\\Eqcolon","\\eqqcolon","\\Eqqcolon","\\eqref","\\eqsim","\\eqslantgtr","\\eqslantless","\\equiv","\\erf","\\eta","\\eth","\\ev","\\eval","\\evaluated","\\exists","\\exp","\\expectationvalue","\\exponential","\\expval","\\fallingdotseq","\\fbox","\\fCenter","\\fcolorbox","\\fderivative","\\fdv","\\Finv","\\flat","\\flatfrac","\\forall","\\frac","\\frak","\\framebox","\\frown","\\functionalderivative","\\Game","\\gamma","\\Gamma","\\gcd","\\ge","\\genfrac","\\geq","\\geqq","\\geqslant","\\gets","\\gg","\\ggg","\\gggtr","\\gimel","\\gnapprox","\\gneq","\\gneqq","\\gnsim","\\grad","\\gradient","\\gradientnabla","\\grave","\\gt","\\gtrapprox","\\gtrdot","\\gtreqless","\\gtreqqless","\\gtrless","\\gtrsim","\\gvertneqq","\\hat","\\hbar","\\hbox","\\hdashline","\\heartsuit","\\hfil","\\hfill","\\hfilll","\\hline","\\hom","\\hookleftarrow","\\hookrightarrow","\\hphantom","\\href","\\hskip","\\hslash","\\hspace","\\huge","\\Huge","\\hypcosecant","\\hypcosine","\\hypcotangent","\\hypsecant","\\hypsine","\\hyptangent","\\identitymatrix","\\idotsint","\\iff","\\iiiint","\\iiint","\\iint","\\Im","\\imaginary","\\imat","\\imath","\\impliedby","\\implies","\\in","\\inf","\\infty","\\injlim","\\innerproduct","\\int","\\intercal","\\intop","\\iota","\\ip","\\it","\\jmath","\\Join","\\kappa","\\ker","\\kern","\\ket","\\Ket","\\ketbra","\\Ketbra","\\label","\\lambda","\\Lambda","\\land","\\langle","\\laplacian","\\large","\\Large","\\LARGE","\\LaTeX","\\lbrace","\\lbrack","\\lceil","\\ldotp","\\ldots","\\le","\\leadsto","\\left","\\Leftarrow","\\leftarrow","\\leftarrowtail","\\leftharpoondown","\\leftharpoonup","\\LeftLabel","\\leftleftarrows","\\Leftrightarrow","\\leftrightarrow","\\leftrightarrows","\\leftrightharpoons","\\leftrightsquigarrow","\\leftroot","\\leftthreetimes","\\leq","\\leqalignno","\\leqq","\\leqslant","\\lessapprox","\\lessdot","\\lesseqgtr","\\lesseqqgtr","\\lessgtr","\\lesssim","\\let","\\lfloor","\\lg","\\lgroup","\\lhd","\\lim","\\liminf","\\limits","\\limsup","\\ll","\\LL","\\llap","\\llcorner","\\Lleftarrow","\\lll","\\llless","\\lmoustache","\\ln","\\lnapprox","\\lneq","\\lneqq","\\lnot","\\lnsim","\\log","\\logarithm","\\longleftarrow","\\Longleftarrow","\\Longleftrightarrow","\\longleftrightarrow","\\longleftrightarrows","\\longLeftrightharpoons","\\longmapsto","\\longrightarrow","\\Longrightarrow","\\longrightleftharpoons","\\longRightleftharpoons","\\looparrowleft","\\looparrowright","\\lor","\\lower","\\lozenge","\\lparen","\\lrcorner","\\Lsh","\\lt","\\ltimes","\\lvert","\\lVert","\\lvertneqq","\\maltese","\\mapsto","\\mathbb","\\mathbf","\\mathbfcal","\\mathbffrak","\\mathbfit","\\mathbfscr","\\mathbfsf","\\mathbfsfit","\\mathbfsfup","\\mathbfup","\\mathbin","\\mathcal","\\mathchoice","\\mathclap","\\mathclose","\\mathfrak","\\mathinner","\\mathit","\\mathllap","\\mathmakebox","\\mathmbox","\\mathnormal","\\mathop","\\mathopen","\\mathord","\\mathpunct","\\mathrel","\\mathring","\\mathrlap","\\mathrm","\\mathscr","\\mathsf","\\mathsfit","\\mathsfup","\\mathstrut","\\mathtip","\\mathtoolsset","\\mathtt","\\mathup","\\matrix","\\matrixdeterminant","\\matrixel","\\matrixelement","\\matrixquantity","\\max","\\mbox","\\mdet","\\measuredangle","\\mel","\\mho","\\micro","\\mid","\\middle","\\min","\\minCDarrowheight","\\minCDarrowwidth","\\mit","\\mkern","\\mmlToken","\\mod","\\models","\\MoveEqLeft","\\moveleft","\\moveright","\\mp","\\mqty","\\mskip","\\mspace","\\MTFlushSpaceAbove","\\MTFlushSpaceBelow","\\MTThinColon","\\mu","\\multimap","\\nabla","\\natural","\\naturallogarithm","\\ncong","\\ndownarrow","\\ne","\\nearrow","\\neg","\\negmedspace","\\negthickspace","\\negthinspace","\\neq","\\newcommand","\\newenvironment","\\Newextarrow","\\newline","\\newtagform","\\nexists","\\ngeq","\\ngeqq","\\ngeqslant","\\ngtr","\\ni","\\nleftarrow","\\nLeftarrow","\\nleftrightarrow","\\nLeftrightarrow","\\nleq","\\nleqq","\\nleqslant","\\nless","\\nmid","\\nobreakspace","\\nolimits","\\noLine","\\nonscript","\\nonumber","\\norm","\\normalsize","\\not","\\notag","\\notChar","\\notin","\\nparallel","\\nprec","\\npreceq","\\nrightarrow","\\nRightarrow","\\nshortmid","\\nshortparallel","\\nsim","\\nsubseteq","\\nsubseteqq","\\nsucc","\\nsucceq","\\nsupseteq","\\nsupseteqq","\\ntriangleleft","\\ntrianglelefteq","\\ntriangleright","\\ntrianglerighteq","\\nu","\\nuparrow","\\nvdash","\\nvDash","\\nVdash","\\nVDash","\\nwarrow","\\odot","\\ohm","\\oint","\\oldstyle","\\omega","\\Omega","\\omicron","\\ominus","\\op","\\operatorname","\\oplus","\\order","\\ordinarycolon","\\oslash","\\otimes","\\outerproduct","\\over","\\overbrace","\\overbracket","\\overleftarrow","\\overleftrightarrow","\\overline","\\overparen","\\overrightarrow","\\overset","\\overunderset","\\overwithdelims","\\owns","\\parallel","\\partial","\\partialderivative","\\paulimatrix","\\pb","\\pderivative","\\pdv","\\perp","\\perthousand","\\phantom","\\phi","\\Phi","\\pi","\\Pi","\\pitchfork","\\pm","\\pmat","\\pmatrix","\\pmb","\\pmod","\\pmqty","\\Pmqty","\\pod","\\poissonbracket","\\pqty","\\Pr","\\prec","\\precapprox","\\preccurlyeq","\\preceq","\\precnapprox","\\precneqq","\\precnsim","\\precsim","\\prescript","\\prime","\\principalvalue","\\Probability","\\prod","\\projlim","\\propto","\\psi","\\Psi","\\pu","\\pv","\\PV","\\qall","\\qand","\\qas","\\qassume","\\qc","\\qcc","\\qcomma","\\qelse","\\qeven","\\qfor","\\qgiven","\\qif","\\qin","\\qinteger","\\qlet","\\qodd","\\qor","\\qotherwise","\\qq","\\qqtext","\\qquad","\\qsince","\\qthen","\\qty","\\quad","\\quantity","\\QuaternaryInf","\\QuaternaryInfC","\\QuinaryInf","\\QuinaryInfC","\\qunless","\\qusing","\\raise","\\rangle","\\rank","\\rbrace","\\rbrack","\\rceil","\\Re","\\real","\\ref","\\refeq","\\renewcommand","\\renewenvironment","\\renewtagform","\\Res","\\Residue","\\restriction","\\rfloor","\\rgroup","\\rhd","\\rho","\\right","\\Rightarrow","\\rightarrow","\\rightarrowtail","\\rightharpoondown","\\rightharpoonup","\\RightLabel","\\rightleftarrows","\\rightleftharpoons","\\rightrightarrows","\\rightsquigarrow","\\rightthreetimes","\\risingdotseq","\\RL","\\rlap","\\rm","\\rmoustache","\\root","\\rootAtBottom","\\rootAtTop","\\rowcolor","\\rparen","\\Rrightarrow","\\Rsh","\\rtimes","\\rule","\\Rule","\\rvert","\\rVert","\\S","\\sbmqty","\\scr","\\scriptscriptstyle","\\scriptsize","\\scriptstyle","\\searrow","\\sec","\\secant","\\sech","\\set","\\Set","\\setminus","\\sf","\\sharp","\\shortmid","\\shortparallel","\\shortvdotswithin","\\shoveleft","\\shoveright","\\sideset","\\sigma","\\Sigma","\\sim","\\simeq","\\sin","\\sine","\\singleLine","\\sinh","\\skew","\\SkipLimits","\\small","\\smallfrown","\\smallint","\\smallmatrixquantity","\\smallsetminus","\\smallsmile","\\smash","\\smdet","\\smile","\\smqty","\\solidLine","\\Space","\\space","\\spadesuit","\\sphericalangle","\\splitdfrac","\\splitfrac","\\spmqty","\\sPmqty","\\sqcap","\\sqcup","\\sqrt","\\sqsubset","\\sqsubseteq","\\sqsupset","\\sqsupseteq","\\square","\\stackbin","\\stackrel","\\star","\\strut","\\style","\\subset","\\Subset","\\subseteq","\\subseteqq","\\subsetneq","\\subsetneqq","\\substack","\\succ","\\succapprox","\\succcurlyeq","\\succeq","\\succnapprox","\\succneqq","\\succnsim","\\succsim","\\sum","\\sup","\\supset","\\Supset","\\supseteq","\\supseteqq","\\supsetneq","\\supsetneqq","\\surd","\\svmqty","\\swarrow","\\symbb","\\symbf","\\symbfcal","\\symbffrak","\\symbfit","\\symbfscr","\\symbfsf","\\symbfsfit","\\symbfsfup","\\symbfup","\\symcal","\\symfrak","\\symit","\\symnormal","\\symrm","\\symscr","\\symsf","\\symsfit","\\symsfup","\\symtt","\\symup","\\tag","\\tan","\\tangent","\\tanh","\\tau","\\tbinom","\\TeX","\\text","\\textacutedbl","\\textasciiacute","\\textasciibreve","\\textasciicaron","\\textasciicircum","\\textasciidieresis","\\textasciimacron","\\textasciitilde","\\textasteriskcentered","\\textbackslash","\\textbaht","\\textbar","\\textbardbl","\\textbf","\\textbigcircle","\\textblank","\\textborn","\\textbraceleft","\\textbraceright","\\textbrokenbar","\\textbullet","\\textcelsius","\\textcent","\\textcentoldstyle","\\textcircledP","\\textclap","\\textcolonmonetary","\\textcolor","\\textcompwordmark","\\textcopyleft","\\textcopyright","\\textcurrency","\\textdagger","\\textdaggerdbl","\\textdegree","\\textdied","\\textdiscount","\\textdiv","\\textdivorced","\\textdollar","\\textdollaroldstyle","\\textdong","\\textdownarrow","\\texteightoldstyle","\\textellipsis","\\textemdash","\\textendash","\\textestimated","\\texteuro","\\textexclamdown","\\textfiveoldstyle","\\textflorin","\\textfouroldstyle","\\textfractionsolidus","\\textgravedbl","\\textgreater","\\textguarani","\\textinterrobang","\\textinterrobangdown","\\textit","\\textlangle","\\textlbrackdbl","\\textleftarrow","\\textless","\\textlira","\\textllap","\\textlnot","\\textlquill","\\textmarried","\\textmho","\\textminus","\\textmu","\\textmusicalnote","\\textnaira","\\textnineoldstyle","\\textnormal","\\textnumero","\\textohm","\\textonehalf","\\textoneoldstyle","\\textonequarter","\\textonesuperior","\\textopenbullet","\\textordfeminine","\\textordmasculine","\\textparagraph","\\textperiodcentered","\\textpertenthousand","\\textperthousand","\\textpeso","\\textpm","\\textquestiondown","\\textquotedblleft","\\textquotedblright","\\textquoteleft","\\textquoteright","\\textrangle","\\textrbrackdbl","\\textrecipe","\\textreferencemark","\\textregistered","\\textrightarrow","\\textrlap","\\textrm","\\textrquill","\\textsection","\\textservicemark","\\textsevenoldstyle","\\textsf","\\textsixoldstyle","\\textsterling","\\textstyle","\\textsurd","\\textthreeoldstyle","\\textthreequarters","\\textthreesuperior","\\texttildelow","\\texttimes","\\texttip","\\texttrademark","\\texttt","\\texttwooldstyle","\\texttwosuperior","\\textunderscore","\\textup","\\textuparrow","\\textvisiblespace","\\textwon","\\textyen","\\textzerooldstyle","\\tfrac","\\therefore","\\theta","\\Theta","\\thickapprox","\\thicksim","\\thinspace","\\TIC","\\tilde","\\times","\\tiny","\\Tiny","\\to","\\toggle","\\top","\\tr","\\Tr","\\trace","\\Trace","\\triangle","\\triangledown","\\triangleleft","\\trianglelefteq","\\triangleq","\\triangleright","\\trianglerighteq","\\TrinaryInf","\\TrinaryInfC","\\tripledash","\\tt","\\twoheadleftarrow","\\twoheadrightarrow","\\UIC","\\ulcorner","\\UnaryInf","\\UnaryInfC","\\underbrace","\\underbracket","\\underleftarrow","\\underleftrightarrow","\\underline","\\underparen","\\underrightarrow","\\underset","\\unicode","\\unlhd","\\unrhd","\\upalpha","\\uparrow","\\Uparrow","\\upbeta","\\upchi","\\updelta","\\Updelta","\\updownarrow","\\Updownarrow","\\upepsilon","\\upeta","\\upgamma","\\Upgamma","\\upharpoonleft","\\upharpoonright","\\upiota","\\upkappa","\\uplambda","\\Uplambda","\\uplus","\\upmu","\\upnu","\\upomega","\\Upomega","\\upomicron","\\upphi","\\Upphi","\\uppi","\\Uppi","\\uppsi","\\Uppsi","\\uprho","\\uproot","\\upsigma","\\Upsigma","\\upsilon","\\Upsilon","\\uptau","\\uptheta","\\Uptheta","\\upuparrows","\\upupsilon","\\Upupsilon","\\upvarepsilon","\\upvarphi","\\upvarpi","\\upvarrho","\\upvarsigma","\\upvartheta","\\upxi","\\Upxi","\\upzeta","\\urcorner","\\usetagform","\\va","\\var","\\varDelta","\\varepsilon","\\varGamma","\\variation","\\varinjlim","\\varkappa","\\varLambda","\\varliminf","\\varlimsup","\\varnothing","\\varOmega","\\varphi","\\varPhi","\\varpi","\\varPi","\\varprojlim","\\varpropto","\\varPsi","\\varrho","\\varsigma","\\varSigma","\\varsubsetneq","\\varsubsetneqq","\\varsupsetneq","\\varsupsetneqq","\\vartheta","\\varTheta","\\vartriangle","\\vartriangleleft","\\vartriangleright","\\varUpsilon","\\varXi","\\vb","\\vcenter","\\vdash","\\vDash","\\Vdash","\\vdot","\\vdots","\\vdotswithin","\\vec","\\vectorarrow","\\vectorbold","\\vectorunit","\\vee","\\veebar","\\verb","\\Vert","\\vert","\\vmqty","\\vnabla","\\vphantom","\\vqty","\\vu","\\Vvdash","\\wedge","\\widehat","\\widetilde","\\wp","\\wr","\\xcancel","\\xhookleftarrow","\\xhookrightarrow","\\xi","\\Xi","\\xleftarrow","\\xLeftarrow","\\xleftharpoondown","\\xleftharpoonup","\\xleftrightarrow","\\xLeftrightarrow","\\xleftrightharpoons","\\xLeftrightharpoons","\\xlongequal","\\xmapsto","\\xmat","\\xmathstrut","\\xmatrix","\\xrightarrow","\\xRightarrow","\\xrightharpoondown","\\xrightharpoonup","\\xrightleftharpoons","\\xRightleftharpoons","\\xtofrom","\\xtwoheadleftarrow","\\xtwoheadrightarrow","\\yen","\\zeromatrix","\\zeta","\\zmat"];
  const SUITE_API = {snippetVariables:SUITE_VARIABLES,ALL_MACROS:SUITE_MACROS};
  const SUITE_DEFAULTS = [
{"trigger":"mk","options":"tA","id":1,"regex":false,"replacement":"${}$0{}$"},
{"trigger":"mk","options":"TA","id":2,"regex":false,"replacement":"\\($0\\)"},
{"trigger":"dm","options":"tAw","description":"Display Math on empty line","id":3,"regex":false,"replacement":"\n$$\n$0\n$$"},
{"trigger":"([^\\\\\\w])beg","options":"MA","id":4,"regex":true,"replacement":"[[0]]\\begin{$0}\n$1\n\\end{$0}"},
{"trigger":"([^\\\\\\w])beg","options":"nA","id":5,"regex":true,"replacement":"[[0]]\\begin{$0} $1 \\end{$0}"},
{"trigger":"@a","options":"mA","id":6,"regex":false,"replacement":"\\alpha"},
{"trigger":"@b","options":"mA","id":7,"regex":false,"replacement":"\\beta"},
{"trigger":"@g","options":"mA","id":8,"regex":false,"replacement":"\\gamma"},
{"trigger":"@G","options":"mA","id":9,"regex":false,"replacement":"\\Gamma"},
{"trigger":"@d","options":"mA","id":10,"regex":false,"replacement":"\\delta"},
{"trigger":"@D","options":"mA","id":11,"regex":false,"replacement":"\\Delta"},
{"trigger":"@e","options":"mA","id":12,"regex":false,"replacement":"\\epsilon"},
{"trigger":":e","options":"mA","id":13,"regex":false,"replacement":"\\varepsilon"},
{"trigger":"@z","options":"mA","id":14,"regex":false,"replacement":"\\zeta"},
{"trigger":"@t","options":"mA","id":15,"regex":false,"replacement":"\\theta"},
{"trigger":"@T","options":"mA","id":16,"regex":false,"replacement":"\\Theta"},
{"trigger":":t","options":"mA","id":17,"regex":false,"replacement":"\\vartheta"},
{"trigger":"@i","options":"mA","id":18,"regex":false,"replacement":"\\iota"},
{"trigger":"@k","options":"mA","id":19,"regex":false,"replacement":"\\kappa"},
{"trigger":"@l","options":"mA","id":20,"regex":false,"replacement":"\\lambda"},
{"trigger":"@L","options":"mA","id":21,"regex":false,"replacement":"\\Lambda"},
{"trigger":"@s","options":"mA","id":22,"regex":false,"replacement":"\\sigma"},
{"trigger":"@S","options":"mA","id":23,"regex":false,"replacement":"\\Sigma"},
{"trigger":"@u","options":"mA","id":24,"regex":false,"replacement":"\\upsilon"},
{"trigger":"@U","options":"mA","id":25,"regex":false,"replacement":"\\Upsilon"},
{"trigger":"@o","options":"mA","id":26,"regex":false,"replacement":"\\omega"},
{"trigger":"@O","options":"mA","id":27,"regex":false,"replacement":"\\Omega"},
{"trigger":"ome","options":"mA","id":28,"regex":false,"replacement":"\\omega"},
{"trigger":"Ome","options":"mA","id":29,"regex":false,"replacement":"\\Omega"},
{"trigger":"\\n\\s*\\\"","options":"mrA","id":30,"regex":true,"replacement":"\n\\text{$0 } $1"},
{"trigger":"text","options":"mA","priority":-1,"id":31,"regex":false,"replacement":"\\text{$0}$1"},
{"trigger":"\"","options":"mA","priority":-1,"id":32,"regex":false,"replacement":"\\text{$0}$1"},
{"trigger":"sr","options":"mA","id":33,"regex":false,"replacement":"^{2}"},
{"trigger":"cb","options":"mA","id":34,"regex":false,"replacement":"^{3}"},
{"trigger":"rd","options":"mA","description":"Raise to (D)the power of","id":35,"regex":false,"replacement":"^{$0}$1"},
{"trigger":"_","options":"mA","id":36,"regex":false,"replacement":"_{$0}$1"},
{"trigger":"sts","options":"mA","id":37,"regex":false,"replacement":"_\\text{$0}"},
{"trigger":"sq","options":"mA","id":38,"regex":false,"replacement":"\\sqrt{ $0 }$1"},
{"trigger":"(\\d)rt","options":"mA","description":"Nth RooT","id":39,"regex":true,"replacement":"\\sqrt[[[0]]]{ $0 }$1"},
{"trigger":"//","options":"mA","id":40,"regex":false,"replacement":"\\frac{$0}{$1}$2"},
{"trigger":"\\bee","options":"mA","id":41,"regex":true,"replacement":"e^{ $0 }$1"},
{"trigger":"invs","options":"mA","id":42,"regex":false,"replacement":"^{-1}"},
{"trigger":"([^\\\\])(exp|log|ln)","options":"rmA","id":43,"regex":true,"replacement":"[[0]]\\[[1]]"},
{"trigger":"conj","options":"mA","id":44,"regex":false,"replacement":"^{*}"},
{"trigger":"Re","options":"mA","id":45,"regex":false,"replacement":"\\mathrm{Re}"},
{"trigger":"Im","options":"mA","id":46,"regex":false,"replacement":"\\mathrm{Im}"},
{"trigger":"bf","options":"mA","id":47,"regex":false,"replacement":"\\mathbf{$0}"},
{"trigger":"rm","options":"mA","id":48,"regex":false,"replacement":"\\mathrm{$0}$1"},
{"trigger":"([^\\\\])(det)","options":"rmA","id":49,"regex":true,"replacement":"[[0]]\\[[1]]"},
{"trigger":"trace","options":"mA","id":50,"regex":false,"replacement":"\\mathrm{Tr}"},
{"trigger":"([a-zA-Z])hat","options":"rmA","id":51,"regex":true,"replacement":"\\hat{[[0]]}"},
{"trigger":"([a-zA-Z])bar","options":"rmA","id":52,"regex":true,"replacement":"\\bar{[[0]]}"},
{"trigger":"([a-zA-Z])dot","options":"rmA","priority":-1,"id":53,"regex":true,"replacement":"\\dot{[[0]]}"},
{"trigger":"([a-zA-Z])ddot","options":"rmA","priority":1,"id":54,"regex":true,"replacement":"\\ddot{[[0]]}"},
{"trigger":"([a-zA-Z])tilde","options":"rmA","id":55,"regex":true,"replacement":"\\tilde{[[0]]}"},
{"trigger":"([a-zA-Z])und","options":"rmA","id":56,"regex":true,"replacement":"\\underline{[[0]]}"},
{"trigger":"([a-zA-Z])vec","options":"rmA","id":57,"regex":true,"replacement":"\\vec{[[0]]}"},
{"trigger":"([a-zA-Z]),\\.","options":"rmA","id":58,"regex":true,"replacement":"\\mathbf{[[0]]}"},
{"trigger":"([a-zA-Z])\\.,","options":"rmA","id":59,"regex":true,"replacement":"\\mathbf{[[0]]}"},
{"trigger":"\\\\(${GREEK}),\\.","options":"rmA","id":60,"regex":true,"replacement":"\\boldsymbol{\\[[0]]}"},
{"trigger":"\\\\(${GREEK})\\.,","options":"rmA","id":61,"regex":true,"replacement":"\\boldsymbol{\\[[0]]}"},
{"trigger":"hat","options":"mA","id":62,"regex":false,"replacement":"\\hat{$0}$1"},
{"trigger":"bar","options":"mA","id":63,"regex":false,"replacement":"\\bar{$0}$1"},
{"trigger":"dot","options":"mA","priority":-1,"id":64,"regex":false,"replacement":"\\dot{$0}$1"},
{"trigger":"ddot","options":"mA","id":65,"regex":false,"replacement":"\\ddot{$0}$1"},
{"trigger":"cdot","options":"mA","id":66,"regex":false,"replacement":"\\cdot"},
{"trigger":"tilde","options":"mA","id":67,"regex":false,"replacement":"\\tilde{$0}$1"},
{"trigger":"und","options":"mA","id":68,"regex":false,"replacement":"\\underline{$0}$1"},
{"trigger":"vec","options":"mA","id":69,"regex":false,"replacement":"\\vec{$0}$1"},
{"trigger":"pmod","options":"mA","description":"Parenthesized modulo (\\pmod{n})","id":70,"regex":false,"replacement":"\\pmod{${0:n}}$1"},
{"trigger":"(\\\\?)([A-Za-z]+)(\\d)","options":"rmA","priority":-1,"excludedMacros":["pu","ce"],"description":"Auto letter subscript for variables and greek letters, add space after other macros","id":71,"regex":true,"replacement":(match) => {
			const isMacro = match[1] === "\\";
			const digit = match[3];
			if (!isMacro) {
				const variable = match[2];
				return `${variable}_{${digit}}`;
			}
			const greek = SUITE_API.snippetVariables["${GREEK}"];
			const greek_pattern = new RegExp("^(?:" + greek + ")$");
			const macro_name = match[2];
			if (greek_pattern.test(macro_name)) {
				return `\\${macro_name}_{${digit}}`;
			} else {
				return `\\${macro_name} ${digit}`;
			}
		}},
{"trigger":"(\\\\${GREEK}|[A-Za-z])_{(\\d+)}(\\d)","options":"rmA","priority":-1,"description":"Combine subscripts for variables and greek letters","id":72,"regex":true,"replacement":"[[0]]_{[[1]][[2]]}"},
{"trigger":"\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}(?:_\\{(\\d+)\\})?(\\d)","options":"rmA","priority":-1,"id":73,"regex":true,"replacement":"\\[[0]]{[[1]]}_{[[2]][[3]]}"},
{"trigger":"\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}\\}(?:_\\{(\\d+)\\})?(\\d)","options":"rmA","priority":-1,"id":74,"regex":true,"replacement":"\\[[0]]{\\[[1]]{[[2]]}}_{[[3]][[4]]}"},
{"trigger":"xnn","options":"mA","id":75,"regex":false,"replacement":"x_{n}"},
{"trigger":"\\xii","options":"mA","priority":1,"id":76,"regex":false,"replacement":"x_{i}"},
{"trigger":"xjj","options":"mA","id":77,"regex":false,"replacement":"x_{j}"},
{"trigger":"xp1","options":"mA","id":78,"regex":false,"replacement":"x_{n+1}"},
{"trigger":"ynn","options":"mA","id":79,"regex":false,"replacement":"y_{n}"},
{"trigger":"yii","options":"mA","id":80,"regex":false,"replacement":"y_{i}"},
{"trigger":"yjj","options":"mA","id":81,"regex":false,"replacement":"y_{j}"},
{"trigger":"ooo","options":"mA","id":82,"regex":false,"replacement":"\\infty"},
{"trigger":"sum","options":"mA","id":83,"regex":false,"replacement":"\\sum"},
{"trigger":"prod","options":"mA","id":84,"regex":false,"replacement":"\\prod"},
{"trigger":"\\sum","options":"m","id":85,"regex":false,"replacement":"\\sum_{${0:i}=${1:1}}^{${2:N}} $3"},
{"trigger":"\\prod","options":"m","id":86,"regex":false,"replacement":"\\prod_{${0:i}=${1:1}}^{${2:N}} $3"},
{"trigger":"lim","options":"mA","id":87,"regex":false,"replacement":"\\lim_{ ${0:n} \\to ${1:\\infty} } $2"},
{"trigger":"+-","options":"mA","id":88,"regex":false,"replacement":"\\pm"},
{"trigger":"-+","options":"mA","id":89,"regex":false,"replacement":"\\mp"},
{"trigger":"...","options":"mA","id":90,"regex":false,"replacement":"\\dots"},
{"trigger":"nabl","options":"mA","id":91,"regex":false,"replacement":"\\nabla"},
{"trigger":"xx","options":"mA","id":92,"regex":false,"replacement":"\\times"},
{"trigger":"**","options":"mA","id":93,"regex":false,"replacement":"\\cdot"},
{"trigger":"para","options":"mA","id":94,"regex":false,"replacement":"\\parallel"},
{"trigger":"deg","options":"mA","id":95,"regex":false,"replacement":"\\degree"},
{"trigger":"===","options":"mA","id":96,"regex":false,"replacement":"\\equiv"},
{"trigger":"!=","options":"mA","id":97,"regex":false,"replacement":"\\neq"},
{"trigger":">=","options":"mA","id":98,"regex":false,"replacement":"\\geq"},
{"trigger":"<=","options":"mA","id":99,"regex":false,"replacement":"\\leq"},
{"trigger":">>","options":"mA","id":100,"regex":false,"replacement":"\\gg"},
{"trigger":"<<","options":"mA","id":101,"regex":false,"replacement":"\\ll"},
{"trigger":"simm","options":"mA","id":102,"regex":false,"replacement":"\\sim"},
{"trigger":"sim=","options":"mA","id":103,"regex":false,"replacement":"\\simeq"},
{"trigger":"prop","options":"mA","id":104,"regex":false,"replacement":"\\propto"},
{"trigger":"<->","options":"mA","id":105,"regex":false,"replacement":"\\leftrightarrow "},
{"trigger":"->","options":"mA","excludedMacros":["ce"],"id":106,"regex":false,"replacement":"\\to"},
{"trigger":"!>","options":"mA","id":107,"regex":false,"replacement":"\\mapsto"},
{"trigger":"=>","options":"mA","id":108,"regex":false,"replacement":"\\implies"},
{"trigger":"=<","options":"mA","id":109,"regex":false,"replacement":"\\impliedby"},
{"trigger":"and","options":"wmA","id":110,"regex":false,"replacement":"\\cap"},
{"trigger":"orr","options":"mA","id":111,"regex":false,"replacement":"\\cup"},
{"trigger":"inn","options":"mA","id":112,"regex":false,"replacement":"\\in"},
{"trigger":"notin","options":"mA","id":113,"regex":false,"replacement":"\\not\\in"},
{"trigger":"\\\\\\","options":"mA","id":114,"regex":false,"replacement":"\\setminus"},
{"trigger":"sub=","options":"mA","id":115,"regex":false,"replacement":"\\subseteq"},
{"trigger":"sup=","options":"mA","id":116,"regex":false,"replacement":"\\supseteq"},
{"trigger":"eset","options":"mA","id":117,"regex":false,"replacement":"\\emptyset"},
{"trigger":"set","options":"wmA","id":118,"regex":false,"replacement":"\\{ $0 \\}$1"},
{"trigger":"(n?)e\\\\xi sts","options":"mA","priority":1,"id":119,"regex":true,"replacement":"\\[[0]]exists"},
{"trigger":"LL","options":"mA","id":120,"regex":false,"replacement":"\\mathcal{L}"},
{"trigger":"HH","options":"mA","id":121,"regex":false,"replacement":"\\mathcal{H}"},
{"trigger":"CC","options":"mA","id":122,"regex":false,"replacement":"\\mathbb{C}"},
{"trigger":"RR","options":"mA","id":123,"regex":false,"replacement":"\\mathbb{R}"},
{"trigger":"ZZ","options":"mA","id":124,"regex":false,"replacement":"\\mathbb{Z}"},
{"trigger":"NN","options":"mA","id":125,"regex":false,"replacement":"\\mathbb{N}"},
{"trigger":"QQ","options":"mA","id":126,"regex":false,"replacement":"\\mathbb{Q}"},
{"trigger":"([^\\\\])(${GREEK})","options":"rmA","description":"Add backslash before Greek letters","id":127,"regex":true,"replacement":"[[0]]\\[[1]]"},
{"trigger":"([^\\\\])(${SYMBOL})","options":"rmA","description":"Add backslash before symbols","id":128,"regex":true,"replacement":"[[0]]\\[[1]]"},
{"trigger":"\\\\(${GREEK}|${SYMBOL}) sr","options":"rmA","id":129,"regex":true,"replacement":"\\[[0]]^{2}"},
{"trigger":"\\\\(${GREEK}|${SYMBOL}) cb","options":"rmA","id":130,"regex":true,"replacement":"\\[[0]]^{3}"},
{"trigger":"\\\\(${GREEK}|${SYMBOL}) rd","options":"rmA","id":131,"regex":true,"replacement":"\\[[0]]^{$0}$1"},
{"trigger":"\\\\(${GREEK}) hat","options":"rmA","id":132,"regex":true,"replacement":"\\hat{\\[[0]]}"},
{"trigger":"\\\\(${GREEK}) dot","options":"rmA","id":133,"regex":true,"replacement":"\\dot{\\[[0]]}"},
{"trigger":"\\\\(${GREEK}) bar","options":"rmA","id":134,"regex":true,"replacement":"\\bar{\\[[0]]}"},
{"trigger":"\\\\(${GREEK}) vec","options":"rmA","id":135,"regex":true,"replacement":"\\vec{\\[[0]]}"},
{"trigger":"\\\\(${GREEK}) tilde","options":"rmA","id":136,"regex":true,"replacement":"\\tilde{\\[[0]]}"},
{"trigger":"\\\\(${GREEK}) und","options":"rmA","id":137,"regex":true,"replacement":"\\underline{\\[[0]]}"},
{"trigger":"par","options":"m","id":138,"regex":false,"replacement":"\\frac{ \\partial ${0:y} }{ \\partial ${1:x} } $2"},
{"trigger":"par([0-9])","options":"mA","id":139,"regex":true,"replacement":"\\frac{ \\partial^{[[0]]} ${0:y} }{ \\partial ${1:x}^{[[0]]} } $2"},
{"trigger":"parn","options":"mA","id":140,"regex":true,"replacement":"\\frac{ \\partial^{${0:n}} ${1:y} }{ \\partial ${2:x}^{${0:n}} } $2"},
{"trigger":"pa([A-Za-z])([A-Za-z])","options":"rm","id":141,"regex":true,"replacement":"\\frac{ \\partial [[0]] }{ \\partial [[1]] } "},
{"trigger":"ddt","options":"mA","id":142,"regex":false,"replacement":"\\frac{d}{dt} "},
{"trigger":"([^\\\\])int","options":"mA","priority":-1,"id":143,"regex":true,"replacement":"[[0]]\\int"},
{"trigger":"\\int","options":"m","id":144,"regex":false,"replacement":"\\int $0 \\, d${1:x} $2"},
{"trigger":"dint","options":"mA","description":"Definite integral","id":145,"regex":false,"replacement":"\\int_{${0:0}}^{${1:1}} $2 \\, d${3:x} $4"},
{"trigger":"oint","options":"mA","id":146,"regex":false,"replacement":"\\oint"},
{"trigger":"iint","options":"mA","id":147,"regex":false,"replacement":"\\iint"},
{"trigger":"iiint","options":"mA","id":148,"regex":false,"replacement":"\\iiint"},
{"trigger":"oinf","options":"mA","id":149,"regex":false,"replacement":"\\int_{0}^{\\infty} $0 \\, d${1:x} $2"},
{"trigger":"infi","options":"mA","id":150,"regex":false,"replacement":"\\int_{-\\infty}^{\\infty} $0 \\, d${1:x} $2"},
{"trigger":"([^\\\\])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)","options":"rmA","description":"Add backslash before trig funcs","id":151,"regex":true,"replacement":"[[0]]\\[[1]]"},
{"trigger":"(arccsc|arcsec|arccot)","options":"mA","description":"Inverse trig functions, Are not built-in MathJax functions","priority":1,"id":152,"regex":true,"replacement":"\\operatorname{[[0]]}$0"},
{"trigger":"U","options":"mv","id":153,"regex":false,"replacement":"\\underbrace{ ${VISUAL} }_{ $0 }"},
{"trigger":"O","options":"mv","id":154,"regex":false,"replacement":"\\overbrace{ ${VISUAL} }^{ $0 }"},
{"trigger":"B","options":"mv","id":155,"regex":false,"replacement":"\\underset{ $0 }{ ${VISUAL} }"},
{"trigger":"C","options":"mv","id":156,"regex":false,"replacement":"\\cancel{ ${VISUAL} }"},
{"trigger":"K","options":"mv","id":157,"regex":false,"replacement":"\\cancelto{ $0 }{ ${VISUAL} }"},
{"trigger":"S","options":"mv","id":158,"regex":false,"replacement":"\\sqrt{ ${VISUAL} }"},
{"trigger":"kbt","options":"mA","id":159,"regex":false,"replacement":"k_{B}T"},
{"trigger":"msun","options":"mA","id":160,"regex":false,"replacement":"M_{\\odot}"},
{"trigger":"dag","options":"mA","id":161,"regex":false,"replacement":"^{\\dagger}"},
{"trigger":"o+","options":"mA","id":162,"regex":false,"replacement":"\\oplus "},
{"trigger":"ox","options":"wmA","id":163,"regex":false,"replacement":"\\otimes "},
{"trigger":"bra","options":"mA","id":164,"regex":false,"replacement":"\\bra{$0} $1"},
{"trigger":"ket","options":"mA","id":165,"regex":false,"replacement":"\\ket{$0} $1"},
{"trigger":"brk","options":"mA","id":166,"regex":false,"replacement":"\\braket{ $0 | $1 } $2"},
{"trigger":"outer","options":"mA","id":167,"regex":false,"replacement":"\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1"},
{"trigger":"pu","options":"mA","id":168,"regex":false,"replacement":"\\pu{ $0 }"},
{"trigger":"cee","options":"mA","id":169,"regex":false,"replacement":"\\ce{ $0 }"},
{"trigger":"he4","options":"mA","id":170,"regex":false,"replacement":"{}^{4}_{2}He "},
{"trigger":"he3","options":"mA","id":171,"regex":false,"replacement":"{}^{3}_{2}He "},
{"trigger":"iso","options":"mA","id":172,"regex":false,"replacement":"{}^{${0:4}}_{${1:2}}${2:He}"},
{"trigger":"([pbBvV]mat)","options":"rMA","description":"Matrix environments with new lines","id":173,"regex":true,"replacement":"\\begin{[[0]]rix}\n$0\n\\end{[[0]]rix}"},
{"trigger":"(matrix|cases|array)","options":"rMA","description":"Miscellaneous environments with new lines","id":174,"regex":true,"replacement":"\\begin{[[0]]}\n$0\n\\end{[[0]]}"},
{"trigger":"([pbBvV]mat)","options":"rnA","id":175,"regex":true,"replacement":"\\begin{[[0]]rix}$0\\end{[[0]]rix}"},
{"trigger":"(matrix|cases|align|array)","options":"rnA","id":176,"regex":true,"replacement":"\\begin{[[0]]}$0\\end{[[0]]}"},
{"trigger":"align","options":"rMA","id":177,"regex":true,"replacement":"\\begin{aligned}\n$0\n\\end{aligned}"},
{"trigger":"align","options":"nA","id":178,"regex":false,"replacement":"\\begin{aligned}$0\\end{aligned}"},
{"trigger":"avg","options":"mA","id":179,"regex":false,"replacement":"\\langle $0 \\rangle $1"},
{"trigger":"norm","options":"mA","priority":1,"id":180,"regex":false,"replacement":"\\lvert $0 \\rvert $1"},
{"trigger":"Norm","options":"mA","priority":1,"id":181,"regex":false,"replacement":"\\lVert $0 \\rVert $1"},
{"trigger":"ceil","options":"mA","id":182,"regex":false,"replacement":"\\lceil $0 \\rceil $1"},
{"trigger":"floor","options":"mA","id":183,"regex":false,"replacement":"\\lfloor $0 \\rfloor $1"},
{"trigger":"mod","options":"mA","id":184,"regex":false,"replacement":"|$0|$1"},
{"trigger":"(","options":"mv","id":185,"regex":false,"replacement":"(${VISUAL})"},
{"trigger":"[","options":"mv","id":186,"regex":false,"replacement":"[${VISUAL}]"},
{"trigger":"{","options":"mv","id":187,"regex":false,"replacement":"{${VISUAL}}"},
{"trigger":"(","options":"mA","id":188,"regex":false,"replacement":"($0)$1"},
{"trigger":"{","options":"mA","id":189,"regex":false,"replacement":"{$0}$1"},
{"trigger":"[","options":"mA","id":190,"regex":false,"replacement":"[$0]$1"},
{"trigger":"lr(","options":"mA","id":191,"regex":false,"replacement":"\\left( $0 \\right) $1"},
{"trigger":"lr{","options":"mA","id":192,"regex":false,"replacement":"\\left\\{ $0 \\right\\} $1"},
{"trigger":"lr[","options":"mA","id":193,"regex":false,"replacement":"\\left[ $0 \\right] $1"},
{"trigger":"lr|","options":"mA","id":194,"regex":false,"replacement":"\\left| $0 \\right| $1"},
{"trigger":"lra","options":"mA","id":195,"regex":false,"replacement":"\\left< $0 \\right> $1"},
{"trigger":"\\\\[A-Za-z]{2,}","options":"mAU","priority":3,"description":"Disable snippets while typing macros","id":196,"regex":true,"replacement":function (match) {
			/** @type {string} */
			const string = match[0];
			const trigger = string.slice(1);
			
			const names = SUITE_API.ALL_MACROS;
			if (names.some(name => name.startsWith(string))) {
				return string;
			}
			return false;
		}},
{"trigger":"\\\\[A-Za-z]{2,}","options":"mA","priority":3,"description":"Insert space after macros if not part of another macro","id":197,"regex":true,"replacement":function (match) {
			/** @type {string} */
			const string = match[0];
			const trigger = string.slice(1);
			
			const names = SUITE_API.ALL_MACROS;
			if (!names.some(name => name.startsWith(string))) {
				const macro = trigger.slice(0, -1);
				const letter = trigger.slice(-1);
				return "\\" + macro + " " + letter;
			}
			return false;
		}},
{"trigger":"tayl","options":"mA","description":"Taylor expansion","id":198,"regex":false,"replacement":"${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3"},
{"trigger":"iden(\\d)","options":"mA","description":"N x N identity matrix","id":199,"regex":true,"replacement":(match) => {
		const n = match[1];

		let arr = [];
		for (let j = 0; j < n; j++) {
			arr[j] = [];
			for (let i = 0; i < n; i++) {
				arr[j][i] = (i === j) ? 1 : 0;
			}
		}

		let output = arr.map(el => el.join(" & ")).join(" \\\\\n");
		output = `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`;
		return output;
	}},
{"trigger":"(?<positive_lookbehind>(?:\\n|^)[ \\t]*>*)(?<marker>\\d+[.)]|[-*+])(?<whitespace>[ \\t]+)(?<text>.*)dm","options":"rtA","priority":2,"description":"Display math when in a list","id":200,"regex":true,"replacement":(m) => {
			const { positive_lookbehind, whitespace, text, marker } = m.groups;
			const firstLine = marker + whitespace + text;
			const indent = " ".repeat(marker.length) + whitespace;
			return `${positive_lookbehind}${firstLine}\n${indent}$$\n${indent}$0\n${indent}$$`;
		}},
{"trigger":"(\\n|^)[ \\t]*(?:> ?)*[ \\t]*dm","options":"tAw","description":"Display Math on empty line","priority":2,"id":201,"regex":true,"replacement":"[[0]]$$\n$0\n$$"}
  ];

  SUITE_VARIABLES['${GREEK}']=SUITE_VARIABLES['${GREEK}'].replace(/\)$/, '|Pi|Xi|Psi)');
  const DISABLED_IDS=new Set([4,5]); // User explicitly opted out of live begin/end matching.
  const ADAPTED_IDS=new Set([1,2,3,30,95,140,168,173,174,175,176,177,178,196,197,200,201]);
  const MATRIX_ENVS=new Set(['matrix','pmatrix','bmatrix','Bmatrix','vmatrix','Vmatrix','smallmatrix','array','cases','align','align*','aligned','alignedat','alignat','alignat*','gathered','split']);
  const macroNames=new Set([...SUITE_MACROS,...CONFIG.customMacros].map(s=>s.startsWith('\\')?s:'\\'+s));
  const macroPrefixes=new Set();for(const name of macroNames)for(let i=2;i<=name.length;i++)macroPrefixes.add(name.slice(0,i));
  const substituteVars=s=>Object.entries(SUITE_VARIABLES).reduce((r,[k,v])=>r.split(k).join(v),s);
  const SUITE_RULES=SUITE_DEFAULTS.map(s=>({...s,pattern:s.regex?new RegExp('(?:'+substituteVars(s.trigger)+')$',s.flags||''):null})).sort((a,b)=>(b.priority||0)-(a.priority||0)||b.trigger.length-a.trigger.length);
  function suiteTemplate(body){
    // LaTeX Suite starts fields at $0. Our final exit uses ${0}, so shift by one.
    body=body.replace(/\$\{(\d+)(?=:|\})|\$(\d+)/g,(m,a,b)=>a!==undefined?'${'+(+a+1):'${'+(+b+1)+'}');
    const result=template(body);
    const last=result.groups[result.groups.length-2];
    if(last&&last.ranges.length===1&&last.ranges[0].from===result.text.length&&last.ranges[0].to===result.text.length){result.groups.pop();last.n=0;}
    return result;
  }
  function suiteMatches(s,prefix){
    if(s.pattern)return s.pattern.exec(prefix);
    if(!prefix.endsWith(s.trigger))return null;
    const m=[s.trigger];m.index=prefix.length-s.trigger.length;return m;
  }
  function suiteResult(s,m,prefix,ctx,visual=''){
    let body=typeof s.replacement==='function'?s.replacement(m):s.replacement;
    if(body===false||body===undefined)return null;
    body=body.replace(/\[\[(\d+)\]\]/g,(_,n)=>m[+n+1]||'');
    let from=m.index;
    if(s.id===1)body='$${1}$${0}';
    if(s.id===2)body='\\(${1}\\)${0}';
    if([3,200,201].includes(s.id)){body='\\[\n${1}\n\\]${0}';from=prefix.length-2;}
    if(s.id===30){body='\\text{$0 } $1';from=prefix.length-1;}
    if(s.id===95)body='^{\\circ}';
    if(s.id===140)body=body.replace(/\$2$/,'$3'); // Correct upstream's repeated final exit.
    if(s.id===168)body='\\qty{${0:1}}{${1:m}}$2'; // siunitx, rather than MathJax-only \pu.
    if([173,174,175,176,177,178].includes(s.id)){
      const token=m[1]||m[0],env=token==='align'?'aligned':/[pbBvV]mat$/.test(token)?token+'rix':token;
      const spec=env==='array'?'{${0:cc}}':'';
      const bodyField=env==='array'?'$1':'$0',exit=env==='array'?'$2':'$1';
      body='\\begin{'+env+'}'+spec+(ctx.inline?'':'\n')+bodyField+(ctx.inline?'':'\n')+'\\end{'+env+'}'+exit;
    }
    if(s.id===176 && m[1]==='align')body='\\begin{aligned}$0\\end{aligned}$1';
    body=body.replace(/\\omicron\b/g,'o');
    // A sentinel keeps selected text literal, even if it contains '$0' or '${...}'.
    const sentinel='\uE001';if(visual)body=body.split('${VISUAL}').join(sentinel);
    const indent=indentation(prefix);
    body=multiline(body,prefix,[3,200,201].includes(s.id));
    let result=[1,2,3,200,201].includes(s.id)?template(body):suiteTemplate(body);
    if(visual){const at=result.text.indexOf(sentinel);if(at>=0){result.text=result.text.replace(sentinel,visual);for(const g of result.groups)for(const r of g.ranges){if(r.from>at)r.from+=visual.length-1;if(r.to>at)r.to+=visual.length-1;}}}
    // Preserve a regex's unchanged leading boundary character, especially '$'.
    if(m[1]&&m[0].startsWith(m[1])&&result.text.startsWith(m[1])&&result.groups.every(g=>g.ranges.every(r=>r.from>=m[1].length))){const n=m[1].length;from+=n;result.text=result.text.slice(n);for(const g of result.groups)for(const r of g.ranges){r.from-=n;r.to-=n;}}
    return {from,...result,suiteId:s.id,inline:s.id===1,matrixBody:s.id>=173&&s.id<=178,pair:!s.regex&&['(','[','{','lr(','lr[','lr{'].includes(s.trigger),noChange:result.text===prefix.slice(from)};
  }
  const extraNames=new Set(SUITE_DEFAULTS.filter(s=>!s.regex).map(s=>s.trigger));
  const rawNames=Object.values(SUITE_VARIABLES).join('|').replace(/[()?:]/g,'').split('|').concat(['arcsin','arccos','arctan','arccsc','arcsec','arccot','sin','cos','tan','exp','log','ln','det','int']);
  const EXTRAS=SNIPPETS.filter(s=>!extraNames.has(s.trigger)&&!rawNames.some(n=>n!==s.trigger&&n.startsWith(s.trigger))&&!['__','cc','nn','uu','expec'].includes(s.trigger));
  function expansion(prefix,manual=false,project='',options={}){
    const ctx=scanContext(prefix);
    if(!['math','text'].includes(ctx.mode))return null;
    // Preserve explicitly configured project snippets, which use our ${1} syntax.
    for(const snip of CUSTOM_SNIPPETS){if(snip.mode!==ctx.mode||(snip.auto!==false)===manual||!prefix.endsWith(snip.trigger)||(snip.projects&&!snip.projects.includes(project)))continue;return {from:prefix.length-snip.trigger.length,...template(multiline(snip.body,prefix))};}
    if(ctx.mode==='math'&&!manual){
      const sized=/([2-6])([2-6])([pbBvV])mat$/.exec(prefix);
      if(sized)return {from:prefix.length-sized[0].length,...template(multiline(matrixBody(+sized[1],+sized[2],sized[3]+'matrix'),prefix))};
      // Repair xi + i before command spacing; both spellings should reach x_i.
      if(/(?:\\xii|xii)$/.test(prefix)){const m=/(?:\\xii|xii)$/.exec(prefix);return {from:m.index,...literalResult('x_{i}'),suiteId:76};}
      const compactAccent=new RegExp('\\\\('+SUITE_VARIABLES['${GREEK}']+')(hat|bar|vec|dot|ddot|tilde|und)$').exec(prefix);
      if(compactAccent)return {from:compactAccent.index,...literalResult('\\'+(compactAccent[2]==='und'?'underline':compactAccent[2])+'{\\'+compactAccent[1]+'}')};
      const tail=/\\[a-zA-Z]+$/.exec(prefix);
      if(tail){
        if(macroPrefixes.has(tail[0])||CONFIG.customMacros.some(n=>(n.startsWith('\\')?n:'\\'+n).startsWith(tail[0])))return null;
        if(options.generatedMacro||CONFIG.smartMacroSpacing==='all-known'){
          const previous=tail[0].slice(0,-1),last=tail[0].slice(-1);
          if(macroNames.has(previous))return {from:tail.index,...literalResult(previous+' '+last),suiteId:197};
        }
        // Let explicit rules such as Greek postfix accents consume complete macros.
        if(!/\\(?:alpha|beta|gamma|delta|theta|lambda|sigma|phi|psi|omega)(?:hat|bar|vec|dot|ddot|tilde|und)$/.test(tail[0]))return null;
      }
    }
    for(const s of SUITE_RULES){
      if(DISABLED_IDS.has(s.id)||[196,197,200,201].includes(s.id)||s.options.includes('v'))continue;
      if(s.options.includes('A')===manual)continue;
      const modeOK=s.options.includes('m')?ctx.mode==='math':s.options.includes('M')?ctx.mode==='math'&&!ctx.inline:s.options.includes('n')?ctx.mode==='math'&&ctx.inline:s.options.includes('T')?ctx.textMath:ctx.mode==='text'&&!ctx.textMath;
      if(!modeOK||(s.excludedMacros||[]).some(x=>ctx.macros.includes(x)))continue;
      if([71,72,73,74].includes(s.id)&&(!CONFIG.autoSubscripts||ctx.macros.some(x=>['ce','pu','qty'].includes(x))))continue;
      const m=suiteMatches(s,prefix);if(!m)continue;
      if([127,128].includes(s.id)){
        const word=/[A-Za-z]+$/.exec(prefix)?.[0];
        if(word&&rawNames.some(name=>name!==word&&name.startsWith(word)))continue;
      }
      if(s.options.includes('w')&&(/[\w\\]$/.test(prefix.slice(0,m.index))||/^\w/.test(options.after||'')))continue;
      if(['(','[','{','_'].includes(s.trigger)&&escaped(prefix,m.index))continue;
      const result=suiteResult(s,m,prefix,ctx);if(result&&!result.noChange)return result;
    }
    if(ctx.mode==='math'&&!manual&&CONFIG.autoFractions&&prefix.endsWith('/')&&!ctx.macros.some(x=>['ce','pu','qty'].includes(x))){const end=prefix.length-1,from=atomStart(prefix,end);if(from!==null)return {from,...fractionResult(ungroup(prefix.slice(from,end)))};}
    for(const snip of [...EXTRAS,...MANUAL].sort((a,b)=>b.trigger.length-a.trigger.length)){
      if(snip.mode!==ctx.mode||(snip.auto!==false)===manual||!prefix.endsWith(snip.trigger))continue;
      const from=prefix.length-snip.trigger.length,before=prefix.slice(0,from);
      if((ctx.mode==='text'&&/[a-zA-Z\\]$/.test(before))||snip.line&&!/^[\t ]*$/.test(before.slice(before.lastIndexOf('\n')+1)))continue;
      return {from,...template(multiline(snip.body,prefix))};
    }
    if(manual&&ctx.mode==='text'&&/(^|[^\w\\])today$/.test(prefix)){const d=new Date();return {from:prefix.length-5,...literalResult([d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'))};}
    return null;
  }

  if(typeof module!=='undefined'&&module.exports){module.exports={context,scanContext,equationBounds,template,suiteTemplate,atomStart,expansion,multiline,CONFIG,SNIPPETS,MANUAL,SUITE_DEFAULTS,SUITE_RULES,SUITE_VARIABLES,suiteResult,suiteMatches,DISABLED_IDS,ADAPTED_IDS,EXTRAS};return;}

  let enabled=true, installed=false, button, panel;
  const project=location.pathname.split('/')[2]||'';
  const views=new Set(), cache=new WeakMap();
  function status(){if(button)button.textContent='Overleaf LaTeX Suite '+VERSION+': '+(installed?(enabled?'ON':'OFF'):'waiting');}
  function mount(){
    if(button||!document.body)return;
    const host=document.createElement('div');host.style.cssText='position:fixed;bottom:12px;right:16px;z-index:9999;display:flex;gap:4px;font:12px system-ui';
    button=document.createElement('button');button.type='button';button.title='Toggle automatic math snippets';
    const help=document.createElement('button');help.type='button';help.textContent='Shortcuts';
    for(const b of [button,help])b.style.cssText='padding:7px 10px;border:1px solid #889;border-radius:6px;background:#fff;color:#223;cursor:pointer';
    button.addEventListener('click',()=>{enabled=!enabled;for(const [v,clear] of views)clear(v);status();});
    help.addEventListener('click',()=>{
      if(panel){panel.remove();panel=null;return;}
      panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:52px;right:16px;z-index:10000;max-width:440px;max-height:65vh;overflow:auto;background:#fff;color:#223;border:1px solid #889;border-radius:8px;padding:14px;font:13px/1.5 system-ui;box-shadow:0 4px 24px #0003;white-space:pre-wrap';
      panel.textContent='OVERLEAF LATEX SUITE '+VERSION+' — LaTeX Suite shortcuts\nTab / Shift+Tab: fields\nMatrix: Tab = &; Enter = row; Shift+Enter = exit\nAlt-/ (Option-/): selected fraction\nAlt-Shift-B/S: box/select equation\nSelect math + U/O/B/C/K/S: wrap selection\n\nGreek: @a @b @g @t @l @s …; pi, mu, nu …\nCalculus: sum then Tab; par then Tab; par2, parn\nMatrices: pmat, bmat, Bmat, vmat, Vmat, iden3\n\nAutomatic triggers:\n'+SUITE_DEFAULTS.filter(s=>!s.regex&&s.options.includes('A')&&!DISABLED_IDS.has(s.id)).map(s=>s.trigger).filter((s,i,a)=>a.indexOf(s)===i).join('  ')+'\n\nSee SHORTCUTS.md in the download for every rule, examples, and required LaTeX packages.';
      document.body.append(panel);
    });host.append(button,help);document.body.append(host);status();
  }
  document.addEventListener('DOMContentLoaded',mount);mount();
  function createExtension(cm,vim) {
    const {EditorView,ViewPlugin,StateField,StateEffect,keymap,Prec,isolateHistory}=cm;
    const add=StateEffect.define(),nav=StateEffect.define(),clear=StateEffect.define(),mirrorEdit=StateEffect.define();
    const filterFlag=StateField.define({create:()=>true,update:x=>x});
    const empty=()=>({sessions:[],inline:[],macro:null});
    function mapSession(s,changes){return {...s,groups:s.groups.map(g=>({...g,ranges:g.ranges.map(r=>({from:changes.mapPos(r.from,g.n===0?1:-1),to:changes.mapPos(r.to,1)}))}))};}
    const field=StateField.define({create:empty,update(value,tr){
      if(tr.isUserEvent('undo')||tr.isUserEvent('redo'))return empty();
      let sessions=value.sessions.map(s=>mapSession(s,tr.changes));
      let inline=value.inline.filter(p=>{let touched=false;tr.changes.iterChangedRanges((a,b)=>{if(a<=p&&b>=p)touched=true;});return !touched;}).map(p=>tr.changes.mapPos(p,1));
      let macro=value.macro?{...value.macro,from:tr.changes.mapPos(value.macro.from,-1),to:tr.changes.mapPos(value.macro.to,1)}:null;
      if(macro&&!/^\\[A-Za-z]+$/.test(tr.newDoc.sliceString(macro.from,macro.to)))macro=null;
      let navigation=false;
      for(const e of tr.effects){
        if(e.is(clear))return empty();
        if(e.is(nav)){sessions=e.value;navigation=true;}
        if(e.is(add)){
          if(e.value.session)sessions.push(e.value.session);
          if(e.value.inline!==undefined)inline.push(e.value.inline);
          macro=e.value.macro||null;navigation=true;
        }
      }
      if(!navigation){
        if(tr.newSelection.ranges.length!==1)sessions=[];
        else{const sel=tr.newSelection.main;let keep=0;for(const s of sessions){const r=s.groups[s.active].ranges[0];if(sel.from<r.from||sel.to>r.to)break;keep++;}sessions=sessions.slice(0,keep);}
      }
      return {sessions,inline:inline.slice(-24),macro};
    }});
    function insertMode(view){const v=vim?.getCM?.(view)?.state?.vim;return !v||v.insertMode;}
    function apply(view,result,to){
      if(view.state.readOnly)return false;
      // Share the closing bracket already inserted by Overleaf's own auto-pairing.
      const closing={ '(':')','[':']','{':'}' }[view.state.sliceDoc(to-1,to)];
      if(result.pair&&closing&&view.state.sliceDoc(to,to+1)===closing)to++;
      const groups=result.groups.map(g=>({...g,ranges:g.ranges.map(r=>({from:r.from+result.from,to:r.to+result.from}))}));
      const first=groups[0].ranges[0],effect={session:groups[0].n!==0?{groups,active:0,matrixBody:result.matrixBody,bodyGroup:result.matrixBody?(result.text.startsWith('\\begin{array}')?2:1):null}:null};
      if(result.inline)effect.inline=result.from+result.text.length;
      const tail=/\\[A-Za-z]+$/.exec(result.text);
      if(tail){const original=view.state.sliceDoc(result.from,to),name=tail[0].slice(1);effect.macro={from:result.from+tail.index,to:result.from+result.text.length,completion:/^[A-Za-z]+$/.test(original)&&name.startsWith(original)?name.slice(original.length):''};}
      if(result.macroOverride)effect.macro=result.macroOverride;
      view.dispatch({changes:{from:result.from,to,insert:result.text},selection:{anchor:result.collapseFirst?first.to:first.from,head:first.to},effects:add.of(effect),annotations:isolateHistory?isolateHistory.of('full'):[],userEvent:'input.snippet'});return true;
    }
    function matrixAt(view){
      const sel=view.state.selection.main;if(!CONFIG.matrixShortcuts||!sel.empty||context(view.state.sliceDoc(0,sel.head))!=='math')return null;
      return [...scanContext(view.state.sliceDoc(0,sel.head)).stack].reverse().find(f=>f.kind==='env'&&MATRIX_ENVS.has(f.key))||null;
    }
    function insertText(view,text,event='input.matrix'){
      const sel=view.state.selection.main;view.dispatch({changes:{from:sel.from,to:sel.to,insert:text},selection:{anchor:sel.from+text.length},userEvent:event});return true;
    }
    function matrixKey(view,key){
      if(!enabled||view.state.readOnly||!insertMode(view))return false;
      const env=matrixAt(view);if(!env)return false;
      const pos=view.state.selection.main.head,line=view.state.doc.lineAt(pos);
      const sessions=view.state.field(field).sessions,active=sessions[sessions.length-1];
      if(key==='Tab'){
        // Nested snippet fields (e.g. a fraction inside a cell) get priority.
        if(active&&(!active.matrixBody||active.groups[active.active].n!==active.bodyGroup))return false;
        const immediate=view.state.sliceDoc(pos,line.to).match(/^(?:\\right\s*(?:\\[A-Za-z]+|\\[{}|]|[^\s])|[)}\]])/);
        if(immediate){view.dispatch({selection:{anchor:pos+immediate[0].length}});return true;}
        return insertText(view,' & ');
      }
      const endTag='\\end{'+env.key+'}',end=view.state.doc.toString().indexOf(endTag,pos);
      const multilineEnv=view.state.doc.lineAt(env.start).number!==view.state.doc.lineAt(end>=0?end:pos).number;
      if(key==='Enter')return insertText(view,multilineEnv?' \\\\\n'+(/^[\t ]*/.exec(line.text)[0]||indentation(view.state.sliceDoc(0,env.start))+CONFIG.environmentBodyIndent):' \\\\ ');
      if(key==='Shift-Enter'){
        let target=end>=0?end+endTag.length:line.to;
        if(multilineEnv&&line.number<view.state.doc.lines){const next=view.state.doc.line(line.number+1),close=next.text.indexOf(endTag);target=close>=0?next.from+close+endTag.length:next.to;}
        view.dispatch({selection:{anchor:target},scrollIntoView:true});return true;
      }
      return false;
    }
    function tabout(view){
      if(!CONFIG.tabout||!view.state.selection.main.empty)return false;
      const pos=view.state.selection.main.head,doc=view.state.doc.toString();if(context(doc.slice(0,pos))!=='math')return false;
      const bounds=equationBounds(doc,pos);if(!bounds)return false;
      const after=doc.slice(pos,bounds.innerEnd);
      const m=/\\(?:right|bigr|Bigr|biggr|Biggr)\s*(?:\\[A-Za-z]+|\\[{}|]|[^\s])|\\(?:rangle|rvert|rVert|rceil|rfloor|\})|[)}\]]/.exec(after);
      const target=m?pos+m.index+m[0].length:bounds.end;
      if(target<=pos)return false;view.dispatch({selection:{anchor:target},scrollIntoView:true});return true;
    }
    function jump(view,back){
      if(!enabled||!insertMode(view)||view.state.readOnly)return false;
      const sel=view.state.selection.main;
      if(!back&&sel.empty){const result=expansion(view.state.sliceDoc(0,sel.head),true,project,{after:view.state.sliceDoc(sel.head)});if(result)return apply(view,result,sel.head);}
      if(!back&&matrixKey(view,'Tab'))return true;
      const sessions=view.state.field(field).sessions;
      if(!sessions.length)return !back&&tabout(view);
      const current=sessions[sessions.length-1],idx=current.active+(back?-1:1);
      if(idx<0||idx>=current.groups.length)return false;
      const target=current.groups[idx],r=target.ranges[0],next=sessions.slice(0,-1);if(target.n!==0)next.push({...current,active:idx});
      view.dispatch({selection:{anchor:r.from,head:r.to},effects:nav.of(next),scrollIntoView:true});return true;
    }
    function selectedFraction(view){
      const sel=view.state.selection.main;if(!enabled||view.state.readOnly||view.state.selection.ranges.length!==1||sel.empty)return false;
      if(context(view.state.sliceDoc(0,sel.from))!=='math'||context(view.state.sliceDoc(0,sel.to))!=='math')return false;
      return apply(view,{from:sel.from,...fractionResult(view.state.sliceDoc(sel.from,sel.to))},sel.to);
    }
    function visual(view,key){
      const sel=view.state.selection.main;if(!enabled||view.state.readOnly||sel.empty||view.state.selection.ranges.length!==1)return false;
      const ctx=scanContext(view.state.sliceDoc(0,sel.from));if(ctx.mode!=='math'||context(view.state.sliceDoc(0,sel.to))!=='math')return false;
      const s=SUITE_RULES.find(s=>s.options.includes('v')&&s.trigger===key);if(!s)return false;
      const m=[key];m.index=sel.from;
      const r=suiteResult(s,m,view.state.sliceDoc(0,sel.from),ctx,view.state.sliceDoc(sel.from,sel.to));r.from=sel.from;
      return apply(view,r,sel.to);
    }
    function equationCommand(view,box){
      if(!enabled||view.state.readOnly)return false;
      const doc=view.state.doc.toString(),pos=view.state.selection.main.head,bounds=equationBounds(doc,pos);if(!bounds||context(doc.slice(0,pos))!=='math')return false;
      let from=bounds.inner,to=bounds.innerEnd;
      while(from<to&&/\s/.test(doc[from]))from++;while(to>from&&/\s/.test(doc[to-1]))to--;
      if(box)return apply(view,{from,...literalResult('\\boxed{'+doc.slice(from,to)+'}')},to);
      view.dispatch({selection:{anchor:from,head:to},effects:clear.of(null)});return true;
    }
    const plugin=ViewPlugin.define(view=>{
      let alive=true;
      const entry=[view,v=>v.dispatch({effects:clear.of(null)})];views.add(entry);
      // Use the editor's own EditorState class: no duplicate CodeMirror dependencies.
      // Install a filter once per state so mirrored edits are one undoable transaction.
      function ensureFilter(){
        if(view.state.field(filterFlag,false))return;
        const EditorState=view.state.constructor;
        if(!EditorState.transactionFilter)return;
        queueMicrotask(()=>{
          if(!alive||view.state.field(filterFlag,false))return;
          const mirror=EditorState.transactionFilter.of(tr=>{
            if(!enabled||tr.startState.readOnly||!tr.docChanged||!(tr.isUserEvent('input')||tr.isUserEvent('delete'))||tr.isUserEvent('undo')||tr.isUserEvent('redo'))return tr;
            const value=tr.startState.field(field,false);if(!value||tr.effects.some(e=>e.is(clear)||e.is(nav)))return tr;
            for(const session of value.sessions){
              const group=session.groups[session.active];if(group.ranges.length<2)continue;
              const source=group.ranges[0];let valid=true,changes=0,typed;
              tr.changes.iterChanges((a,b,c,d,text)=>{changes++;if(a<source.from||b>source.to)valid=false;if(text.length===1)typed=text.toString();});
              if(!valid||!changes)continue;
              const sourceFrom=tr.changes.mapPos(source.from,-1),sourceTo=tr.changes.mapPos(source.to,1),text=tr.newDoc.sliceString(sourceFrom,sourceTo);
              const edits=group.ranges.slice(1).map(r=>({from:tr.changes.mapPos(r.from,-1),to:tr.changes.mapPos(r.to,1),insert:text}));
              return [tr,{changes:edits,effects:mirrorEdit.of(changes===1?typed:null),sequential:true}];
            }
            return tr;
          });
          view.dispatch({effects:StateEffect.appendConfig.of([filterFlag,mirror])});
        });
      }
      ensureFilter();
      return {destroy(){alive=false;views.delete(entry);},update(u){
        if(!view.state.field(filterFlag,false))ensureFilter();
        if(!enabled||!u.docChanged||view.composing||view.state.readOnly||!insertMode(view))return;
        if(!u.transactions.some(t=>t.isUserEvent('input.type')&&!t.isUserEvent('input.type.compose')))return;
        const state=u.state,sel=state.selection.main;if(state.selection.ranges.length!==1||!sel.empty)return;
        let typed=null,count=0,mirrorTyped=null;
        for(const tr of u.transactions){for(const e of tr.effects)if(e.is(mirrorEdit))mirrorTyped=e.value;tr.changes.iterChanges((a,b,c,d,insert)=>{
          count++;const str=insert.toString();
          if(insert.length===1)typed={a,b,c,d,text:str};
          // Overleaf may insert the closing bracket in the same typing transaction.
          else if(str.length===2&&{'(':')','[':']','{':'}'}[str[0]]===str[1]&&sel.head===c+1)typed={a,b,c,d:c+1,text:str[0]};
        });}
        if(mirrorTyped)typed={a:u.startState.selection.main.from,b:u.startState.selection.main.to,c:sel.head-1,d:sel.head,text:mirrorTyped};
        if((count!==1&&!mirrorTyped)||!typed)return;
        let result=null;
        if(CONFIG.smartInlineSpace&&/^[a-zA-Z]$/.test(typed.text)&&typed.a===typed.b&&u.startState.field(field).inline.includes(typed.a))result={from:typed.c,...literalResult(' '+typed.text)};
        else{
          const oldMacro=u.startState.field(field).macro;
          if(oldMacro?.to===typed.a&&oldMacro.completion?.startsWith(typed.text))result={from:typed.c,...literalResult(''),macroOverride:{...oldMacro,completion:oldMacro.completion.slice(1)}};
          else result=expansion(state.doc.sliceString(0,sel.head),false,project,{generatedMacro:CONFIG.smartMacroSpacing!=='off'&&oldMacro?.to===typed.a,after:state.doc.sliceString(sel.head)});
        }
        if(!result)return;
        queueMicrotask(()=>{if(alive&&enabled&&view.state===state)apply(view,result,sel.head);});
      }};
    });
    return [field,plugin,Prec.highest(EditorView.domEventHandlers({keydown(event,view){
      if(event.ctrlKey||event.metaKey||event.altKey)return false;
      if(visual(view,event.key)){event.preventDefault();return true;}
      if(enabled&&insertMode(view)&&view.state.selection.main.empty&&[']',')','}'].includes(event.key)){
        const p=view.state.selection.main.head;if(context(view.state.sliceDoc(0,p))==='math'&&view.state.sliceDoc(p,p+1)===event.key){view.dispatch({selection:{anchor:p+1}});event.preventDefault();return true;}
      }
      return false;
    }})),Prec.highest(keymap.of([
      {key:'Tab',run:v=>jump(v,false)}, {key:'Shift-Tab',run:v=>jump(v,true)},
      {key:'Enter',run:v=>matrixKey(v,'Enter')}, {key:'Shift-Enter',run:v=>matrixKey(v,'Shift-Enter')},
      {key:'Alt-/',run:selectedFraction}, {key:'Alt-Shift-b',run:v=>equationCommand(v,true)}, {key:'Alt-Shift-s',run:v=>equationCommand(v,false)},
      {key:'Escape',run:v=>{v.dispatch({effects:clear.of(null)});return false;}},
    ]))];
  }

  window.addEventListener('UNSTABLE_editor:extensions',event=>{
    const {CodeMirror:cm,CodeMirrorVim:vim,extensions}=event.detail;
    if(!cm?.ViewPlugin||!cm.StateField||!cm.StateEffect||!cm.keymap||!cm.Prec){console.warn('Fast Math: incompatible editor API');return;}
    if(!cache.has(cm))cache.set(cm,createExtension(cm,vim));extensions.push(cache.get(cm));installed=true;status();
  });
  window.dispatchEvent(new Event('editor:extension-loaded'));
})();
