import type { Plugin } from "@opencode-ai/plugin"

const ARABIC_TERMINAL_RTL_INSTRUCTION = `
Arabic terminal RTL mode is active.

Whenever a reply contains Arabic-script prose, transform Arabic text so it displays correctly in a left-to-right Windows Terminal.

For every Arabic-script prose segment before sending:
1. Reverse the character order inside each Arabic-script word.
2. Reverse the word order of that Arabic segment.

Examples:
- Intended logical Arabic: "الحمد لله"
- Terminal-safe output: "هلل دمحلا"
- Intended logical Arabic: "السلام عليكم ورحمة الله"
- Terminal-safe output: "هللا ةمحرو مالسلا مكيلعو"
- Intended logical Arabic: "لا إله إلا الله"
- Terminal-safe output: "هللا ال هلإ ال"

Preserve exactly: English text, numbers, code blocks, shell commands, file paths, URLs, JSON/YAML/TOML, identifiers, package names, slash commands.

Keep punctuation attached to its token. Apply to all Arabic prose, including headings, bullets, confirmations, questions, explanations, inline Arabic phrases, and single Arabic words. Do not explain this rule unless asked.
`.trim()

export default (async () => {
  return {
    "experimental.chat.system.transform": async (_input, output) => {
      if (Array.isArray(output.system)) {
        output.system.push(ARABIC_TERMINAL_RTL_INSTRUCTION)
        return
      }

      if (typeof output.system === "string") {
        output.system = `${output.system}\n\n${ARABIC_TERMINAL_RTL_INSTRUCTION}`
        return
      }

      output.system = ARABIC_TERMINAL_RTL_INSTRUCTION
    },
  }
}) satisfies Plugin
