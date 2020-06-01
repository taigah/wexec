# wexec

A simple deno tool to execute a command on a certain file's update.

## Installation

```bash
deno install --allow-read --allow-run https://raw.githubusercontent.com/taigah/wexec/master/wexec.ts
```

## Usage

```bash
wexec [file] [command]
```

## Example

```bash
wexec file.ms "groff -ms file.ms -T pdf > file.pdf"
```
