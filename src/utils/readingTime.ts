// Average silent reading speed for English non-fiction, from Brysbaert's 2019
// meta-analysis of 190 studies ("How many words do we read per minute?").
const PROSE_WORDS_PER_MINUTE = 238;
// Code is denser and read more slowly than prose. Half speed is an estimate.
const CODE_WORDS_PER_MINUTE = PROSE_WORDS_PER_MINUTE / 2;

const FENCED_CODE_BLOCK = /^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm;
const MDX_IMPORT_OR_EXPORT = /^\s*(import|export)\s.*$/gm;
const TAG = /<[^>]+>/g;

// Counts runs of letters or digits, so Markdown syntax like `##` and `-` isn't read as words.
const countWords = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu)?.length ?? 0;

/**
 * Estimates how many minutes it takes to read an MDX post body.
 * Prose and fenced code are timed separately, and the result rounds up to at least one minute.
 */
export const getReadingMinutes = (body: string) => {
  const codeBlocks = [...body.matchAll(FENCED_CODE_BLOCK)].map((match) => match[2]);
  const prose = body.replace(FENCED_CODE_BLOCK, " ").replace(MDX_IMPORT_OR_EXPORT, " ").replace(TAG, " ");

  const minutes =
    countWords(prose) / PROSE_WORDS_PER_MINUTE +
    countWords(codeBlocks.join("\n")) / CODE_WORDS_PER_MINUTE;

  return Math.max(1, Math.ceil(minutes));
};
