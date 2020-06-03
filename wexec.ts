import { info, warn } from './log.ts'
import { help } from './help.ts'
import { VERSION } from './version.ts'

if (Deno.args.includes('-h') || Deno.args.includes('--help')) {
  console.log(help)
  Deno.exit()
}

if (Deno.args.includes('-v') || Deno.args.includes('--version')) {
  console.log(`v${VERSION}`)
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

type Process = Deno.Process & { alive: boolean }

function run (command: string): Process {
  info(`starting \`${command}\``)
  const proc = Deno.run({
    cmd: ['sh', '-c', command],
    stdin: 'null',
    stdout: 'inherit',
    stderr: 'inherit'
  }) as Process
  proc.status().then(status => {
    proc.close()
    proc.alive = false
    // the process was killed
    if (status.signal !== undefined) return

    if (status.success) {
      info(`clean exit - waiting for changes before restart`)
    } else {
      warn(`command failed - waiting for changes before restart`)
    }
  })
  proc.alive = true
  return proc
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

const SIGTERM = 15
let proc = run(command)

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
  
  for await (const event of watcher) {
    if (event.kind === 'remove') break
    if (event.kind === 'modify') {
      if (noDebounce === false && debounce.try() === false) continue
      info('restarting due to changes...')
      if (proc.alive) {
        proc.kill(SIGTERM)
      }
      proc = run(command)
    }
  }
}
