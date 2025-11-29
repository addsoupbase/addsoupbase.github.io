!function () {
    'use strict'
    if (window.audio) return audio
    let globalVolume = 1
    const audio = {
        __proto__: null,
        [Symbol.toStringTag]: 'AudioModule',
        // loaded: new Set,
        set volume(val) {
            for (let a of sounds.values())
                a.volume = val
            globalVolume = val
        },
        get volume() {
            return globalVolume
        }
    }
    // const ctx = Reflect.construct(window.AudioContext || webkitAudioContext, [{
    latencyHint: 'interactive'
    // }])
    // audio.context = ctx
    // let gain = ctx.createGain()
    // gain.connect(ctx.destination)
    const sounds = new Map
    function load(...sources) {
        return Promise.all(sources.map(makeAudio))
    }
    audio.load = load
    function play(name, overlap = true) {
        let b = sounds.get(name)
        if (!b) return Promise.resolve(null)
        if (overlap) {
            let n = b.cloneNode()
            n.play()
            return waitTilFinish(n)
        }
        b.play()
        return waitTilFinish(b)
    }
    function waitTilFinish(n) {
        return new Promise(res => {
            n.onended = e => {
                n.onended = null
                res(e)
            }
        })
    }
    audio.play = play
    async function makeAudio(src) {
        let n = new Audio(src)
        function done() {
            n.oncanplaythrough = n.onerror = null
            addToSounds(src, n)
        }
        return new Promise((res, rej) => {
            n.oncanplaythrough = () => {
                done.call(n)
                res(n)
            }
            n.onerror = e => {
                rej(e)
                done.call(n)
            }
        })
    }
    function addToSounds(src, el) {
        let s = src.split('/').at(-1)
        sounds.set(s, el)
        // audio.loaded.add(s)
    }
    // function playBackgroundMusic(delay, ...sources) {

    // }
    return Object.defineProperty(constructor.prototype, 'audio', { get() { return audio } }),
        Object.freeze(audio)
}()