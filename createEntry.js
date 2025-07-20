import { exists } from "jsr:@std/fs/exists"
// deno run --watch --allow-read --allow-write createEntry.js
function randomColor() { return `#${(Math.floor(Math.random() * 0x1000000)).toString(16).padStart(6, 0)}` }
let dayName = /mon|tue|wed|thu|fri|sat|sun/i
function repDate(day) {
    switch (day.toLowerCase()) {
        case 'mon': return 'Monday'
        case 'tue': return 'Tuesday'
        case 'wed': return 'Wednesday'
        case 'thu': return 'Thursday'
        case 'fri': return 'Friday'
        case 'sat': return 'Saturday'
        case 'sun': return 'Sunday'
    }
}
let monthName = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i
function repMonth(month) {
    switch (month.toLowerCase()) {
        case 'jan': return 'January'
        case 'feb': return 'February'
        case 'mar': return 'March'
        case 'apr': return 'April'
        case 'may': return 'May'
        case 'jun': return 'June'
        case 'jul': return 'July'
        case 'aug': return 'August'
        case 'sep': return 'September'
        case 'oct': return 'October'
        case 'nov': return 'November'
        case 'dec': return 'December'
    }
}
let slashes = /\//g
let today = new Date
    , now = today.toLocaleDateString('en-US').replace(slashes, '_'),
    path = `./entries/${now}/`
if (await exists(path)) throw Error(`Entry already exists for today (${now})`)
let template = await Deno.readFile('./template.html')
let decoder = new TextDecoder('utf-8')
let txt = decoder.decode(template)
    .replace(/DATE_FOR_TODAY/g, today.toDateString().replace(dayName, repDate).replace(monthName, repMonth))
    .replace(/ISO_DATE_TODAY/g, today.toISOString())
    .replace(/\.\/main\.png/g, `https://addsoupbase.github.io/entries/${now}/main.png`)
    .replace(/THEME_COLOR/g, randomColor())
let yesterday = new Date
yesterday.setDate(yesterday.getDate() - 1)
let tomorrow = new Date
tomorrow.setDate(tomorrow.getDate() + 1)
txt = txt
    .replace(/DATE_FOR_YESTERDAY/g, yesterday.toLocaleDateString().replace(slashes, '_').replace(dayName, repDate).replace(monthName, repMonth))
    .replace(/DATE_FOR_TOMORROW/g, tomorrow.toLocaleDateString().replace(slashes, '_').replace(dayName, repDate).replace(monthName, repMonth))
await Deno.mkdir(path)
await Deno.writeTextFile(`${path}/index.html`, txt)
console.log('Created entry for today!')