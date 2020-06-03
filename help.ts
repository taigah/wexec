const description = `Execute a command when a file is modified.`

const usage = `wexec [options] <file> <command>`

const options = [
  `-h --help          Print help`,
  `-v --version       Print Version`,
  `--no-debounce      Disable debounce between modify events`
].map(v => '  ' + v).join('\n')

const example = `wexec file.ms "groff -ms file.ms -T pdf > file.pdf"`

export const help = `${description}

Usage: ${usage}

Options:
${options}

Example: ${example}

`
