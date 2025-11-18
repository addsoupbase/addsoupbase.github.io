/**
* 
* @param {int} width 
* @param {int} height 
* @param {int} cols 
* @param {int} rows 
* @param {int} x 
* @param {int} y 
* @returns [x, y, width, height]
*/
export function cell(width, height, cols, rows, x, y) {
    // mainly meant for the drawImage function (spread at arguments[1])
    let h = height / rows
        , w = width / cols
    return [ //Uint16Array.of(
        w * x % width, h * y % height, w, h
    ]
    //)
}