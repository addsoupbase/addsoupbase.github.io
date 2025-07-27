[].forEach.call(document.querySelectorAll('img,button[type="image"]'), o => {
    o = $(o)
    let hasAlt = 'alt' in o.attr,
        hasTitle = 'title' in o.attr
    if (hasAlt && !hasTitle)
        o.attr.title = o.attr.alt
    else if (hasTitle && !hasAlt)
        o.attr.alt = o.attr.title
    else if (!(hasTitle || hasAlt)) {
        o.attr._hidden = 'true' // Screen readers might literally read the src attribute as words
        console.warn('Missing alt or title attribute:', o.outerHTML)
    }
});
[].forEach.call(document.querySelectorAll('video,audio'), o=> {
    if (o.getAttribute('preload') !== 'auto') console.warn('Found media element without preload attribute',o)
})