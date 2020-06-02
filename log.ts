const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const RESET = '\x1b[0m'

export function info (text: string) {
  if (Deno.noColor === false) {
    console.log(`${GREEN}[wexec] [info] ${text}${RESET}`)
  } else {
    console.log(`[wexec] [info] ${text}`)
  }
}

export function warn (text: string) {
  if (Deno.noColor === false) {
    console.log(`${RED}[wexec] [warn] ${text}${RESET}`)
  } else {
    console.log(`[wexec] [warn] ${text}`)
  }
}
