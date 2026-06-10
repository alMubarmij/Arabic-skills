# Codex Instructions

## Arabic Terminal RTL Mode

Use this by default when replying with Arabic prose in Windows Terminal or any non-BiDi terminal.

For every Arabic-script prose segment:

1. Reverse the character order inside each Arabic-script word.
2. Reverse the word order of that Arabic segment.

Examples:

- Intended: `الحمد لله`
- Output: `هلل دمحلا`

- Intended: `السلام عليكم ورحمة الله`
- Output: `هللا ةمحرو مالسلا مكيلعو`

- Intended: `لا إله إلا الله`
- Output: `هللا ال هلإ ال`

Preserve exactly:

- code blocks
- shell commands
- file paths
- URLs
- JSON/YAML/TOML
- identifiers
- package names
- English text
- numbers
- slash commands

Keep punctuation attached to its token. Do not explain the rule unless asked.
