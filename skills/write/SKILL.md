---
name: write
description: Write text that will be read, for a human reader (blog posts, essays, docs, updates) or for an agent (specs, prompts, skills, CLAUDE.md, briefs to another agent). Applies the user's six writing principles and summary rule, then adjusts them for the reader, because an agent reader fails in different ways from a human one. Use when drafting or editing anything meant to be read, or when the user invokes /write. Not for words said out loud; use speak for those.
---

<!-- Review note: the 原文 quotes are Nick's own words. Everything else in this file is Claude's draft built on them. Delete this comment once reviewed. -->

# Write

Writing moves a judgment from the writer's head to a reader who can't ask what you meant. Good writing changes what the reader knows or does, at the lowest cost to their attention.

The reader decides everything else. A human reader shares your culture, skims, and stops when bored. An agent reader has only the page and its own average taste, reads every word in order, and fills each gap with the average instead of asking. The same six principles serve both, but they show up differently.

Write in the language the user writes in. These principles hold in Chinese and English alike.

## 1. Name the reader

Before drafting, write one line: who reads this, what they already know, and what they should know or do after.

- **Human** → a person reading a post, doc, or update.
- **Agent** → a model acting on a spec, prompt, skill, `CLAUDE.md`, or brief. Also read section 3.

If the reader isn't clear from context, ask one question. Why: every later choice, from the summary to the examples, depends on who reads it.

## 2. The principles

### Summary first

> 原文：文章必须有摘要，面对读者写作需要 > 也可以用 AI 生成

Every piece opens with a summary written for the reader, not for the writer. AI can draft it; the writer checks it says what the piece argues.

### 1. The middle view

> 原文：
> - 避免过于宏观。抬头看路，但不试图只讲形而上的东西，比如宏观经济，时政社会变化或者行业分析等。这类内容看起来宏大，但对实际生活帮助不大，且很难改变人们的行为。
> - 避免过于微观。低头走路，但不只关注脚下，比如只讲某个产品的功能细节，或者聚焦在某一次成功的分析。这类内容实操性很强，但是和大多数人的情境不符，且忽略了环境变化。
> - 选择中观视角：是指在两者之间的低空飞行，可以起飞也可以降落，是一般人能达到的境界，既能告诉前方有什么，又能指导如何抵达。比如《零售的哲学》中铃木敏文如何洞察用户需求的部分，既有案例又有其方法论。

Fly low. Too high (macroeconomics, industry analysis) looks grand but changes no one's behavior. Too low (one product's features, one lucky success) is practical but fits few readers and ignores how conditions change. The middle tells the reader what lies ahead and how to get there, with a case and the method behind it.

Test: the piece names both a direction and a step the reader can take.

### 2. News ≠ New

> 原文：News ≠ New

Recent is not the same as new to the reader. Spend words on what changes the reader's picture, not on what just happened.

### 3. Bias over completeness

> 原文：偏见 > 全面

Take a position. A piece that covers every side lands on the average, and the average is what the reader already has.

Test: the piece argues one sentence a smart reader could disagree with.

### 4. Start from a person

> 原文：从人物下手

Open with a specific person in a specific situation, then draw the idea out of them, as the 铃木敏文 example in principle 1 does. Readers follow people; an abstraction alone loses them.

### 5. Two weeks to start, never finished

> 原文：两周时间起，但永远未完成

Give a piece at least two weeks before it goes out, so you reread it cold. After it goes out, keep revising: publishing is a version, not an end.

### 6. Content words over adverbs

> 原文：避免使用副词、实词（名词、动词）越多的（扭捏含糊的废话论点一般副词多，干练准确的确凿信息一般实词多）

Vague, hedged arguments are heavy in adverbs; precise information is heavy in nouns and verbs. Replace each adverb with the fact it stands in for, or cut it.

- English: really, very, quite, simply, basically, significantly, deeply, arguably.
- 中文：非常、其实、真正、基本上、某种程度上、深刻地、可能、相当。

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

For an agent reader, also:

7. Hand the text to a fresh agent with no other context, run it on a real task, and fix what it gets wrong. Why: you fill in what isn't on the page, so only a cold reader finds the gaps.
8. The definition of done is checkable without asking the user.

## 5. Output

```
Reader: <human | agent> · <what they know> · <what they should know or do after>

<the draft, summary first>

Notes
- Position taken: "<the sentence a reader could disagree with>"
- Adverbs cut or replaced: <word → fact; …>
- Gaps left for the user: <anything only they can fill>
```

## Sources

- The six principles and the summary rule: Nick's own writing notes (the 原文 quotes above).
- 铃木敏文《零售的哲学》, cited in principle 1 as the model of the middle view.
- Writing for agents draws on Anthropic's "Skill authoring best practices": only add context the model doesn't have, write descriptions that say what and when, match specificity to fragility, give input/output examples, and test with a fresh instance. https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
