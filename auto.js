/*

deno run --allow-read --allow-write auto.js

*/
const all = await Array.fromAsync(Deno.readDir('./media/avatars'), ({name})=>name)
Deno.writeTextFile('./scripts/allava.json',JSON.stringify(all))
console.log(`Wrote ${all.length} avatars`)