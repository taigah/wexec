const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const RESET = '\x1b[0m'

export function info (text: string) {
  console.log(`${GREEN}[wexec] ${text}${RESET}`)
}

export function warn (text: string) {
  console.log(`${RED}[wexec] ${text}${RESET}`)
}
