!async function (l, d) {
    'use strict'
    let { 0: hash, 1: data, 2: otherLoc } = JSON.parse(decodeURIComponent(location.hash.slice(1)))
    function trim(h) {
        while (h.endsWith('/')) h = h.slice(0, -1)
        return h
    }
    hash = trim(hash)
    otherLoc = trim(otherLoc)
    let key = `${hash}~0`
    let pad = `;path=${location.pathname};SameSite=None;Secure;partitioned;max-age=31536000`
    d.cookie = `${otherLoc}~0=${data}${pad}`
    d.cookie.includes(key) || (d.cookie = `${key}=${l[key] || '0 0'}${pad}`)
    if (parent === window) return
    top.postMessage([(await cookieStore.get(key)).value, dex], '*')
}(localStorage,document)
