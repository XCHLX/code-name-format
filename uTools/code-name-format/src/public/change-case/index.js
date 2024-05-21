/**
 * 变量格式化
 */

const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
const SPLIT_REPLACE_VALUE = '$1\0$2';
const DEFAULT_PREFIX_SUFFIX_CHARACTERS = '';
function split(value) {
  let result = value.trim();
  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
  result = result.replace(DEFAULT_STRIP_REGEXP, '\0');
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === '\0') start++;
  if (start === end) return [];
  while (result.charAt(end - 1) === '\0') end--;
  return result.slice(start, end).split(/\0/g);
}
function splitSeparateNumbers(value) {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match) {
      const offset = match.index + (match[1] ?? match[2]).length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}
function noCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? ' ') + suffix;
}
function camelCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters
    ? capitalCaseTransformFactory(lower, upper)
    : pascalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return lower(word);
        return transform(word, index);
      })
      .join(options?.delimiter ?? '') +
    suffix
  );
}
function pascalCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters
    ? capitalCaseTransformFactory(lower, upper)
    : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map(transform).join(options?.delimiter ?? '') + suffix;
}
function pascalSnakeCase(input, options) {
  return capitalCase(input, { delimiter: '_', ...options });
}
function capitalCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  return prefix + words.map(capitalCaseTransformFactory(lower, upper)).join(options?.delimiter ?? ' ') + suffix;
}
function constantCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(upperFactory(options?.locale)).join(options?.delimiter ?? '_') + suffix;
}
function dotCase(input, options) {
  return noCase(input, { delimiter: '.', ...options });
}
function kebabCase(input, options) {
  return noCase(input, { delimiter: '-', ...options });
}
function pathCase(input, options) {
  return noCase(input, { delimiter: '/', ...options });
}
function sentenceCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = capitalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return transform(word);
        return lower(word);
      })
      .join(options?.delimiter ?? ' ') +
    suffix
  );
}
function snakeCase(input, options) {
  return noCase(input, { delimiter: '_', ...options });
}
function trainCase(input, options) {
  return capitalCase(input, { delimiter: '-', ...options });
}
function lowerFactory(locale) {
  return locale === false ? input => input.toLowerCase() : input => input.toLocaleLowerCase(locale);
}
function upperFactory(locale) {
  return locale === false ? input => input.toUpperCase() : input => input.toLocaleUpperCase(locale);
}
function capitalCaseTransformFactory(lower, upper) {
  return word => `${upper(word[0])}${lower(word.slice(1))}`;
}
function pascalCaseTransformFactory(lower, upper) {
  return (word, index) => {
    const char0 = word[0];
    const initial = index > 0 && char0 >= '0' && char0 <= '9' ? '_' + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };
}
function splitPrefixSuffix(input, options = {}) {
  const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;
  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char)) break;
    prefixIndex++;
  }
  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char)) break;
    suffixIndex = index;
  }
  return [input.slice(0, prefixIndex), splitFn(input.slice(prefixIndex, suffixIndex)), input.slice(suffixIndex)];
}
module.exports.noCase = noCase;
module.exports.camelCase = camelCase;
module.exports.pascalCase = pascalCase;
module.exports.pascalSnakeCase = pascalSnakeCase;
module.exports.constantCase = constantCase;
module.exports.dotCase = dotCase;
module.exports.kebabCase = kebabCase;
module.exports.pathCase = pathCase;
module.exports.sentenceCase = sentenceCase;
module.exports.snakeCase = snakeCase;
module.exports.trainCase = trainCase;
module.exports.capitalCase = capitalCase;
