import { info, warn } from './log.ts'
import { help } from './help.ts'

if (Deno.args.includes('-h') || Deno.args.includes('--help')) {
  console.log(help)
  Deno.exit()
}

const noDebounce = Deno.args.includes('--no-debounce')

const args: Array<string> = []

for (const arg of Deno.args) {
  if (arg[0] === '-') continue
  args.push(arg)
}

if (args.length !== 2) {
  console.error(`Bad number of arguments, excepted 2 and got ${args.length}`)
  Deno.exit()
}

const [ file, command ] = args

async function run (command: string) {
  info(`starting \`${command}\``)
  const proc = Deno.run({
    cmd: ['sh', '-c', command],
    stdin: 'null',
    stdout: 'inherit',
    stderr: 'inherit'
  })
  const status = await proc.status()
  proc.close()
  if (status.success) {
    info(`clean exit - waiting for changes before restart`)
  } else {
    warn(`command failed - waiting for changes before restart`)
  }
}

const debounce = {
  until: 0,
  try () {
    const now = Date.now()
    // 10ms cooldown
    const ok = now >= this.until + 10
    this.until = now
    return ok
  }
}

await run(command)

while (true) {
  let watcher
  try {
    watcher = Deno.watchFs(file)
  } catch (err) {
    if (err.constructor === Deno.errors.NotFound) {
      console.error(`File '${file}' not found`)
      Deno.exit(1)
    }
    throw err
  }
  
  let cooldown = 0
  a:
  for await (const event of watcher) {
    switch (event.kind) {
      case 'modify':
        if (noDebounce === false && debounce.try() === false) continue
        // 10ms cooldown
        cooldown = Date.now() + 10
        info('restarting due to change...')
        await run(command)
        break
      case 'remove':
        break a
    }
  }
}
