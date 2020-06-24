# wexec

A simple deno tool for executing a command on file change.

## Installation

```bash
deno install --allow-read --allow-run --unstable https://raw.githubusercontent.com/taigah/wexec/master/wexec.ts
```

(Note: the `--unstable` flag is needed for `Deno.kill`)

## Usage

```bash
wexec [file or directory] [command]
```

## Example

```bash
wexec file.ms "groff -ms file.ms -T pdf > file.pdf"
```
