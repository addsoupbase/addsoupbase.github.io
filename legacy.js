'use strict'
!function(t){"use strict";t.Map=t.Map||function(t){var e=new ActiveXObject("Scripting.Dictionary");if(t)for(var n=t.length;n--;){var r=t[n];i.set(r[0],r[1])}var i={keys:function(){return e.Keys()},values:function(){return e.Items()},entries:function(){for(var t=e.Keys(),n=e.Items(),r=[],i=0,u=t.length;i<u;++i)r.push([t[i],n[i]]);return r},get size(){return e.Count},clear:function(){e.RemoveAll()},set:function(t,n){e.Exists(t)&&e.Remove(t),e.Add(t,n)},get:function(t){return e.Item(t)},has:function(t){return e.Exists(t)},delete:function(t){e.Exists(t)&&e.Remove(t)}};return i},t.WeakMap=t.WeakMap||function(t){var e=new ActiveXObject("Scripting.Dictionary");if(t)for(var n=t.length;n--;){var r=t[n];i.set(r[0],r[1])}var i={set:function(t,n){e.Exists(t)&&e.Remove(t),e.Add(t,n)},get:function(t){return e.Item(t)},has:function(t){return e.Exists(t)},delete:function(t){e.Exists(t)&&e.Remove(t)}};return i},t.Set=t.Set||function(t){var e=new ActiveXObject("Scripting.Dictionary");if(t)for(var n=t.length;n--;)r.add(t[n]);var r={keys:function(){return e.Items()},values:function(){return e.Items()},entries:function(){for(var t=e.Items(),n=[],r=0,i=t.length;r<i;++r)n.push([t[r],t[r]]);return n},add:function(t){e.Exists(t)&&e.Remove(t),e.Add(t,"")},has:function(t){return e.Exists(t)},delete:function(t){e.Exists(t)&&e.Remove(t)},clear:function(){e.RemoveAll()},get size(){return e.Count}};return r},t.WeakSet=t.WeakSet||function(t){var e=new ActiveXObject("Scripting.Dictionary");if(t)for(var n=t.length;n--;)r.add(t[n]);var r={add:function(t){e.Exists(t)&&e.Remove(t),e.Add(t,"")},has:function(t){return e.Exists(t)},delete:function(t){e.Exists(t)&&e.Remove(t)}};return r}}(window)
Element.prototype.replaceChildren||Object.defineProperty(Element.prototype,'replaceChildren',{value:Object.defineProperty((window.Document||window.HTMLDocument).prototype,'replaceChildren',{value:function(){[].slice.call(this.childNodes).forEach(function(n){this.removeChild(n)},this);[].forEach.call(arguments,function(o){this.appendChild(o)},this)}}).replaceChildren})
Element.prototype.closest||Object.defineProperty(Element.prototype,'closest',{value:function(s){var z=this;do{if(z.matches(s))return z;z=z.parentElement}while(z);return null}})
var globalThis=globalThis||window,reportError=reportError||function reportError(t){try{try{var e=new ErrorEvent('error',{message:t.message,error:t})}catch(_){e=document.createEvent('ErrorEvent')
typeof scrollMaxX==='number'&&(XMLHttpRequest=XMLHttpRequest.bind(window,{mozAnon:!0,mozSystem:!0}))
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