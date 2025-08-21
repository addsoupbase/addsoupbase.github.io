'use strict'
console.log("Script loaded")
for(let i = 3e9; i--;);
function load(){document.getElementById('domcontentloaded').textContent='DOMContentLoaded event fired.'}
console.log('Script done')
addEventListener('load', ()=>document.getElementById('load').textContent = 'Load event fired.')
document.readyState !== 'complete' ? document.addEventListener('DOMContentLoaded',load) : load()