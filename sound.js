!function () {
    'use strict'
    if (window.audio) return audio
    let volume = 1
    let all = new Set
    const audio = {
        __proto__: null,
        [Symbol.toStringTag]: 'AudioModule',
        // loaded: new Set,
        set volume(val) {
            volume = Math.min(Math.max(val, 0), 1)
            all.forEach(setVolume)
            for (let snd of sounds.values()) setVolume(snd)
        },
        get volume() {
            return volume
        }
    }
    function setVolume(v) {
        v.setAttribute('volume', v.volume = volume * (v.dataset.volumecontrol ?? 1), 1)
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
    function play(name, overlap = true, volumeMultipler = 1) {
        let b = sounds.get(name)
        if (!b) return Promise.resolve(null)
        if (overlap) {
            let n = b.cloneNode()
            n.setAttribute('data-volumecontrol', volumeMultipler)
            setVolume(n)
            n.play()
            all.add(n)
            return waitTilFinish(n)
        }
        b.setAttribute('data-volumecontrol', volumeMultipler)
        setVolume(b)
        b.play()
        return waitTilFinish(b)
    }
    function waitTilFinish(n) {
        return new Promise(res => {
            n.onended = e => {
                n.onended = null
                all.delete(n)
                res(e)
            }
        })
    }
    audio.play = play
    async function makeAudio(src) {
        let n = new Audio(src)
        n.preload='auto'
        n.load()
        setVolume(n)
        function done() {
            n.oncanplaythrough = n.onerror = null
            addToSounds(src, n)
        }
        if (n.readyState === 4) { 
            done.call(n)
            return Promise.resolve()
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
    let out = (Object.defineProperty(constructor.prototype, 'audio', { get() { return audio } }),
        Object.freeze(audio))
    dispatchEvent(new Event('audio-loaded'))
    return out
}()