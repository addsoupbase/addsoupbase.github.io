import { exists } from "jsr:@std/fs/exists"
// deno run --watch --allow-read --allow-write createEntry.js
let today = new Date
    , now = today.toLocaleDateString('en-US').replace(/\//g, '_'),
    path = `./entries/${now}/`
if (await exists(path)) throw Error(`Entry already exists for today (${now})`)
let template = await Deno.readFile('./template.html')
let decoder = new TextDecoder('utf-8')
let txt = decoder.decode(template)
    .replace(/DATE_FOR_TODAY/g, today.toDateString())
    .replace(/ISO_DATE_TODAY/, today.toISOString())
    .replace(/\.\/main\.png/g,`https://addsoupbase.github.io/entries/${now}/main.png`)
    await Deno.mkdir(path)
await Deno.writeTextFile(`${path}/index.html`, txt)
console.log('Created entry for today!')