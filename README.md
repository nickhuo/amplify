# Amplify

Amplify is my toolkit for meta-work: skills that tell coding agents what "good" looks like, so I spend less of my attention reviewing what they produce.

## Why this exists

Anthropic's Economics team studied how work changed inside the company as agents took on more of it ([How employment is changing at Anthropic](https://www.anthropic.com/news/employment-at-anthropic), October 2026). Their finding:

> This acceleration makes human attention the bottleneck for agent output. [...] In response, employees turn to "meta-work," of building visibility tools and monitoring agent pipelines.

The report defines meta-work as building Claude skills, plans and reviews for other agents, dashboards and monitors for agent pipelines, and documenting how work is done, as opposed to the work itself. It found meta-work rose from 10% to 22% of employees' interactive Claude sessions between fall 2025 and spring 2026.

I had been doing this before I had a name for it. Amplify is where that work lives.

## What I mean by meta-work

1. **Managing agents.** Write the spec, have one agent review another's output, watch the pipeline.
2. **Defining what's good.** Give the model the standard explicitly. Don't count on its implicit sense of quality, because that sense is the average of the internet.
3. **Turning judgment into skills.** When I keep correcting the same mistake, that correction is a piece of my judgment. A skill can apply it before I have to.
4. **Working on the system, not the output.** Fix what produced the bad output, not just the bad output.

The first and fourth points come straight from the report. The second and third are my reading of what makes the rest work: an agent can only check its work against a standard someone wrote down.

## What makes a tool a meta tool

A meta tool produces a judgment about an artifact, or decides the conditions under which the artifact should be produced.

- It defines or uses a standard of "good", such as a scoring rubric, an eval set, kill criteria, or an ICP (Ideal Customer Profile).
- The standard comes from my own knowledge and can't be downloaded from the internet.
- It has a learning loop.

## What's inside

| Skill | What it does | Which part of meta-work |
|---|---|---|
| [`correction-to-rule`](skills/correction-to-rule/SKILL.md) | Reads recent Claude Code and Codex transcripts, finds the turns where I corrected an agent, clusters the recurring misses, and proposes a rule or a standards file for each. Writes only what I approve, and proposes pruning standards that stopped firing. | Defining what's good, with a learning loop |
| [`best-practice`](skills/best-practice/SKILL.md) | Before a consequential choice in an established craft (typography, experimentation, agent design), finds what the best practitioners do and why, then applies it and explains it. Proposes new sources; never edits my trusted list. | Bringing in an outside standard where I don't have one yet |
| [`speak`](skills/speak/SKILL.md) | Writes English meant to be said out loud (interview answers, talks), structured with Patrick Winston's "How to Speak" and checked against Ogden's Basic English 850 by `check.py`. | One piece of judgment, encoded as a skill |
| [`write`](skills/write/SKILL.md) | Writes text meant to be read, for people (posts, docs) or for agents (specs, prompts, skills). Applies my six writing principles and summary rule, and says how each changes when the reader is an agent. | Defining what's good, for the text agents read |

`Prompt/Global Instruction for AI Assistance.md` is the global instruction I give my assistants: tone, confidence levels, and a four-stage protocol that makes the agent write its own definition of done before drafting.

### How `correction-to-rule` works

```
transcripts --extract_pairs.py--> (my request, agent reply, my next message)
            --classify.md + small model--> is this a correction?
            --cluster by what the agent did wrong--> proposed rules and standards
            --my approval--> <std>/*.md, pointers in CLAUDE.md / AGENTS.md, LOG.md
```

The scripts do only mechanical work. Whether a message is a correction is decided by a model, and whether a pattern becomes a rule is decided by me. Above about 1,000 turns, `classify_decisions.py` can prefilter with OpenAI's Decisions API before the model pass.

## What it doesn't do yet

The report's headline examples of meta-work are visibility tools and pipeline monitoring. Amplify has neither. It works on the standard an agent is held to, not on watching agents run. There is also no tooling yet for multi-agent specs or agent-to-agent review loops.

## Setup

Amplify is a set of agent skills, not a package.

1. **Install the skills.** Copy or symlink the folders in `skills/` into your agent's skills directory, for example `~/.claude/skills/` for Claude Code.
2. **Point at a standards directory.** `correction-to-rule` and `best-practice` read and write standards in a directory you choose. Add a line like this to your global `CLAUDE.md` or `AGENTS.md`:

   ```
   Standards live at <path>
   ```

   If the line is missing, the skills ask where standards should live.
3. **Requirements.**
   - [`uv`](https://docs.astral.sh/uv/) to run the Python scripts (Python 3.11+ for `check.py`).
   - The `claude` CLI for the classification pass in `correction-to-rule`; any small model with `classify.md` as its prompt also works.
   - `OPENAI_API_KEY`, only if you use the optional `classify_decisions.py` prefilter.

## Usage

Invoke a skill by name, or let the agent pick it up from the skill's description:

- `/correction-to-rule` after a few weeks of agent work, to turn your corrections into standards.
- `/best-practice`, or let it run on its own before a choice that shapes the result.
- `/speak` for an interview answer or a talk.
- `/write` for a post or doc, or for a spec, prompt, or skill another agent will read.

The scripts also run on their own:

```sh
uv run skills/correction-to-rule/extract_pairs.py --since 2026-10-01 > turns.md
uv run skills/speak/check.py draft.txt
```

## Layout

```
skills/
  best-practice/       SKILL.md
  correction-to-rule/  SKILL.md, classify.md, extract_pairs.py, classify_decisions.py
  speak/               SKILL.md, check.py, words.txt
  write/               SKILL.md
Prompt/                Global instruction for AI assistants
```

Calibration data for `correction-to-rule` (hand-labeled transcript turns) stays local and is gitignored, because it holds transcript text.
