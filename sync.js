!function (l) {
    'use strict'
    let [hash, data, otherLoc] = JSON.parse(decodeURIComponent(location.hash.slice(1)))
    while (hash.endsWith('/')) hash = hash.slice(0, -1)
    while (otherLoc.endsWith('/')) otherLoc = otherLoc.slice(0, -1)
    let key = `${hash}~0`
    l[`${otherLoc}~0`] = data
    l[key] ||= `0 0`
    if (parent === window) return
    top.postMessage([l[key], dex], '*') // need to communicate synchronously but this doesn't update frame.src
}(localStorage)