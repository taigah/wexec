const [ file, command ] = Deno.args

async function run (command: string): Promise<string> {
  const proc = Deno.run({
    cmd: ['sh', '-c', command],
    stdin: 'null',
    stdout: 'piped',
    stderr: 'null'
  })
  const output = new TextDecoder().decode(await proc.output())
  proc.close()
  return output
}

while (true) {
  const watcher = Deno.watchFs(file)
  
  a:
  for await (const event of watcher) {
    switch (event.kind) {
      case 'modify':
        console.log('file updated')
        console.log(await run(command))
        break
      case 'remove':
        break a
    }
  }
}
