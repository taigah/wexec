export const help = `Execute a command when a file is modified.

Usage: wexec [options] <file> <command>

Options:
  -h --help       Print help
  --no-debounce   Disable debounce between modify events

Example: wexec file.ms "groff -ms file.ms -T pdf > file.pdf"

`