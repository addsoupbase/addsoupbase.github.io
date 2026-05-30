this.title = 'Sky'
this.desc = 'Sky themed page!!'
this.colors = { morning: '#a6b1ef', dawn: '#8a8687', day: '#229df2', dusk: '#6dadc8', night: '#171628', evening: '#ab7ea7' }
this.dirs = {}
this.keys = Object.keys(colors)
for (let key of keys) {
    dirs[key] = (await inline(`./media/${key}`)).toReversed()
}
return false