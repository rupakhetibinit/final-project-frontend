import { Tweet } from "@/pages/api/gettweets";

export function preprocessStrings(strings: string[]): string[] {
  const regexEmoji =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{23CF}\u{23E9}-\u{23F4}\u{231A}-\u{231B}\u{25FD}-\u{25FE}\u{21A9}-\u{21AA}\u{3030}\u{303D}\u{3297}\u{3299}\u{fe0f}]/gu;
  const regexUrl = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;

  return strings.map(
    (str) =>
      str
        .replace(regexEmoji, "") // Remove emojis
        .replace(regexUrl, "") // Remove URLs
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing whitespace
  );
}

export function countWords(
  strings: string[]
): { text: string; value: number }[] {
  const wordsMap = new Map<string, number>();

  const stopWords = new Set([
    "i",
    "the",
    "and",
    "a",
    "to",
    "in",
    "of",
    "that",
    "for",
    "with",
    "on",
    "was",
    "is",
    "by",
    "at",
    "be",
    "this",
    "an",
    "as",
    "which",
    "it",
    "or",
    "from",
    "not",
    "are",
    "but",
    "have",
    "they",
    "you",
    "were",
    "been",
    "has",
    "we",
    "can",
    "when",
    "do",
    "if",
    "out",
    "no",
    "up",
    "what",
    "so",
    "about",
    "who",
    "into",
    "than",
    "them",
    "could",
    "its",
    "then",
    "other",
    "their",
    "some",
    "these",
    "her",
    "him",
    "one",
    "our",
    "man",
    "said",
    "all",
    "would",
    "there",
    "will",
    "or",
    "did",
    "been",
    "made",
    "much",
    "more",
    "should",
    "like",
    "any",
    "being",
    "than",
    "before",
    "too",
    "such",
    "back",
    "same",
    "because",
    "here",
    "well",
    "how",
    "just",
    "most",
    "me",
    "am",
    "much",
    "off",
    "now",
    "around",
    "over",
    "then",
    "many",
    "even",
    "down",
    "still",
    "them",
    "where",
    "therefore",
    "whereas",
    "whereby",
  ]);

  strings.forEach((str) => {
    const words = str.split(/\s+/); // Split into words using whitespace as delimiter

    words.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      if (!stopWords.has(lowercaseWord)) {
        if (wordsMap.has(lowercaseWord)) {
          wordsMap.set(lowercaseWord, wordsMap.get(lowercaseWord)! + 1); // Increment count for existing word
        } else {
          wordsMap.set(lowercaseWord, 1); // Add new word to map
        }
      }
    });
  });

  const wordsArray = Array.from(wordsMap, ([text, value]) => ({ text, value }));

  return wordsArray;
}

export function countWordsInTweets(
  tweets: Tweet[]
): { text: string; value: number }[] {
  const allStrings = tweets.map((tweet) => tweet.tweet);
  const preStrings = preprocessStrings(allStrings);
  const wordsArray = countWords(preStrings);
  const sortedArray = wordsArray.sort((a, b) => b.value - a.value);
  const top50Words = sortedArray.slice(0, 50);
  return top50Words;
}
