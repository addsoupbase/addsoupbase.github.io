 const _avatars = new Set( [   ["aya", "Aya"],
    ["ghostie"],
    ["cunder"],
    ["lorex"],
    ["fourche", 'fourche7'],
    ["rogue"],
    ["indie"],
    ["casey"],
    ["chlo"],
    ["crazy"],
    ["drifter"],
    ["gilly"],
    ["ilikebugs2", "i_likebugs2"],
    ["lunza"],
    ["may"],
    ["mothmaddie"],
    ["neboola"],
    ["znsxxe"],
    ["vio"],
    ["khaotic", "khaotic good"],
    ["kae"],
    ["rohan"],
    ["rainmint"],
    ["rue"],
    ["copy", "CopyID"],
    ["valerie"],
    ["nova", "supernova"],
    ["mr_clownette"],
    ["stu", "Stuella"],
    ["stu2", "Stu"],
    ["ashley"],
    ["lexi"],
    ["babs"],
    ["elipoopsrainbows"],
    ["birdie"],
    ["elenfnf1"],
    ["luna"],
    ['mephistopheles73', 'God ruheub'],
    ['lazy'],
    ['zoozi'],
    ['glente'],
    ['morrfie'],
    ['random', "random_userlol"],
    ["gib"],
    ["rurikuu"],
    ['Regs', 'Regs_s'],
    ["lemmy"],
    ['mila'],
    ["na22","N/A22"],
    ["frannie4u"],
    ["schpun"],
    ['son_yukio']])


const media = new Set([
 'carvanha',
 'corsola',
 'gorebyss',
 'huntail',
 'kyogre',
 'lanturn',
 'lanturnshiny',
 'manaphy',
 'phione',
 'seadra',
 'sharpedo',
 'wailord',
 'luvdisc'
])
const mons = new Set
const avatars = []
media.forEach(o=>{
    //Elem.preload(`../media/${o}.gif`)
    mons.add(`../media/${o}.webp`)

})
_avatars.forEach(o=> {
let filename = `./media/avatars/${o[0]}.webp`,
nickname = o[1]??o[0]
avatars.push({url: filename, nickname})
console.log(avatars)
})
export {avatars, mons}