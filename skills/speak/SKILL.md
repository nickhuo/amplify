---
name: speak
description: Write English the user will say out loud, such as interview answers, self-introductions, talks, and meeting updates. Structures it with Patrick Winston's "How to Speak" and fits the words to the listener, with Ogden's Basic English 850 as the baseline for simple. Not for text that will be read.
---

# Speak

A listener hears each sentence once, at your speed, and can't look back. Writing that reads well often fails out loud, so this skill writes for the ear. The words are fitted to who is listening. Ogden's 850 words are the reference for "simple", not a cage.

Run the five steps in order. Don't skip step 1: every later choice depends on the profile.

## 1. Profile the listener

Fill four fields:

| Field | Values |
|---|---|
| English level | limited / fluent non-native / native |
| Domain knowledge | outsider / adjacent / expert |
| Role and what they care about | e.g. hiring manager → impact; engineer peer → how it works; executive → outcome and cost |
| Setting and time | e.g. behavioral answer 60–120 s; self-intro 60–90 s; talk N minutes |

Where each value comes from:

- **The user stated it** → use it.
- **The context shows it** (a job post, an interviewer's profile, the event) → infer it and mark it `(inferred)` in the output, so the user can correct a wrong guess before rehearsing it.
- **Neither** → ask one question that covers the missing fields. If you can't ask, use fluent non-native / adjacent and mark both `(default)`. Why: when two levels both fit, the simpler one costs a native listener little, but the harder one loses a non-native listener.

Then pick the word tier:

```
English level is limited, or the room is mixed international?
├── Yes → Tier 1
└── No
    ├── Native AND expert in the topic? → Tier 3
    └── Otherwise → Tier 2
```

| Tier | Words | What to do with each word `check.py` flags |
|---|---|---|
| 1 | Basic English 850 + required terms | Replace it, or keep it for one of the reasons below |
| 2 | Common everyday words; no idioms, slang, or cultural references | Replace it when a 850 phrase of 3 words or fewer says the same thing; otherwise keep it |
| 3 | Full vocabulary and the field's jargon | Replace it only when it is a "big word" with a plain twin (utilize → use, facilitate → help, leverage → use) |

Valid reasons to keep a flagged word (Ogden's own rules allow the first three):

1. A technical term this listener uses for this task (latency, cache, Kubernetes).
2. A proper noun, number, unit, date, or currency.
3. A common word whose 850 replacement is longer than 3 words or shifts the meaning (people, what, just).
4. In Tiers 2–3, a word the listener would expect and miss.

Domain knowledge sets how to handle jargon, separately from the tier:

- **Expert** → use the term with no definition.
- **Adjacent** → use the term once, with a definition of one short sentence the first time.
- **Outsider** → no jargon; give a concrete picture or example instead.

**Phrasal verbs.** Ogden replaces verbs with an operator plus a direction (enter → go in, remove → take out). In Tiers 1–2, use this only when the meaning is literal. Idiomatic ones (put up with, get over, come across as) are harder for non-native listeners than the single word, so use the single word even if it is off the list.

## 2. Build the structure (Winston)

Write these three lines before anything else:

- **Promise / headline.** The first sentence says what the listener will get, or gives the answer itself. Never open with a joke or a warm-up: at the start, listeners are still adjusting to your voice.
- **Slogan.** One short phrase the listener can repeat later.
- **Contribution.** What you did and what it gave, in one sentence.

Then fill in the body with these rules:

- **Cycle.** The core point appears 3 times: in the headline, after the story, and at the close. Why: at any moment about 20% of listeners have drifted off. Saying it three times is how everyone gets it once.
- **Fence.** Add one line that sets the idea apart from a nearby one ("Not X, but Y", or a near miss: "This looks like X, but it misses in one place"). Why: without it, listeners file your idea under one they already know.
- **Verbal punctuation.** Number the parts out loud ("Two things." "First…" "Second…") and mark each turn ("So here's the result."). Why: a listener who drifted off needs a clear place to get back on.
- **Vision, then steps, then contributions.** Use this for a self-intro, a project story, or a job talk:
  1. The problem someone cares about, plus what is new in your approach.
  2. The steps it took.
  3. The contributions, which mirror the steps.

  Vision and "I have done something" must land early: Winston's panel gave a job candidate 5 minutes. In a 90-second answer, that means the first 2 sentences.
- **Situate.** One sentence on why the problem matters beyond you: who else has it, or what it unlocks.
- **One story.** Use one concrete story with a person, a moment, and a number. Don't use a list of achievements. For a talk, also check Winston's star (symbol, slogan, surprise, salient idea, story). The salient idea is the one idea that sticks out, not the most important one.
- **Ending.** The last line is the contribution or a sincere salute to the listener (what you value about their team or problem). Never end on "That's it", "So yeah", or "Thank you for listening". Why: those suggest the listener stayed out of politeness, and they waste the moment the listener remembers best. A short joke at the very end of a talk is fine, because by then listeners are ready for one.

## 3. Write for the ear

- One idea per sentence, 20 words max.
- Put the subject and verb in the first 5 words. The listener can't hold a long lead-in in memory.
- Never use parentheses, "respectively", "the former / the latter", or "as mentioned above". These need the eye to look back.
- Round numbers ("about 40%") unless the exact number is the point.
- Say an acronym in full the first time, except to a Tier 3 expert.
- Keep the length within the time from step 1, at about 140 words per minute.

## 4. Check

1. Save the draft to a file and run `uv run check.py <file>` (the `check.py` next to this SKILL.md). Handle every flagged word by its tier (step 1). Never skip a word: either replace it or name the reason for keeping it.
2. **Cold-listener pass.** Read the script again as the listener from step 1, someone who doesn't know the user's work. Mark every place they would ask "what?" or "why does that matter?", and fix each one. Why: Winston found that people who know your work fill in what isn't there, so only a cold listener finds the gaps.
3. Confirm all four:
   - The first sentence is the promise or the answer.
   - The core point appears 3 times.
   - There is a fence.
   - The last sentence is the contribution or a salute.

## 5. Output

```
Listener: <level> · <domain> · <role: cares about X> · <setting, N s>   (mark inferred/default)
Tier: <1|2|3>

<script: one sentence per line, "/" for a pause, **bold** on the 1–2 stressed words per line>

Notes
- Coverage: <n>% Basic English
- Kept off-list: word — reason; …
- Slogan: "<slogan>"
```

The user will say these words, so give a script they can rehearse, not a paragraph.

## Sources

- Ogden's Basic English word list and grammar rules: https://zbenglish.net/sites/basic/words.html, https://zbenglish.net/sites/basic/rules.html
- Patrick Winston, "How to Speak", MIT OpenCourseWare: https://www.youtube.com/watch?v=Unzc731iCUY. Empowerment promise 4:30, cycle / fence / verbal punctuation 5:30–8:30, situate and practice with cold listeners 42:00, vision and steps in 5 minutes 44:00, Winston's star 50:00, ending 53:00.
