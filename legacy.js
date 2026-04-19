'use strict'
/*@cc_on function _(){var e=new ActiveXObject("Scripting.Dictionary");return{set:function(n,t){e.Add(n,t)},get:function(n){return e.Item(n)},add:function(n){e.Add(n,"")},has:function(n){return e.Exists(n)},delete:function(n){e.Exists(n)&&e.Remove(n)}}}window.Map=window.Map||_;window.WeakMap=window.WeakMap||_;window.Set=window.Set|| _;@*/var globalThis=globalThis||window,reportError=reportError||function reportError(t){try{try{var e=new ErrorEvent('error',{message:t.message,error:t})}catch(_){e=document.createEvent('ErrorEvent')
e.initEvent('error',!0,!0)}window.dispatchEvent(e)
e.defaultPrevented||console.error('[reportError]',String(t))}catch(o){console.warn(String(o))}}
Object.hasOwn=Object.hasOwn||hasOwnProperty.call.bind(hasOwnProperty)
var CSS=CSS||function(){var D=document,p=D.head||D.body||D.documentElement||((p=D.currentScript)&&(p.parentNode||p))||D.querySelector('*')||D,s=p.appendChild(D.createElement('style')),computed=getComputedStyle(s)
return{supports:supports}
function supports(p,v){var k=p.substring(0,8)==='selector'
if(k&&v==null){s.textContent=p.slice(9,-1)+'{width:auto}'
var d=s.sheet
return(d.rules||d.cssRules).length===1}return p in computed}}()
''.startsWith||Object.defineProperty(String.prototype,'startsWith',{value:function(s,p){return this.slice(p=p|0,(s+='').length+p)===s}});[].find||Object.defineProperty(Array.prototype,'find',{value:function(c,t,m,z){for(var i=0,l=(m=this).length;i<l;++i){z=m[i]
if(c.call(t,z))return z}}});[].includes||Object.defineProperty(Array.prototype,'includes',{value:function(n){for(var i = this.length; i--;)if(this[i]===n)return true;return false}})
''.includes||(String.prototype.includes=function(a,b){return!!~this.indexOf(a,b)})
''.endsWith||Object.defineProperty(String.prototype,'endsWith',{value:function(s,p){s+=''
var len=p===void 0?this.length:p|0
return this.slice(len-s.length,len)===s}});[].findIndex||(Object.defineProperty(Array.prototype,'findIndex',{value:function findIndex(f,t){for(var i=0,m=this,l=m.length;i<l;++i)if(f.call(t,m[i],i,m))return i
return-1}}))
var Symbol=Symbol||function(){function a(b){return String(Math.random()+String(b)+performance.now()+String(Date.now()))}a.for=''.concat.bind('@@')
return a}(),Reflect=Reflect||{apply:function(n,t,a){return n.apply(t,a)},getPrototypeOf:Object.getPrototypeOf||function(t){return t.__proto__},setPrototypeOf:Object.setPrototypeOf,defineProperty:Object.defineProperty,ownKeys:Object.getOwnPropertyNames,has:function(t,p){return t in p},set:function(t,p,v){t[p]=v},get:function(t,p){return t[p]},deleteProperty:function(t,p){return delete t[p]},construct:function(l,a,v){if(typeof l!=='function'||typeof v!=='function')throw TypeError('Constructor required')
var out=new((v||l).bind.apply((v||l),[this].concat(a)))
v&&Object.setPrototypeOf(out,l.prototype)
return out},preventExtensions: Object.preventExtensions,isExtensible: Object.isExtensible,getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor}
Object.fromEntries=Object.fromEntries||function(l,o){o={}
l.forEach(function(e,p){p=e[0]
o[p]=e[1]})
return o}
Object.entries=Object.entries||function(o,i){var x=[]
for(i in o)x.push([i,o[i]])
return x}
''.at||Object.defineProperty(Array.prototype,'at',{value:String.prototype.at=function(i){i|=0
if(i<0)i+=this.length
var a=this[i]
return typeof this==='string'?(a===void 0?'':a):a}})
Element.prototype.toggleAttribute||Object.defineProperty(Element.prototype,'toggleAttribute',{value:function(a,f){typeof f==='boolean'?(f?this.setAttribute(a,''):this.removeAttribute(a)):this.toggleAttribute(a,!this.hasAttribute(a))
return this.hasAttribute(a)}})
Element.prototype.remove||function(v,n){for(var i=n.length,p;i--;)(p=n[i]).remove||Object.defineProperty(p,'remove',{value:v})}(function(){var p=this.parentNode
p&&p.removeChild(this)},[DocumentType,Element,CharacterData])