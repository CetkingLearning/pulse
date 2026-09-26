const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'../pulse.html'),'utf8');
function boot({charts=true,search=''}={}) {
 const errors=[];const virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://pulse.example/'+search,pretendToBeVisual:true,virtualConsole,beforeParse(w){
  w.structuredClone=structuredClone;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{};
  if(charts)w.Chart=class{static instances=new Map();constructor(canvas,spec){this.canvas=canvas;this.spec=spec;this.constructor.instances.set(canvas.id,this);}destroy(){this.constructor.instances.delete(this.canvas.id);}resize(){}};
 }});return {dom,w:dom.window,d:dom.window.document,errors};
}
test('empty by default; all six tabs expose honest empty states',()=>{
 const {dom,w,d,errors}=boot();assert.equal(w.Pulse.mode,'empty');assert.equal(d.querySelectorAll('.empty-state').length,6);assert.equal(w.Chart.instances.size,0);
 for(const id of ['summary','progress','benchmark','strategy','mistakes','change']){d.getElementById('tab-'+id).click();assert.equal(d.querySelector('.view.active').id,id);assert.equal(d.getElementById('tab-'+id).getAttribute('aria-selected'),'true');}
 assert.deepEqual(errors,[]);dom.window.close();
});
test('demo has ten charts and all specified table/list structures',()=>{
 const {dom,w,d,errors}=boot({search:'?demo=1'});assert.equal(w.Pulse.mode,'demo');assert.equal(w.Chart.instances.size,10);assert.equal(d.getElementById('demoBanner').hidden,false);
 assert.equal(d.querySelectorAll('#vaultTable th').length,12);assert.equal(d.querySelectorAll('#leakTable th').length,7);assert.equal(d.querySelectorAll('#repeatTable th').length,6);
 for(const [key,count] of [['change.load',5],['change.criteria',5],['change.marks',5]])assert.equal(d.querySelectorAll(`[data-slot="${key}"] tbody tr`).length,count);
 assert.equal(d.querySelectorAll('[data-slot="change.rules"] li').length,5);assert.equal(d.querySelectorAll('[data-slot="change.avoid"] li').length,4);
 assert.equal(w.Chart.instances.get('benchChart').spec.data.labels.length,6);assert.equal(w.Chart.instances.get('balanceChart').spec.data.datasets.length,3);
 d.getElementById('exitDemo').click();assert.equal(w.Pulse.mode,'empty');assert.equal(w.Chart.instances.size,0);assert.equal(d.getElementById('studentChip').hidden,true);assert.equal(d.getElementById('sbOpen').hasAttribute('href'),false);
 assert.deepEqual(errors,[]);dom.window.close();
});
test('student → demo → student → empty retains no sample analysis and preserves zero',()=>{
 const {dom,w,d,errors}=boot();w.Pulse.setDashboard({student:{name:'Student A'},slots:{'summary.net':{value:0},'summary.explanation':'Only supplied text.'}});
 assert.equal(d.querySelector('[data-slot="summary.net"] .val').textContent,'0');assert.equal(d.querySelector('[data-slot="summary.predicted"]').hidden,true);assert.equal(d.querySelector('[data-slot="summary.quant"]').hidden,true);
 w.Pulse.demo();d.getElementById('exitDemo').click();assert.equal(d.getElementById('studentName').textContent,'Student A');assert.equal(w.Chart.instances.size,0);
 assert.equal(d.getElementById('dashboard').textContent.includes('Verbal selection'),false);
 w.Pulse.setDashboard({student:{name:'Student B'},slots:{}});assert.equal(d.querySelectorAll('.empty-state').length,6);assert.equal(d.querySelector('[data-slot="summary.net"]').textContent,'');
 w.Pulse.clear();assert.equal(d.getElementById('studentName').textContent,'');assert.deepEqual(errors,[]);dom.window.close();
});
test('imported text never becomes HTML; unsafe URLs have no href',()=>{
 const {dom,w,d,errors}=boot();const injection='<img src=x onerror=alert(1)>';
 w.Pulse.setDashboard({student:{name:injection,profile_url:'javascript:alert(1)'},slots:{'summary.headline':injection,'progress.log':[[injection,'2026-09-26',null,null,null,null,null,0,null,null,null,{url:'javascript:alert(1)',label:'bad'}]]}});
 assert.equal(d.querySelectorAll('#dashboard img,#studentChip img').length,0);assert.equal(d.querySelector('[data-slot="summary.headline"]').textContent,injection);assert.equal(d.getElementById('sbOpen').hasAttribute('href'),false);assert.equal(d.querySelectorAll('#vaultTable a').length,0);assert.deepEqual(errors,[]);dom.window.close();
});
test('missing chart library preserves all ten readable chart data fallbacks',()=>{
 const {dom,w,d,errors}=boot({charts:false});w.Pulse.demo();assert.equal(d.querySelectorAll('.chart-fallback').length,10);assert.equal([...d.querySelectorAll('.chart-fallback')].every(n=>!n.closest('.card').hidden),true);assert.deepEqual(errors,[]);dom.window.close();
});
test('keyboard tabs and repeated demo switches clean up chart instances',()=>{
 const {dom,w,d,errors}=boot();d.getElementById('pulseTabs').dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(d.querySelector('.view.active').id,'change');
 for(let i=0;i<3;i++){w.Pulse.demo();assert.equal(w.Chart.instances.size,10);w.Pulse.clear();assert.equal(w.Chart.instances.size,0);}assert.deepEqual(errors,[]);dom.window.close();
});
