const {JSDOM}=require('jsdom'),fs=require('node:fs'),assert=require('node:assert/strict');
const api=require('../overleaf-latex-suite.user.js');
const results=[];let assertions=0;
(async()=>{
 for(const vim of [false,true]){
  const dom=new JSDOM('<div id="editor"></div>',{runScripts:'dangerously',pretendToBeVisual:true,url:'https://www.overleaf.com/project/test'}),w=dom.window;
  w.Range.prototype.getClientRects=()=>[];w.Range.prototype.getBoundingClientRect=()=>({left:0,right:0,top:0,bottom:0});
  w.eval(fs.readFileSync(__dirname+'/../overleaf-latex-suite.user.js','utf8'));w.eval(fs.readFileSync(__dirname+'/bundle.js','utf8'));
  let v;function key(k,o={}){return v.contentDOM.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true,...o}));}
  async function start(doc='$'){if(v)v.destroy();v=w.startEditor(vim,doc);if(vim)key('i');await Promise.resolve();}
  async function type(s){for(const ch of s){const before=v.state;if(!key(ch)||v.state!==before){await Promise.resolve();continue;}const sel=v.state.selection.main;v.dispatch({changes:{from:sel.from,to:sel.to,insert:ch},selection:{anchor:sel.from+1},userEvent:'input.type'});await Promise.resolve();}}
  const doc=()=>v.state.doc.toString(),selected=()=>v.state.sliceDoc(v.state.selection.main.from,v.state.selection.main.to);
  const eq=(a,b,label)=>{assertions++;assert.deepEqual(a,b,label);};
  const test=async(name,f)=>{try{await f();results.push({vim,name,pass:true});}catch(e){results.push({vim,name,pass:false,error:e.message});}};
  for(const [input,expected] of [
   ['Pi','\\Pi'],['Xi','\\Xi'],['Psi','\\Psi'],['@ahat','\\hat{\\alpha}'],['@a','\\alpha'],['@O','\\Omega'],[':e','\\varepsilon'],['pi','\\pi'],['sin @t','\\sin \\theta'],['sinx','\\sin x'],
   ['x12','x_{12}'],['@a12','\\alpha_{12}'],['xdot3','\\dot{x}_{3}'],['xddot','\\ddot{x}'],['x,.','\\mathbf{x}'],['@a,.','\\boldsymbol{\\alpha}'],
   ['4\\pi^2/','\\frac{4\\pi^2}{}'],['(a+b)/','\\frac{a+b}{}'],['3rt','\\sqrt[3]{  }'],
   ['sum','\\sum'],['int','\\int'],['iiint','\\iiint'],['dint','\\int_{0}^{1}  \\, dx '],
   ['par2','\\frac{ \\partial^{2} y }{ \\partial x^{2} } '],['xnn','x_{n}'],['xii','x_{i}'],['xp1','x_{n+1}'],
   ['exists','\\exists'],['nexists','\\nexists'],['epsilon','\\epsilon'],['parallel','\\parallel'],
   ['norm','\\lvert  \\rvert '],['Norm','\\lVert  \\rVert '],['he4','{}^{4}_{2}He '],['deg','^{\\circ}'],
   ['lr(','\\left(  \\right) '],['ceil','\\lceil  \\rceil ']
  ])await test(input,async()=>{await start();await type(input);eq(doc(),'$'+expected,input);});
  for(const rule of api.SUITE_RULES.filter(r=>!r.regex&&r.options.includes('m')&&r.options.includes('A'))){
   await test('full trigger '+rule.trigger,async()=>{await start();const match=api.suiteMatches(rule,'$'+rule.trigger),expected=api.suiteResult(rule,match,'$'+rule.trigger,api.scanContext('$'));await type(rule.trigger);eq(doc(),'$'+expected.text);});
  }
  for(const name of api.SUITE_VARIABLES['${GREEK}'].slice(3,-1).split('|')) await test('Greek '+name,async()=>{await start();await type(name);eq(doc(),'$'+(name==='omicron'?'o':'\\'+name));});
  await test('box equation',async()=>{await start('$x+y$');v.dispatch({selection:{anchor:3}});key('B',{altKey:true,shiftKey:true,keyCode:66});eq(doc(),'$\\boxed{x+y}$');});
  await test('select equation',async()=>{await start('\\[ x+y \\]');v.dispatch({selection:{anchor:5}});key('S',{altKey:true,shiftKey:true,keyCode:83});eq(selected(),'x+y');});
  await test('indent dm',async()=>{await start('\\begin{proof}\n    ');await type('dm');eq(doc(),'\\begin{proof}\n    \\[\n    \n    \\]');await type('xsr');key('Tab');eq(doc(),'\\begin{proof}\n    \\[\n    x^{2}\n    \\]');});
  await test('sum fields',async()=>{await start();await type('sum');key('Tab');eq(selected(),'i');await type('k');key('Tab');eq(selected(),'1');key('Tab',{shiftKey:true});eq(selected(),'k');key('Tab');key('Tab');eq(selected(),'N');await type('9');key('Tab');await type('x');eq(doc(),'$\\sum_{k=1}^{9} x');});
  await test('nested',async()=>{await start();await type('//sqx');key('Tab');key('Tab');await type('y');key('Tab');eq(doc(),'$\\frac{\\sqrt{ x }}{y}');});
  await test('linked Taylor defaults',async()=>{await start();await type('tayl');eq(selected(),'f');await type('g');eq((doc().match(/g/g)||[]).length,4);key('Tab');await type('t');key('Tab');await type('k');eq(doc(),"$g(t + k) = g(t) + g'(t)k + g''(t) \\frac{k^{2}}{2!} + \\dots");});
  await test('parn linked + undo',async()=>{await start();await type('parn');await type('m');eq(doc(),'$\\frac{ \\partial^{m} y }{ \\partial x^{m} } ');w.testApi.undo(v);eq(doc(),'$\\frac{ \\partial^{n} y }{ \\partial x^{n} } ');w.testApi.redo(v);eq(doc(),'$\\frac{ \\partial^{m} y }{ \\partial x^{m} } ');});
  await test('nested linked value',async()=>{await start();await type('outer');await type('@a');eq(doc(),'$\\ket{\\alpha} \\bra{\\alpha} ');});
  await test('matrix keys',async()=>{await start('\\[\n    ');await type('pmat');await type('a');key('Tab');await type('b');key('Enter');await type('c');key('Tab');await type('d');key('Enter',{shiftKey:true});eq(doc(),'\\[\n    \\begin{pmatrix}\n      a & b \\\\\n      c & d\n    \\end{pmatrix}');eq(v.state.selection.main.head,doc().length);});
  await test('inline matrix keys',async()=>{await start();await type('bmat');await type('a');key('Tab');await type('b');key('Enter');await type('c');key('Enter',{shiftKey:true});eq(doc(),'$\\begin{bmatrix}a & b \\\\ c\\end{bmatrix}');eq(v.state.selection.main.head,doc().length);});
  await test('selected underbrace',async()=>{await start('$a+b$');v.dispatch({selection:{anchor:1,head:4}});await type('U');await type('c');key('Tab');eq(doc(),'$\\underbrace{ a+b }_{ c }$');});
  await test('tabout existing math',async()=>{await start('$x+\\left(a+b\\right)$');v.dispatch({selection:{anchor:10}});key('Tab');eq(v.state.selection.main.head,doc().length-1);key('Tab');eq(v.state.selection.main.head,doc().length);});
  await test('beg off',async()=>{await start();await type('beg');eq(doc(),'$beg');});
  await test('macro protection and text',async()=>{await start();await type('\\mycommand');eq(doc(),'$\\mycommand');await start('$\\text{');await type('sin and parallel');eq(doc(),'$\\text{sin and parallel');});
  await test('ce exclusion',async()=>{await start();await type('cee');await type('H2 -> O2');eq(doc(),'$\\ce{ H2 -> O2 }');});
  await test('native auto-pair integration',async()=>{await start();v.dispatch({changes:{from:1,insert:'()'},selection:{anchor:2},userEvent:'input.type'});await Promise.resolve();eq(doc(),'$()');await type('x');key('Tab');eq(doc(),'$(x)');eq(v.state.selection.main.head,doc().length);});
  if(v)v.destroy();dom.window.close();
 }
 const failed=results.filter(r=>!r.pass);console.log(JSON.stringify({assertions,passed:results.length-failed.length,failed},null,2));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
