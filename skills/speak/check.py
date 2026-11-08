# /// script
# requires-python = ">=3.11"
# ///
import re
import sys
from collections import Counter
from pathlib import Path

# Note (nickhuo): Ogden's rules let operators and pronouns conjugate in full, so their irregular forms count as in-list.
IRREGULAR_FORMS = {
    "be": "am is are was were been being",
    "do": "does did done doing",
    "have": "has had having",
    "come": "came",
    "get": "got gotten",
    "give": "gave given",
    "go": "goes went gone",
    "keep": "kept",
    "make": "made",
    "take": "took taken",
    "say": "said",
    "see": "saw seen",
    "send": "sent",
    "may": "might",
    "will": "would",
    "a": "an",
    "this": "these",
    "that": "those",
    "much": "more most",
    "i": "me my mine myself",
    "he": "him his himself she her hers herself it its itself they them their theirs themselves",
    "you": "your yours yourself yourselves we us our ours ourselves",
    "who": "whom whose",
}
# Note (nickhuo): Ogden's rules keep numerals, measurement, currency and calendar words in normal English form.
NUMBER_AND_CALENDAR = (
    "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen"
    " seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million"
    " billion third fourth fifth sixth seventh eighth ninth tenth half percent dollar cent"
    " monday tuesday wednesday thursday friday saturday sunday january february march april june july august"
    " september october november december"
)
SUFFIXES = [
    ("ies", "y"), ("es", ""), ("s", ""),
    ("ied", "y"), ("ed", ""), ("ed", "e"),
    ("ing", ""), ("ing", "e"),
    ("ier", "y"), ("er", ""), ("er", "e"),
    ("iest", "y"), ("est", ""), ("est", "e"),
    ("ily", "y"), ("ly", ""),
]
CONTRACTION_TAILS = {"n't", "'m", "'s", "'re", "'ve", "'ll", "'d"}


def main(text_path: Path) -> None:
    word_list_path = Path(__file__).with_name("words.txt")
    basic_words: set[str] = set()
    for line in word_list_path.read_text().splitlines():
        if line.startswith("#") or not line.strip():
            continue
        basic_words.update(variant.strip().lower() for variant in line.split("/"))
    for base, forms in IRREGULAR_FORMS.items():
        assert base in basic_words, base
        basic_words.update(forms.split())
    basic_words.update(NUMBER_AND_CALENDAR.split())

    def is_inflected(word: str) -> bool:
        if word in basic_words:
            return True
        for suffix, replacement in SUFFIXES:
            if not word.endswith(suffix) or len(word) - len(suffix) < 2:
                continue
            stem = word[: -len(suffix)] + replacement
            # Note (nickhuo): stopped, running and bigger double the last consonant before the suffix.
            undoubled = stem[:-1] if len(stem) > 2 and stem[-1] == stem[-2] else stem
            if stem in basic_words or undoubled in basic_words:
                return True
            # Note (nickhuo): derived nouns take a plural too, like workers or meetings.
            if suffix in ("s", "es") and is_inflected(stem):
                return True
        return word.startswith("un") and is_inflected(word[2:])

    def is_basic(word: str) -> bool:
        if is_inflected(word):
            return True
        # Note (nickhuo): Ogden allows compounds of two list words (milkman, sundown); parts under two letters match too much by chance.
        return any(is_inflected(word[:i]) and is_inflected(word[i:]) for i in range(2, len(word) - 1))

    tokens = re.findall(r"[a-z]+(?:'[a-z]+)?", text_path.read_text().lower().replace("’", "'"))
    out_of_list: Counter[str] = Counter()
    for token in tokens:
        tail = next((t for t in CONTRACTION_TAILS if token.endswith(t)), None)
        word = token[: -len(tail)] if tail else token
        if word == "ca" and tail == "n't":
            word = "can"
        if word and not is_basic(word):
            out_of_list[word] += 1
        else:
            continue

    total = len(tokens)
    assert total > 0, f"no words found in {text_path}"
    missed = sum(out_of_list.values())
    print(f"coverage: {100 * (total - missed) / total:.1f}% ({total - missed}/{total} words in Basic English)")
    if out_of_list:
        print(f"out of list ({len(out_of_list)} distinct):")
        for word, count in out_of_list.most_common():
            print(f"  {word}  x{count}")
    else:
        print("out of list: none")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: uv run check.py <text-file>")
    main(Path(sys.argv[1]))
