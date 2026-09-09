/* Repeatable checks for this static website. Run: npm run check */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
let checks=0;function check(label,fn){fn();checks++;console.log('PASS',label);}
const files=walk(root).filter(f=>!f.includes(path.sep+'tools'+path.sep));
const html=files.filter(f=>f.endsWith('.html'));
check('All JavaScript files parse',()=>{for(const file of files.filter(f=>f.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}});
check('Local HTML references exist; IDs are unique',()=>{
 for(const file of html){const source=fs.readFileSync(file,'utf8');const ids=Array.from(source.matchAll(/\bid="([^"]+)"/g),m=>m[1]);assert.equal(new Set(ids).size,ids.length,file);
  for(const match of source.matchAll(/<(?:a|link|script|img|iframe|source)\b[^>]*?\b(?:href|src)="([^"]+)"/g)){
   const url=new URL(match[1],'https://local.test/'+path.relative(root,file).split(path.sep).join('/'));if(url.origin!=='https://local.test')continue;
   let target=path.join(root,decodeURIComponent(url.pathname));if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert.ok(fs.existsSync(target),`${file}: ${match[1]}`);
   if(url.hash&&url.hash!=='#'&&target.endsWith('.html'))assert.ok(fs.readFileSync(target,'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Missing anchor ${file}: ${match[1]}`);
  }
 }
});
check('Every content page supports zoom, landmarks, labels and local privacy controls',()=>{
 for(const file of html){const source=fs.readFileSync(file,'utf8');if(!source.includes('<main'))continue;
 assert.equal((source.match(/<h1\b/g)||[]).length,1,file);assert.match(source,/<html[^>]*lang="pt-BR"/);assert.match(source,/name="viewport"/);assert.doesNotMatch(source,/user-scalable=no|maximum-scale=1/);
 assert.match(source,/js\/privacy.js/);assert.match(source,/class="skip-link"/);assert.doesNotMatch(source,/fonts.googleapis.com|fonts.gstatic.com/);
 }
});
check('Styles and fonts resolve locally',()=>{
 for(const file of files.filter(f=>f.endsWith('.css'))){const source=fs.readFileSync(file,'utf8');for(const m of source.matchAll(/(?:url\(\s*['"]?([^)'"\s]+)|@import\s+['"]([^'"]+))/g)){const ref=m[1]||m[2];if(ref.startsWith('data:'))continue;assert.ok(!/^https?:/.test(ref),ref);assert.ok(fs.existsSync(path.resolve(path.dirname(file),ref)),ref);}}
});
check('Personal drafts are not persisted or logged',()=>{
 for(const file of files.filter(f=>f.endsWith('.js'))){const source=fs.readFileSync(file,'utf8');assert.doesNotMatch(source,/sessionStorage\.setItem|console\.log/);}
});
function environment(saved=null,blocked=false){
 const handlers={},nodes=new Map(),storage=new Map(),scripts=[],cookies=[];let clock=Date.now(),reloads=0;
 if(saved!==null)storage.set('cogit_consent_v2',typeof saved==='string'?saved:JSON.stringify(saved));
 class Node {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.id='';this.open=false;this.checked=false;this.hidden=false;this.attrs={};this.handlers={};this.children=new Map();this.isConnected=true;}
  setAttribute(k,v){this.attrs[k]=String(v);} getAttribute(k){return this.attrs[k]??null;}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);} fire(k,event={}){for(const fn of this.handlers[k]||[])fn({target:this,...event});}
  querySelector(selector){if(!this.children.has(selector)){const el=new Node(selector.includes('input')?'input':'button');if(selector.startsWith('#')){el.id=selector.slice(1);nodes.set(el.id,el);}this.children.set(selector,el);}return this.children.get(selector);}
  append(el){if(el.id)nodes.set(el.id,el);if(el.tagName==='SCRIPT')scripts.push(el);}
  remove(){nodes.delete(this.id);this.isConnected=false;} focus(){} showModal(){this.open=true;} close(){this.open=false;this.fire('close');}
 }
 const document={currentScript:{src:'https://local.test/js/privacy.js'},body:new Node('body'),head:new Node('head'),activeElement:null,visibilityState:'visible',
  addEventListener(k,fn){(handlers['doc:'+k]??=[]).push(fn);},getElementById:id=>nodes.get(id)||null,querySelector:()=>null,querySelectorAll:()=>[],createElement:tag=>new Node(tag)};
 Object.defineProperty(document,'cookie',{get:()=>cookies.length?'':'_ga=test; _ga_TEST=state; other=keep',set:v=>cookies.push(v)});
 class Clock extends Date{static now(){return clock;}}
 const context={document,URL,URLSearchParams,Date:Clock,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},setTimeout:()=>1,clearTimeout:()=>{},console,
  localStorage:{getItem:key=>{if(blocked)throw Error('blocked');return storage.get(key)??null;},setItem:(key,value)=>{if(blocked)throw Error('blocked');storage.set(key,value);},removeItem:key=>storage.delete(key)},sessionStorage:{removeItem:()=>{}},
  location:{origin:'https://local.test',pathname:'/contato.html',hostname:'local.test',search:'?email=private@example.test',hash:'#private',reload:()=>reloads++},
  siteConfig:{gaId:'G-TEST123',requireCookieConsent:false},matchMedia:()=>({matches:false}),addEventListener(k,fn){(handlers[k]??=[]).push(fn);},dispatchEvent(event){for(const fn of handlers[event.type]||[])fn(event);}};
 context.window=context;vm.createContext(context);vm.runInContext(read('js/privacy.js'),context);vm.runInContext(read('js/analytics.js'),context);vm.runInContext(read('js/utils.js'),context);
 return {context,nodes,scripts,storage,cookies,advance(ms){clock+=ms;},get reloads(){return reloads;},node:()=>new Node()};
}
check('No analytics request or event queue without consent, even with legacy bypass disabled',()=>{const e=environment();e.context.CogitPrivacy.init();e.context.initAnalytics();e.context.trackEvent('test',{email:'private'});assert.equal(e.scripts.length,0);assert.equal(e.context.dataLayer,undefined);assert.ok(e.nodes.has('cookie-banner'));});
check('Reject persists and does not load analytics',()=>{const e=environment();e.context.CogitPrivacy.init();e.nodes.get('cookie-reject').fire('click');assert.equal(e.context.CogitPrivacy.allows('analytics'),false);assert.equal(e.scripts.length,0);assert.equal(JSON.parse(e.storage.get('cogit_consent_v2')).analytics,false);const next=environment(e.storage.get('cogit_consent_v2'));next.context.CogitPrivacy.init();assert.ok(!next.nodes.has('cookie-banner'));});
check('Accept loads once; URL parameters and personal event fields are excluded',()=>{const e=environment();e.context.CogitPrivacy.init();e.nodes.get('cookie-accept').fire('click');e.context.initAnalytics();assert.equal(e.scripts.length,1);const config=e.context.dataLayer.find(args=>args[0]==='config')[2];assert.equal(config.page_location,'https://local.test/contato.html');assert.equal(config.page_referrer,'');assert.equal(config.allow_google_signals,false);e.context.trackEvent('diagnostic_completed',{service:'portfolio',email:'private@example.test',name:'Private',context:'secret'});const event=e.context.dataLayer.at(-1)[2];assert.equal(event.service,'portfolio');assert.ok(!('email'in event)&&!('name'in event)&&!('context'in event));});
check('Revocation unloads analytics, clears its accessible cookies and stops events',()=>{const e=environment();e.context.CogitPrivacy.init();e.nodes.get('cookie-accept').fire('click');e.context.CogitPrivacy.openSettings();e.nodes.get('cookie-reject-all').fire('click');assert.equal(e.context.CogitPrivacy.allows('analytics'),false);assert.equal(e.reloads,1);assert.ok(e.cookies.some(c=>c.startsWith('_ga=')));assert.ok(!e.cookies.some(c=>c.startsWith('other=')));e.context.trackEvent('after_revoke',{});assert.equal(e.context.dataLayer.length,0);});
check('Malformed, expired, old-version, future and overlong choices are rejected',()=>{const now=Date.now();const good={version:'2026-09-09',analytics:true,decidedAt:now-1000,expiresAt:now+100000};for(const saved of ['bad JSON',{...good,version:'old'},{...good,expiresAt:now-1},{...good,decidedAt:now+90000},{...good,expiresAt:now+181*86400000},{...good,analytics:'true'}])assert.equal(environment(saved).context.CogitPrivacy.allows('analytics'),false);const e=environment(good);assert.equal(e.context.CogitPrivacy.allows('analytics'),true);e.advance(200000);assert.equal(e.context.CogitPrivacy.allows('analytics'),false);});
check('Blocked storage falls back to a page-only decision',()=>{const e=environment(null,true);e.context.CogitPrivacy.init();e.nodes.get('cookie-accept').fire('click');assert.equal(e.context.CogitPrivacy.allows('analytics'),true);assert.equal(environment(null,true).context.CogitPrivacy.allows('analytics'),false);});
check('Contact authorization is unchecked and independent of optional cookies',()=>{const e=environment();const markup=e.context.CogitPrivacy.formMarkup('test');assert.match(markup,/type="checkbox"/);assert.doesNotMatch(markup,/\schecked/);assert.equal(e.context.CogitPrivacy.authorize(null),false);const field=e.node();field.id='test';const error=e.node();e.nodes.set('test-error',error);const container={querySelector:()=>field};assert.equal(e.context.CogitPrivacy.authorize(container),false);assert.equal(error.hidden,false);field.checked=true;assert.equal(e.context.CogitPrivacy.authorize(container),true);assert.equal(e.context.CogitPrivacy.allows('analytics'),false);});
check('Free text is escaped and Brazilian phone formatting supports 10/11 digits',()=>{const e=environment();assert.equal(e.context.CogitUI.escapeHtml('<img src=x onerror="bad">'), '&lt;img src=x onerror=&quot;bad&quot;&gt;');assert.equal(e.context.CogitUI.formatPhone('1134567890'),'(11) 3456-7890');assert.equal(e.context.CogitUI.formatPhone('11987654321'),'(11) 98765-4321');});
function contrast(a,b){const luminance=hex=>{const c=hex.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
check('Card text and primary CTA meet WCAG AA contrast',()=>{for(const [fg,bg]of[['fafafc','242329'],['c6c3cf','242329'],['c6c3cf','302b3a'],['ffffff','4a3ddb'],['a79bff','0f1b33']]){const ratio=contrast(fg,bg);assert.ok(ratio>=4.5,`${fg}/${bg}: ${ratio}`);console.log(`  #${fg} / #${bg}: ${ratio.toFixed(2)}:1`);}});
function configuratorTest() {
 const e=environment();
 vm.runInContext(read('js/data.js'),e.context);
 const source=read('js/configurator.js').replace('return { init, reset, preselectAndScroll };','return { init, reset, preselectAndScroll, state, toggleService, toggleAddon, updateAddonQuantity, selectLevel, selectSolutionModel, calculateTotal, openWhatsAppDirect };');
 vm.runInContext(source,e.context);
 return {e,app:vm.runInContext('ConfiguratorApp',e.context)};
}
check('Estimator totals include selected extras and remove incompatible extras',()=>{
 const {app}=configuratorTest();app.toggleService('landing-page');app.toggleAddon('seo-avancado');assert.equal(app.calculateTotal().value,1980);app.toggleService('landing-page');assert.equal(app.state.selectedAddons.length,0);app.toggleService('portfolio');assert.equal(app.calculateTotal().value,790);
});
check('Quantity controls add, reduce and remove an extra',()=>{
 const {app}=configuratorTest();app.toggleService('site-institucional');app.toggleAddon('pagina-adicional');app.updateAddonQuantity('pagina-adicional','plus');assert.equal(app.calculateTotal().value,2490);app.updateAddonQuantity('pagina-adicional','minus');assert.equal(app.calculateTotal().value,2240);app.updateAddonQuantity('pagina-adicional','minus');assert.equal(app.calculateTotal().value,1990);
});
check('Complexity does not leave a stale estimate after removing a service',()=>{
 const {app}=configuratorTest();app.toggleService('sistema');app.toggleService('saas');assert.equal(app.calculateTotal(),null);app.toggleService('saas');assert.equal(app.state.selectedServices.length,1);assert.notEqual(app.calculateTotal(),null);
});
check('WhatsApp message is encoded; only the explicit contact handoff includes personal fields',()=>{
 const {app,e}=configuratorTest();let opened;e.context.open=(url,target,features)=>opened={url,target,features};app.toggleService('portfolio');app.openWhatsAppDirect();let text=new URL(opened.url).searchParams.get('text');assert.match(text,/Portfólio/);assert.doesNotMatch(text,/private@example/);app.openWhatsAppDirect({name:'Teste & revisão',email:'private@example.test',company:'',whatsapp:'(11) 98765-4321',notes:'<b>literal<\/b>'});text=new URL(opened.url).searchParams.get('text');assert.match(text,/Teste & revisão/);assert.match(text,/Autorização de contato: confirmada/);assert.equal(opened.features,'noopener,noreferrer');
});
console.log(`\n${checks} checks passed. ${html.length} HTML files inspected. Browser layout and interaction review are separate.`);
