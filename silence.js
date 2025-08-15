typeof console=='object'&&/localhost|127\.0\.0\.1/.test(location.host)||function(l,g,m,k,x,r,c,T){'use strict'
setInterval(g.clear,18e4)
for(var i in g){if(typeof g[i]!=r||x.test(i))continue
g[i]=function(w){return function(z){try{w.apply(g,[].map.call(z=arguments,function(o,b){((b=typeof o)==r||(o[c]!={}[c]&&Object(o)==o))&&!l(o)?o=T(o):o&&b=='object'&&k in o?o=o[k]:o instanceof RegExp?o.source:o=JSON.stringify(o)||T(o)
typeof o=='string'&&o.length>m&&(o=o.slice(0,m)+'…')
return o}))}catch(e){w({}[c].call(z[0]))}}}(g[i])}}(Array.isArray,console,500,'outerHTML',/^(?:clear|count(?:Reset)?|createTask|profile(?:End)?|context|time(?:End|Stamp|Log)?)$/,'function','toString',String)// Since logging prevents objects from being garbage collected: