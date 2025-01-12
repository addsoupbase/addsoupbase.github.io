import $, { wait } from './quick.js'
const main = $('main,center cute-green', { parent: document.body, id: 'main', })
main.fadein()
let div = $("section", {
    parent: main
})
$('a,cute-green-button back', {
    parent: main,
    txt: 'Back',
    href: 'main.html',
})

let desc = $('div', { parent: div, id: 'maindesc' })
main.styleMe({opacity:0})
await wait(600)
main.fadein()
main.styleMe({opacity:.95})

$('div,descrHolder', {
    parent: desc,
    os: [$("p", { txt: 'My name is...' }), $("h1", { txt: 'Misha' }), $('i,small', {txt:'Миша'})]
})
$('div,descrHolder', {
    parent: desc,
    os: [$("p", { txt: 'I am...' }), $("h1", { txt: '17 years old' }),$('i,small',{txt:'June 17, 2007'})]
})
$('h3', {
    txt:'Fav pokemon:',
    parent:main
})
let pokemonholder = $('div',{id:'pokemonholder',parent:main, 
os: ['spinda','misdreavus','mawile','delcatty','masquerain','shedinja','clamperl','swoobat','gourgeist','minior','pheromosa'].map(o=>$('img,pkm',{alt:o,title:o,src:`./media/${o}_.webp`}))
});

/*$("h2", {
    parent:main,
    txt:'Things I like'
})
$('ul', {
    id: 'list',
    parent:main,
    os: ['pokémon', 'HYPER PEOPLE','sparkly stuff'].map(o=>$('li', {
        txt: o,
        id: o.replaceAll(' ','')
    }))
})*/