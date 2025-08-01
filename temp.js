
let img = /<img/g;
(await Array.fromAsync(await Deno.readDir('./entries'))).forEach(thing)

async function thing(dir) {
    let path = `./entries/${dir.name}/index.html`
    let text = await Deno.readTextFile(path)
    text = text.replace(img, addThing)
    Deno.writeTextFile(path, text)
}
function addThing(o) {
    return '<img loading="lazy" decoding="async"'
}