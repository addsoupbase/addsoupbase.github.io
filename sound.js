!function () {
    'use strict'
    if ('audio' in window) return audio
    const audio = {
        __proto__: null,
        [Symbol.toStringTag]: 'AudioModule',
        loaded: new Set,
        set volume(val) {
            gain.gain.value = val
        },
        get volume() {
            return gain.gain.value
        }
    }
    const ctx = Reflect.construct(window.AudioContext || webkitAudioContext, [])
    audio.context = ctx
    let gain = ctx.createGain()
    gain.connect(ctx.destination)
    const sounds = new Map
    function load(...sources) {
        return Promise.all(sources.map(makeBuffer))
    }
    audio.load = load
    function play(name) {
        let b = sounds.get(name)
        const source = ctx.createBufferSource()
        source.buffer = b
        source.connect(gain).connect(ctx.destination)
        let out = new Promise(resolve => {
            source.addEventListener('ended', resolve, { once: true })
        })
        source.start()
        return out
    }
    audio.play = play
    async function makeBuffer(src) {
        const b = await fetch(src)
        const arrayBuffer = await b.arrayBuffer()
        const buffer = await audio.context.decodeAudioData(arrayBuffer)
        addToSounds(src, buffer)
        return buffer
    }
    function addToSounds(src, buffer) {
        let s = src.split('/').at(-1)
        sounds.set(s, buffer)
        audio.loaded.add(s)
    }
    // function playBackgroundMusic(delay, ...sources) {

    // }
    return Object.defineProperty(constructor.prototype, 'audio', { get() { return audio } }), audio
}()