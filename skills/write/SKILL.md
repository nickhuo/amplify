---
name: write
description: Write text that will be read, for a human reader (blog posts, essays, docs, updates) or for an agent (specs, prompts, skills, CLAUDE.md, briefs to another agent). Applies the user's six writing principles and summary rule, then adjusts them for the reader, because an agent reader fails in different ways from a human one. Use when drafting or editing anything meant to be read, or when the user invokes /write. Not for words said out loud; use speak for those.
---

<!-- Review note: the quotes marked "Nick:" are Nick's own words, translated from his Chinese notes. Everything else in this file is Claude's draft built on them. Delete this comment once reviewed. -->

# Write

Writing moves a judgment from the writer's head to a reader who can't ask what you meant. Good writing changes what the reader knows or does, at the lowest cost to their attention.

The reader decides everything else. A human reader shares your culture, skims, and stops when bored. An agent reader has only the page and its own average taste, reads every word in order, and fills each gap with the average instead of asking. The same six principles serve both, but they show up differently.

Write in the language the user writes in. These principles hold in any language.

## 1. Name the reader

Before drafting, write one line: who reads this, what they already know, and what they should know or do after.

- **Human** → a person reading a post, doc, or update. Name the surface too (resume, post, retrospective, release notes) and read its rules in `style.md`, next to this file.
- **Agent** → a model acting on a spec, prompt, skill, `CLAUDE.md`, or brief. Also read section 3.

If the reader isn't clear from context, ask one question. Why: every later choice, from the summary to the examples, depends on who reads it.

## 2. The principles

Each principle opens with Nick's own words, translated from his notes, marked "Nick:". The lines under each quote are Claude's draft.

### Summary first

> Nick: Every article must have a summary. Write it for the reader. AI can generate it.

Every piece opens with a summary written for the reader, not for the writer. AI can draft it; the writer checks it says what the piece argues.

### 1. The middle view

> Nick:
> - Avoid the too-macro. Look up at the road, but don't talk only about the abstract: the macroeconomy, political and social change, or industry analysis. It looks grand, but it does little for real life and rarely changes how people act.
> - Avoid the too-micro. Watch your step, but don't look only at your feet: one product's feature details, or one successful analysis. It is practical, but it doesn't fit most people's situation, and it ignores how the environment changes.
> - Choose the middle view: fly low between the two, able to take off and to land. Ordinary people can reach it. It tells readers what lies ahead and how to get there. Example: the part of Toshifumi Suzuki's *The Philosophy of Retail* on how he reads customer needs, which has both cases and his method.

Test: the piece names both a direction and a step the reader can take.

### 2. News ≠ New

> Nick: News ≠ New.

Recent is not the same as new to the reader. Spend words on what changes the reader's picture, not on what just happened.

### 3. Bias over completeness

> Nick: Bias > comprehensiveness.

Take a position. A piece that covers every side lands on the average, and the average is what the reader already has.

Test: the piece argues one sentence a smart reader could disagree with.

### 4. Start from a person

> Nick: Start from a person.

Open with a specific person in a specific situation, then draw the idea out of them, as the Suzuki example in principle 1 does. Readers follow people; an abstraction alone loses them.

### 5. Two weeks to start, never finished

> Nick: Two weeks to start, but never finished.

Give a piece at least two weeks before it goes out, so you reread it cold. After it goes out, keep revising: publishing is a version, not an end.

### 6. Content words over adverbs

> Nick: Avoid adverbs. Use more content words (nouns, verbs). Hedged, vague, empty arguments tend to have many adverbs; crisp, precise, solid information tends to have many content words.

Replace each adverb with the fact it stands in for, or cut it. Watch for intensifiers and hedges: really, very, quite, actually, simply, basically, significantly, deeply, arguably, to some extent. Their equivalents show up in any language.

"Latency improved significantly" → "p95 latency fell from 800 ms to 120 ms".

## 3. Writing for an agent

An agent reader is the case Amplify exists for: it can only check its work against a standard someone wrote down. The principles hold, but each one becomes something different.

| Principle | For a human | For an agent |
|---|---|---|
| Summary first | Lets them decide whether to read | The `description` (or first line) decides whether the agent loads the text at all. Say what it does and when to use it. |
| Middle view | Direction plus a step | Too high: values like "be concise". Too low: a patch for the last failure only. Middle: a rule, its why, and one example. One correction is a preference; a pattern is a standard (see `correction-to-rule`). |
| News ≠ New | What changes their picture | Don't tell the model what it already knows ("write clean code"). Spend words only on what is specific to you and can't be downloaded from the internet. |
| Bias over completeness | Take a position | Name the default. "Consider X or Y" hands the choice back to the model's average taste. |
| Start from a person | A person in a situation | Start from the user and the concrete task. Give input/output examples, with one bad example next to a good one, because agents copy examples. |
| Never finished | Revise after publishing | A skill needs a learning loop: when an agent misses, fix the text that produced the miss. |
| Content words | Facts over adverbs | Caps and intensity words (ALWAYS, CRITICAL, carefully, make sure to) carry no information. Replace each with the condition and the reason. |

Three more things a human reader supplies and an agent doesn't:

- **Context.** Paths, names, who the user is, what was already decided. An agent can't infer what isn't on the page.
- **A definition of done.** End with checks the agent can run on its own output, as Stage 2 of `Prompt/Global Instruction for AI Assistance.md` does. A human needs a takeaway; an agent needs a test.
- **The why.** Put the reason next to each rule. Why: a rule covers the case you saw; the reason lets the agent handle the one you didn't.

Match how strict you are to how fragile the task is: exact commands where one wrong flag breaks things, plain direction where many approaches work.

## 4. Check

Reread the draft as the reader from step 1, someone who doesn't know the user's work.

1. The summary is at the top and states what the piece argues.
2. Middle view: there is a direction and a step.
3. News ≠ New: name what the reader learns that they didn't know.
4. Bias: name the sentence a smart reader could disagree with.
5. Person: the piece starts from someone specific.
6. Adverbs: list every adverb. Replace each with a fact or cut it, and say which.

For a human reader, also:

7. The draft passes `style.md`: the rules for every surface, plus the ones for its own surface.

For an agent reader, also:

8. Hand the text to a fresh agent with no other context, run it on a real task, and fix what it gets wrong. Why: you fill in what isn't on the page, so only a cold reader finds the gaps.
9. The definition of done is checkable without asking the user.

## 5. Output

```
Reader: <human: surface | agent> · <what they know> · <what they should know or do after>

<the draft, summary first>

Notes
- Position taken: "<the sentence a reader could disagree with>"
- Adverbs cut or replaced: <word → fact; …>
- Gaps left for the user: <anything only they can fill>
```

## Sources

- The six principles and the summary rule: Nick's own writing notes, translated (the "Nick:" quotes above).
- Toshifumi Suzuki, *The Philosophy of Retail*, cited in principle 1 as the model of the middle view.
- Style rules per surface are in `style.md`, with their own sources.
- Writing for agents draws on Anthropic's "Skill authoring best practices": only add context the model doesn't have, write descriptions that say what and when, match specificity to fragility, give input/output examples, and test with a fresh instance. https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
