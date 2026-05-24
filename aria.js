"use strict"
!function(e,t,n){e.addEventListener("submit",function(e){var t=e.target
n.has(t)?e.returnValue=!(!e.preventDefault||!e.preventDefault()):n.add(t)},!0)
e.addEventListener("keydown",function(n){if("KeyboardEvent"!==n.constructor.name)return console.warn("keydown listener fired was not KeyboardEvent. This is a bug I think! (happens when user clicks the autocomplete thingy, just ignore it)",n)
var r=n.key.toLowerCase(),a=n.target,i=a.parentElement
if(("input"!==a.tagName||a.hasAttribute("type"))&&!a.matches(t)){var l="tablist"===i.role||"button"===a.role,s=n.repeat
switch(r){case"arrowleft":case"arrowright":var o,c=[].slice.call(i.children),u=c.indexOf(e.activeElement)
o="arrowright"===r?c[(u+1)%c.length]:c[(u-1+c.length)%c.length],l&&o.focus()
for(var h=i.children.length;o!==e.activeElement&&h--;)(o=("arrowright"===r?o.nextElementSibling:o.previousElementSibling)||("arrowright"===r?i.firstElementChild:i.lastElementChild)).focus()
break
case" ":case"enter":l&&!s&&(n.returnValue=!(!n.preventDefault||!n.preventDefault()),a.click())
break
case"home":case"end":h=i.children.length
do{var d="home"===r?d?d.nextElementSibling:i.firstElementChild:d?d.previousElementSibling:i.lastElementChild
l&&!s&&d.focus()}while(e.activeElement!==d&&h--)d&&d.click()}}},!0)}(document,["text","email","number","search","tel","url","password"].map(function(e){return'input[type="'+e+'"]'}).join(","),new WeakSet)