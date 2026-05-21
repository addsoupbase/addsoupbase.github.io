this.getSrc = function getSrc(date) {
    return `./entries/${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}/index.html`
}
this.formatDate = function formatDate(date) {
    var day = daysOfTheWeek[date.getDay()]
    var month = monthsOfTheYear[date.getMonth()]
    return day + ', ' + month + ' ' + date.getDate() + ', ' + date.getFullYear()
}
this.pathToDate = function pathToDate(path) {
    let [month, day, year] = path.split('_')
    return new Date(year, month - 1, day)
}
this.today = (await inline('~/entries')).sort((a, b) => pathToDate(a) - pathToDate(b)).at(-1)
this.daysOfTheWeek = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')
this.monthsOfTheYear = 'January February March April May June July August September October November December'.split(' ')
this.dates = (await inline('~/entries')).map(o => {
    let [month, day, year] = o.split('_')
    return new Date(year, month - 1, day)
}).sort((a, b) => b - a)
this.last = dates[0]
this.first = dates.at(-1)
this.firstISO = first.toISOString().slice(0, 10)
this.lastISO = last.toISOString().slice(0, 10)
this.firstSrc = getSrc(first)
this.lastSrc = getSrc(last)