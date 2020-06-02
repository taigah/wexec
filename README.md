# wexec

A simple deno tool for executing a command on file modification.

## Installation

```bash
deno install --allow-read --allow-run https://raw.githubusercontent.com/taigah/wexec/master/wexec.ts
```

## Usage

```bash
wexec [file or directory] [command]
```

## Example

```bash
wexec file.ms "groff -ms file.ms -T pdf > file.pdf"
```
