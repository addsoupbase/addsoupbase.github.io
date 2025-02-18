let n = await Array.fromAsync(Deno.readDir('./'), ({ name }) => name).filter(o=>o.includes('.png'))
n.forEach(path => {
    let cmd = new Deno.Command('cwebp',
        {
            args: [path, '-lossless', '-o', path.replace('.png', '.webp')]
        }
    )
    cmd.output()
})