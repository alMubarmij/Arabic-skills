/**
 * BiDi Shim Plugin for opencode
 *
 * Visual rendering fix for terminals lacking BiDi support.
 * Reverses Arabic text character-by-character so it appears
 * correctly when the terminal renders everything LTR.
 *
 * Rules:
 * - Arabic lines: full character reversal (handles word order + letter order)
 * - English-only lines: unchanged
 * - Mixed lines: reverse only Arabic segments
 * - Slash commands: unchanged
 */

const ARABIC_RANGES: [number, number][] = [
  [0x0600, 0x06FF], // Arabic
  [0x0750, 0x077F], // Arabic Supplement
  [0x08A0, 0x08FF], // Arabic Extended-A
  [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
  [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
];

const ARABIC_CHARS = new Set([
  0x060c, // Arabic comma
  0x061b, // Arabic semicolon
  0x061f, // Arabic question mark
  0x0640, // Arabic tatweel
  0x060d, // Arabic date separator
  0x0600, // Arabic number sign
  0x0601, // Arabic sign Sanah
  0x0602, // Arabic footnote marker
  0x0603, // Arabic sign Safha
  0x0604, // Arabic sign Samna
  0x0605, // Arabic number mark above
  0x0606, // Arabic sign Umm al-Qura
  0x0607, // Arabic sign Ilkhchi
  0x0608, // Arabic Ray
  0x0609, // Arabic percent sign
  0x060a, // Arabic DecimalFormatSign
  0x060b, // Arabic Afghani sign
  0x060e, // Arabic poetic sign
  0x060f, // Arabic sign Sajda
  0x0610, // Arabic sign Harf Anshan
  0x0611, // Arabic sign Takhallus
  0x0612, // Arabic sign Hawazin
  0x0613, // Arabic sign Tahlil
  0x0614, // Arabic sign Tafdil
  0x0615, // Arabic sign Taa marbuta underline
  0x0616, // Arabic sign Wavy Hamza above
  0x0617, // Arabic sign Wavy Hamza below
  0x0618, // Arabic Fatha underline
  0x0619, // Arabic Damma underline
  0x061a, // Arabic Kasra underline
  0x06dd, // Arabic End of Ayah
  0x06de, // Arabic Start of Rub El Hizb
  0x06df, // Arabic Sign Small High Rounded Zero
  0x06e0, // Arabic Sign Small High Upright Rectangular Zero
  0x06e1, // Arabic Sign Small High Dotless Head of Khah
  0x06e2, // Arabic Sign Small High Meem Isolated Form
  0x06e3, // Arabic Sign Small Low Meem
  0x06e4, // Arabic Sign Small Waw
  0x06e5, // Arabic Small Waw
  0x06e6, // Arabic Small Yaa
  0x06e7, // Arabic Sign Small High Yaa
  0x06e8, // Arabic Sign Small High Noon
  0x06e9, // Arabic Sign Place of Sajda
  0x06ea, // Arabic Sign Empty Circle Low
  0x06eb, // Arabic Sign Empty Circle Low Fill
  0x06ec, // Arabic Sign Rounded Noon above
  0x06ed, // Arabic Sign Low Small Meem
]);

function isArabic(char: string): boolean {
  const cp = char.codePointAt(0)!;
  for (const [start, end] of ARABIC_RANGES) {
    if (cp >= start && cp <= end) return true;
  }
  if (ARABIC_CHARS.has(cp)) return true;
  if (cp >= 0x0660 && cp <= 0x0669) return true; // Arabic-Indic digits
  if (cp >= 0x06F0 && cp <= 0x06F9) return true; // Extended Arabic-Indic digits
  return false;
}

function hasArabic(text: string): boolean {
  for (const ch of text) {
    if (isArabic(ch)) return true;
  }
  return false;
}

function isSlashCommand(text: string): boolean {
  return /^\s*\/\w/.test(text);
}

function reverseString(str: string): string {
  return [...str].reverse().join('');
}

function bidiTransform(text: string): string {
  if (!text || !hasArabic(text) || isSlashCommand(text)) return text;

  // Pure Arabic: full reversal handles both word order + letter order
  if ([...text].every(ch => isArabic(ch) || ch === ' ' || ch === '\t')) {
    return reverseString(text);
  }

  // Mixed Arabic/English: reverse only Arabic segments
  const segments: { isArabic: boolean; text: string }[] = [];
  let current = '';
  let currentIsArabic: boolean | null = null;

  for (const ch of text) {
    const chIsArabic = isArabic(ch);
    if (currentIsArabic !== null && chIsArabic !== currentIsArabic) {
      segments.push({ isArabic: currentIsArabic, text: current });
      current = '';
    }
    currentIsArabic = chIsArabic;
    current += ch;
  }
  if (current) {
    segments.push({ isArabic: currentIsArabic!, text: current });
  }

  // Reverse segment order, then reverse characters within Arabic segments
  segments.reverse();
  for (const seg of segments) {
    if (seg.isArabic) {
      seg.text = reverseString(seg.text);
    }
  }

  return segments.map(s => s.text).join('');
}

export default (async () => {
  return {
    "experimental.chat.messages.transform": (input: any, output: any) => {
      if (output?.messages && Array.isArray(output.messages)) {
        for (const msg of output.messages) {
          if (typeof msg.content === 'string') {
            msg.content = bidiTransform(msg.content);
          }
          if (Array.isArray(msg.content)) {
            for (const part of msg.content) {
              if (part.type === 'text' && typeof part.text === 'string') {
                part.text = bidiTransform(part.text);
              }
            }
          }
        }
      }
    },
  };
}) satisfies Plugin;
