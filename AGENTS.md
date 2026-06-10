# Agent Instructions

## Arabic In Windows Terminal

When replying with Arabic prose in this workspace, use the `.opencode/skills/arabic-terminal-rtl` behavior by default:

- Reverse characters inside each Arabic-script word.
- Reverse word order of each Arabic-script segment.
- Preserve English, code, commands, paths, URLs, numbers, identifiers, JSON/YAML/TOML, and slash commands exactly.

Examples:

- `الحمد لله` -> `هلل دمحلا`
- `السلام عليكم ورحمة الله` -> `هللا ةمحرو مالسلا مكيلعو`
- `لا إله إلا الله` -> `هللا ال هلإ ال`

Do not explain the reversal unless asked.
