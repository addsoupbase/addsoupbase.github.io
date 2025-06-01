const {random,floor} = Math,
{from} = Array,
{ fromCodePoint } = String
class Random {
    get coin() {
        return !this.choose(0,1)
    }
    get invert() {
        return this.choose(1, -1)
    }
    choose(...deck) {
        return deck[floor(random() * deck.length)]
    }
    chooseFrom(deck) {
        return this.choose.apply(0, deck)
    }
    jackpot(range) {
        return !this.frange(0, range)
    }
    chance(odds) {
        return this.jackpot(100 / odds)
    }
    range(MIN, MAX) {
        return random() * (MAX - MIN) + MIN
    }
    frange(MIN, MAX) {
        return floor(this.range(MIN, MAX))
    }
    get ran() {
        return random()
    }
    get pseudo() {
        return performance.now() % 1e3 / 1e3
    }
    get pseudo2() {
        return Date.now() % 1e3 / 1e3
    }
    get crypto() {
        return crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff
    }
    shuffle(...item) {
        for (let i = 0, { length } = item; i < length; ++i) {
            const pick = floor(random() * (i + 1));
            ({0:item[i], 1:item[pick]} = [item[pick], item[i]])
        }
        return item
    }
    gen(length = 6) {
        return from({ length }, this.#gen).join('')
    }
    #gen() {
        return fromCodePoint(floor(random() * 0x110000))
    }
    randomizer(charCount = 6) {
        return new Proxy({ charCount }, { get: this.#randomizer })
    }
    #randomizer(target, prop) {
        return target[prop] ??= this.gen(target.charCount)
    }
}
export default new Random