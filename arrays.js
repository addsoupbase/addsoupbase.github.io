const {from} = Array,
arr = {
    __proto__: null,
    assemble(arrayLike, ...sequence) {
        const out = []
        for (let { length } = sequence, i = 0; i < length; ++i) out.push(arrayLike.at(sequence[i]))
        return out
    },
    with(length, filler) {
        return typeof filler === 'function' ?
            from({ length }, filler) :
            Array(length).fill(filler)
    },
    *backwards(arrayLike) {
        for (let { length } = arrayLike; length--;) yield arrayLike[length]
    },
    center(array) {
        return array[(array.length / 2) | 0]
    },
    insert(array, item, index) {
        return array.splice(index, 0, item)
    },
    remove(item, index) {
        return typeof item === 'string' ?
            item.slice(0, index) + item.slice(index + 1) :
            item.splice(index, 1)
    },
    swap(item, first, second) {
        [item[first], item[second]] = [item[second], item[first]]
        return item
    },
    swapInside(item, firstIndex, secondIndex) {
        const slot = item.indexOf(firstIndex),
            slot2 = item.indexOf(secondIndex)
        if (slot !== -1 && slot2 !== -1) return item.swap(slot, slot2)
        throw RangeError("Index out of range")
    }
}
export default arr