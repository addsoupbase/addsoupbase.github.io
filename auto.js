/*

deno run --allow-read --allow-write auto.js

*/
const all = await Array.fromAsync(Deno.readDir('./media/avatars'), ({name})=>name)
Deno.writeTextFile('./allava.json',JSON.stringify(all))
console.log(`Wrote ${all.length} avatars`)