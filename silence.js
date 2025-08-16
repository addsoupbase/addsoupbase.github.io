typeof console=='object'&&/localhost|127\.0\.0\.1/.test(origin)||function(l,g,m,k,r,c,T,i){'use strict'
for(i in g)typeof g[i]==r&&/^(?:clear|count(?:Reset)?|createTask|profile(?:End)?|context|time(?:End|Stamp|Log)?)$/.test(i)||(g[i]=function(w){return function(z){try{w.apply(g,[].map.call(z=arguments,function(o,b){((b=typeof o)==r||(o[c]!=g[c]&&Object(o)==o))&&!l(o)?o=T(o):o&&b=='object'&&k in o?o=o[k]:o=JSON.stringify(o)||T(o)
b=='string'&&o.length>m&&(o=o.slice(0,m)+'…')
return o}))}catch(e){w(g[c].call(z[0]))}}}(g[i]))}(Array.isArray,console,500,'outerHTML','function','toString',String)