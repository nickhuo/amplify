import { Check, Flag, PencilLine, RotateCcw, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { EntryText, EvidenceList } from "@/components/entry-text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { decisionLabel, KIND_LABEL, KIND_VARIANT } from "@/labels"
import { currentItem, items, NEEDS_NOTE, useReview } from "@/store"
import type { Decision, Proposal, Skipped } from "@/types"

// Big enough to tap on touch screens; pointer users keep the compact size
const TOUCH = "pointer-coarse:h-11"

// The key hint is for sighted keyboard users; screen readers get aria-keyshortcuts
function Key({ k, primary }: { k: string; primary?: boolean }) {
  return (
    <Kbd aria-hidden className={primary ? "bg-primary-foreground/15 text-primary-foreground" : undefined}>
      {k}
    </Kbd>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground">{label}</h3>
      {children}
    </section>
  )
}

function ProposalBody({ p }: { p: Proposal }) {
  return (
    <>
      {p.before ? (
        <Section label={p.kind === "remove" ? "Entry to remove" : "Current entry"}>
          <div className="rounded-lg bg-muted/60 p-3 text-muted-foreground">
            <EntryText text={p.before} />
          </div>
        </Section>
      ) : null}
      {p.after ? (
        <Section label={p.kind === "add" ? "New entry" : "Proposed entry"}>
          <div className="rounded-lg border bg-card p-3">
            <EntryText text={p.after} />
          </div>
        </Section>
      ) : null}
      <Section label="Why dreaming proposes it">
        <p className="text-sm leading-relaxed text-pretty">{p.rationale}</p>
      </Section>
    </>
  )
}

function SkippedBody({ s }: { s: Skipped }) {
  return (
    <>
      <Section label="What dreaming saw">
        <div className="rounded-lg border bg-card p-3">
          <EntryText text={s.summary} />
        </div>
      </Section>
      <Section label="Why it wasn't saved">
        <p className="text-sm leading-relaxed text-pretty">{s.reason}</p>
      </Section>
    </>
  )
}

function Composer({ mode, initial }: { mode: "note" | "edit"; initial?: string }) {
  const { pending, commit, cancel } = useReview()
  const [entry, setEntry] = useState(initial ?? "")
  const [note, setNote] = useState("")
  const first = useRef<HTMLTextAreaElement>(null)
  const entryId = useId()
  const noteId = useId()
  useEffect(() => first.current?.focus(), [])

  const canSubmit = mode === "note" ? note.trim().length > 0 : entry.trim().length > 0
  const submit = () => canSubmit && commit(note, mode === "edit" ? entry : undefined)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancel()
    }
  }

  const noteLabel =
    mode === "edit"
      ? "What you changed and why (optional)"
      : pending?.verdict === "should-save"
        ? "What memory should say, and why it matters"
        : "Why this entry is wrong"

  return (
    <div className="flex flex-col gap-3" onKeyDown={onKeyDown}>
      {mode === "edit" ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={entryId} className="text-xs font-medium text-muted-foreground">
            Your version of the entry
          </label>
          <Textarea id={entryId} ref={first} value={entry} onChange={(e) => setEntry(e.target.value)} className="min-h-28" />
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={noteId} className="text-xs font-medium text-muted-foreground">
          {noteLabel}
        </label>
        <Textarea
          id={noteId}
          ref={mode === "note" ? first : undefined}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={mode === "note" && pending?.verdict === "reject" ? "For example: a one-off task, or it misreads what I meant" : undefined}
          className="min-h-16"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" className={TOUCH} onClick={cancel} aria-keyshortcuts="Escape">
          Cancel <Key k="Esc" />
        </Button>
        <Button size="sm" className={TOUCH} disabled={!canSubmit} onClick={submit} aria-keyshortcuts="Meta+Enter">
          {mode === "edit" ? "Approve edit" : "Save reason"} <Key k="⌘↵" primary />
        </Button>
      </div>
    </div>
  )
}

function DecisionSummary({ d }: { d: Decision }) {
  const undo = useReview((s) => s.undo)
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{decisionLabel(d)}</span>
        <Button variant="ghost" size="xs" className={TOUCH} onClick={undo} aria-keyshortcuts="U">
          <RotateCcw data-icon="inline-start" aria-hidden /> Undo decision <Key k="U" />
        </Button>
      </div>
      {d.edited ? <EntryText text={d.edited} /> : null}
      {d.note ? <p className="text-sm text-muted-foreground text-pretty">{d.note}</p> : null}
    </div>
  )
}

function Actions({ proposal }: { proposal: Proposal | null }) {
  const { choose, startEdit } = useReview()
  return proposal ? (
    <div className="flex flex-wrap gap-2">
      <Button className={TOUCH} onClick={() => choose("approve")} aria-keyshortcuts="A">
        <Check data-icon="inline-start" aria-hidden /> Approve <Key k="A" primary />
      </Button>
      <Button variant="outline" className={TOUCH} onClick={() => choose("reject")} aria-keyshortcuts="R">
        <X data-icon="inline-start" aria-hidden /> Reject <Key k="R" />
      </Button>
      {/* Only entries with proposed text can be rewritten; a removal has none */}
      {proposal.after ? (
        <Button variant="outline" className={TOUCH} onClick={startEdit} aria-keyshortcuts="E">
          <PencilLine data-icon="inline-start" aria-hidden /> Edit entry <Key k="E" />
        </Button>
      ) : null}
    </div>
  ) : (
    <div className="flex flex-wrap gap-2">
      <Button className={TOUCH} onClick={() => choose("keep-skipped")} aria-keyshortcuts="A">
        <Check data-icon="inline-start" aria-hidden /> Confirm skip <Key k="A" primary />
      </Button>
      <Button variant="outline" className={TOUCH} onClick={() => choose("should-save")} aria-keyshortcuts="S">
        <Flag data-icon="inline-start" aria-hidden /> Mark as missed <Key k="S" />
      </Button>
    </div>
  )
}

export function Detail() {
  const { batch, queue, index, decisions, pending, editing } = useReview()
  const item = useReview(currentItem)
  if (!batch) return null
  if (!item) {
    return (
      <div className="grid h-full place-items-center p-6">
        <p className="max-w-xs text-center text-sm text-muted-foreground text-pretty">
          Nothing to review in this list. Switch lists with <Kbd>1</Kbd> or <Kbd>2</Kbd>.
        </p>
      </div>
    )
  }

  const total = items(batch, queue).length
  const proposal = "kind" in item ? (item as Proposal) : null
  const decision = decisions[item.id]
  const composing = pending?.id === item.id && NEEDS_NOTE.includes(pending.verdict) ? "note" : editing === item.id ? "edit" : null

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-3 text-sm sm:px-6">
        <h2 className="flex min-w-0 items-center gap-2">
          {proposal ? (
            <>
              <Badge variant={KIND_VARIANT[proposal.kind]}>{KIND_LABEL[proposal.kind]}</Badge>
              <span className="min-w-0 truncate font-normal text-muted-foreground">
                <span className="font-mono text-xs">{proposal.file}</span>
                {proposal.section ? <> › {proposal.section}</> : null}
              </span>
            </>
          ) : (
            <Badge variant="outline">Not saved</Badge>
          )}
        </h2>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
          {index + 1} of {total}
        </span>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        {/* key resets the scroll position and composer per item */}
        <div key={item.id} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6">
          {proposal ? <ProposalBody p={proposal} /> : <SkippedBody s={item as Skipped} />}
          <Separator />
          <Section label={proposal ? "Evidence" : "Where it came up"}>
            <EvidenceList evidence={item.evidence} />
          </Section>
        </div>
      </ScrollArea>

      <footer className="border-t px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {composing ? (
            <Composer key={`${item.id}-${composing}`} mode={composing} initial={proposal?.after} />
          ) : decision ? (
            <DecisionSummary d={decision} />
          ) : (
            <Actions proposal={proposal} />
          )}
        </div>
      </footer>
    </div>
  )
}
