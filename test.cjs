const assert=require('node:assert/strict');
const a=require('./overleaf-latex-suite.user.js');let count=0;
function eq(x,y,label){assert.deepEqual(x,y,label);count++;}
for(const s of ['$x','$$x','\\[x','\\(x','\\begin{align}x','$\\text{hello $x'])eq(a.context(s),'math',s);
for(const s of ['hello','$x$ prose','$\\text{a {nested} b'])eq(a.context(s),'text',s);
for(const [s,c] of [['$x % comment','comment'],['\\begin{verbatim}$x','verbatim'],['\\verb|$x','verbatim'],['$\\label{sum','literal']])eq(a.context(s),c,s);
for(const s of ['beg','$beg','The ff','% mk','$\\text{sr','$\\mycommand'])eq(a.expansion(s),null,s);
for(const [s,t] of [
 ['mk','$$'],['    dm','\\[\n    \n    \\]'],['\t\tdm','\\[\n\t\t\n\t\t\\]'],
 ['$//','\\frac{}{}'],['$4ac/','\\frac{4ac}{}'],['$(a+b)/','\\frac{a+b}{}'],
 ['$4\\pi^2/','\\frac{4\\pi^2}{}'],['$xsr','^{2}'],['$x1','x_{1}'],
 ['$@a','\\alpha'],['$epsilon','\\epsilon'],['$Pi','\\Pi'],['$\\alphahat','\\hat{\\alpha}'],
 ['$sum','\\sum'],['$norm','\\lvert  \\rvert '],['$Norm','\\lVert  \\rVert '],['$x,.','\\mathbf{x}'],
 ['$deg','^{\\circ}'],['$pu','\\qty{1}{m}']
])eq(a.expansion(s)?.text,t,s);
eq(a.expansion('$\\sum',true).text,'\\sum_{i=1}^{N} ');
eq(a.expansion('    proof',true).text,'\\begin{proof}\n      \n    \\end{proof}');
eq(a.SUITE_DEFAULTS.length,201);eq([...a.DISABLED_IDS],[4,5]);
// One concrete match for every regex definition. This audits imported coverage;
// the integration suite separately types triggers character by character.
const examples={4:' beg',5:' beg',30:'\n  "',39:'3rt',41:'ee',43:' log',49:' det',51:'xhat',52:'xbar',53:'xdot',54:'xddot',55:'xtilde',56:'xund',57:'xvec',58:'x,.',59:'x.,',60:'\\alpha,.',61:'\\alpha.,',71:'x2',72:'x_{1}2',73:'\\hat{x}2',74:'\\hat{\\bar{x}}2',119:'ne\\xi sts',127:' alpha',128:' parallel',129:'\\alpha sr',130:'\\alpha cb',131:'\\alpha rd',132:'\\alpha hat',133:'\\alpha dot',134:'\\alpha bar',135:'\\alpha vec',136:'\\alpha tilde',137:'\\alpha und',139:'par2',140:'parn',141:'paxy',143:' int',151:' sin',152:'arccsc',173:'pmat',174:'array',175:'bmat',176:'matrix',177:'align',196:'\\alpha',197:'\\alphax',199:'iden3',200:'- note dm',201:'\n    dm'};
let covered=0;
for(const r of a.SUITE_RULES){
 if(a.DISABLED_IDS.has(r.id))continue;
 const ctxPrefix=r.options.includes('T')?'$\\text{':r.options.includes('M')?'\\[\n':r.options.includes('t')?'':'$';
 const input=ctxPrefix+(r.regex?examples[r.id]:r.trigger);
 const match=a.suiteMatches(r,input);assert(match,'Missing fixture/match for '+r.id);count++;
 const result=a.suiteResult(r,match,input,a.scanContext(ctxPrefix),r.options.includes('v')?'x+y':'');
 assert(result,'Missing result '+r.id);count++;
 assert(!result.text.includes('${VISUAL}')&&!/\[\[\d+\]\]/.test(result.text),'Unresolved marker '+r.id);count++;
 for(const g of result.groups)for(const range of g.ranges)assert(range.from>=0&&range.to>=range.from&&range.to<=result.text.length,'Invalid field '+r.id);
 covered++;
}
console.log(`Passed ${count} assertions; ${covered} upstream rules audited, 2 begin/end rules intentionally disabled.`);
