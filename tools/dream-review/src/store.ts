import { create } from "zustand"

import type { Batch, Decision, Decisions, Proposal, Skipped, Verdict } from "@/types"

export type Queue = "proposals" | "skipped"

// Verdicts that need a reason before they count: the reason is what teaches
// dreaming, a bare "no" teaches nothing.
export const NEEDS_NOTE: Verdict[] = ["reject", "should-save"]

export type SaveState = "idle" | "saving" | "saved" | "error"

type State = {
  batch: Batch | null
  decisions: Decisions
  loadError: boolean
  saveState: SaveState
  queue: Queue
  index: number
  // Verdict picked but still waiting for its note
  pending: { id: string; verdict: Verdict } | null
  editing: string | null
  load: () => Promise<void>
  retrySave: () => void
  setQueue: (queue: Queue) => void
  select: (queue: Queue, index: number) => void
  move: (delta: number) => void
  choose: (verdict: Verdict) => void
  commit: (note: string, edited?: string) => void
  cancel: () => void
  startEdit: () => void
  undo: () => void
}

export function items(batch: Batch | null, queue: Queue): (Proposal | Skipped)[] {
  if (!batch) return []
  return queue === "proposals" ? batch.proposals : batch.skipped
}

export function currentItem(s: Pick<State, "batch" | "queue" | "index">) {
  return items(s.batch, s.queue)[s.index] ?? null
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
function save(decisions: Decisions) {
  clearTimeout(saveTimer)
  useReview.setState({ saveState: "saving" })
  saveTimer = setTimeout(async () => {
    try {
      const res = await fetch("/api/decisions", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(decisions),
      })
      if (!res.ok) throw new Error(String(res.status))
      // A newer save may have started while this one was in flight
      if (useReview.getState().decisions === decisions) useReview.setState({ saveState: "saved" })
    } catch {
      useReview.setState({ saveState: "error" })
    }
  }, 300)
}

export const useReview = create<State>((set, get) => {
  function decide(id: string, decision: Decision) {
    const decisions = { ...get().decisions, [id]: decision }
    set({ decisions, pending: null, editing: null })
    save(decisions)
    // Jump to the next undecided item in this queue
    const list = items(get().batch, get().queue)
    const start = get().index
    for (let step = 1; step <= list.length; step++) {
      const i = (start + step) % list.length
      if (!decisions[list[i].id]) return set({ index: i })
    }
  }

  return {
    batch: null,
    decisions: {},
    loadError: false,
    saveState: "idle",
    queue: "proposals",
    index: 0,
    pending: null,
    editing: null,

    async load() {
      try {
        const [batch, decisions] = await Promise.all([
          fetch("/api/batch").then((r) => r.json() as Promise<Batch>),
          fetch("/api/decisions").then((r) => r.json() as Promise<Decisions>),
        ])
        set({ batch, decisions, loadError: false })
      } catch {
        set({ loadError: true })
      }
    },

    retrySave: () => save(get().decisions),

    setQueue: (queue) => set({ queue, index: 0, pending: null, editing: null }),
    select: (queue, index) => set({ queue, index, pending: null, editing: null }),

    move(delta) {
      const list = items(get().batch, get().queue)
      if (!list.length) return
      const index = Math.min(list.length - 1, Math.max(0, get().index + delta))
      set({ index, pending: null, editing: null })
    },

    choose(verdict) {
      const item = currentItem(get())
      if (!item) return
      if (NEEDS_NOTE.includes(verdict)) return set({ pending: { id: item.id, verdict }, editing: null })
      decide(item.id, { verdict, decidedAt: new Date().toISOString() })
    },

    commit(note, edited) {
      const item = currentItem(get())
      if (!item) return
      const { pending, editing } = get()
      const verdict = pending?.id === item.id ? pending.verdict : editing === item.id ? "approve" : null
      if (!verdict) return
      decide(item.id, {
        verdict,
        note: note.trim() || undefined,
        edited: edited?.trim() || undefined,
        decidedAt: new Date().toISOString(),
      })
    },

    cancel: () => set({ pending: null, editing: null }),

    startEdit() {
      const item = currentItem(get())
      if (item && "kind" in item && item.after) set({ editing: item.id, pending: null })
    },

    undo() {
      const item = currentItem(get())
      if (!item || !get().decisions[item.id]) return
      const decisions = { ...get().decisions }
      delete decisions[item.id]
      set({ decisions })
      save(decisions)
    },
  }
})
