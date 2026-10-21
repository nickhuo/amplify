import { CheckCheck, Moon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useSyncExternalStore } from "react"

import { Detail } from "@/components/detail"
import { QueueList } from "@/components/queue-list"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useReview } from "@/store"

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest("input, textarea, select, [contenteditable='true']")
}

// Shortcuts act instantly: they run dozens of times per review, so no motion
function useShortcuts() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return
      const s = useReview.getState()
      const decided = (() => {
        const list = s.queue === "proposals" ? s.batch?.proposals : s.batch?.skipped
        const item = list?.[s.index]
        return item ? !!s.decisions[item.id] : false
      })()
      const actions: Record<string, () => void> = {
        j: () => s.move(1),
        ArrowDown: () => s.move(1),
        k: () => s.move(-1),
        ArrowUp: () => s.move(-1),
        "1": () => s.setQueue("proposals"),
        "2": () => s.setQueue("skipped"),
        u: () => s.undo(),
        Escape: () => s.cancel(),
      }
      if (!decided) {
        if (s.queue === "proposals") {
          actions.a = () => s.choose("approve")
          actions.r = () => s.choose("reject")
          actions.e = () => s.startEdit()
        } else {
          actions.a = () => s.choose("keep-skipped")
          actions.s = () => s.choose("should-save")
        }
      }
      const action = actions[e.key]
      if (action) {
        e.preventDefault()
        action()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}

const NARROW = "(max-width: 767px)"
function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(NARROW)
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => window.matchMedia(NARROW).matches
  )
}

function SaveStatus() {
  const { saveState, retrySave } = useReview()
  return (
    <span role="status" className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      {saveState === "saving" ? "Saving" : null}
      {saveState === "saved" ? "Saved" : null}
      {saveState === "error" ? (
        <>
          <span className="text-destructive">Couldn't save. Check that the server is running.</span>
          <Button variant="outline" size="xs" onClick={retrySave}>
            Try again
          </Button>
        </>
      ) : null}
    </span>
  )
}

function Header() {
  const { batch, decisions } = useReview()
  if (!batch) return null
  const ids = [...batch.proposals, ...batch.skipped].map((i) => i.id)
  const done = ids.filter((id) => decisions[id]).length
  const complete = ids.length > 0 && done === ids.length

  return (
    <header className="flex flex-col gap-2 border-b px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Moon className="size-4 text-muted-foreground" aria-hidden />
        <h1 className="text-sm font-medium">Dream review</h1>
        <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">
          Sessions since {batch.since} · {batch.id}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <SaveStatus />
          <AnimatePresence initial={false} mode="popLayout">
            {complete ? (
              // Shown once per review, so it can afford a little motion
              <motion.span
                key="done"
                initial={{ opacity: 0, transform: "translateY(4px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <CheckCheck className="size-3.5" aria-hidden /> All reviewed
              </motion.span>
            ) : (
              <motion.span key="count" exit={{ opacity: 0 }} className="text-xs text-muted-foreground tabular-nums">
                {done} of {ids.length} reviewed
              </motion.span>
            )}
          </AnimatePresence>
          <Progress value={ids.length ? (done / ids.length) * 100 : 0} className="w-20 sm:w-32" aria-label="Review progress" />
        </div>
      </div>
      {batch.note ? <p className="text-xs text-muted-foreground text-pretty">{batch.note}</p> : null}
    </header>
  )
}

function Shortcuts() {
  const queue = useReview((s) => s.queue)
  const keys: [string, string][] = [
    ["J K", "Move"],
    ["1 2", "Switch list"],
    ...(queue === "proposals"
      ? ([["A", "Approve"], ["R", "Reject"], ["E", "Edit"]] as [string, string][])
      : ([["A", "Confirm skip"], ["S", "Mark as missed"]] as [string, string][])),
    ["U", "Undo"],
    ["D", "Theme"],
  ]
  // Touch screens have no keyboard, so the legend would only take space
  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-2 text-xs text-muted-foreground sm:px-6 pointer-coarse:hidden">
      <h2 className="sr-only">Keyboard shortcuts</h2>
      {keys.map(([k, label]) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          {k.split(" ").map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
          {label}
        </span>
      ))}
    </footer>
  )
}

export function App() {
  const { batch, loadError, load } = useReview()
  const narrow = useNarrow()
  useEffect(() => void load(), [load])
  useShortcuts()

  if (loadError) {
    return (
      <main className="grid h-svh place-items-center p-6">
        <div role="alert" className="flex max-w-sm flex-col items-center gap-3 text-center">
          <p className="text-sm text-pretty">
            Couldn't load the batch. Start the server with <code className="font-mono text-xs">bun server.ts</code>, then try again.
          </p>
          <Button variant="outline" onClick={() => void load()}>
            Try again
          </Button>
        </div>
      </main>
    )
  }
  if (!batch) {
    return (
      <main className="grid h-svh place-items-center" aria-busy="true">
        <p role="status" className="text-sm text-muted-foreground">
          Loading batch
        </p>
      </main>
    )
  }

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="min-h-0 flex-1">
        {/* Side by side on wide screens; stacked on phones so neither pane is a sliver */}
        <ResizablePanelGroup key={narrow ? "v" : "h"} orientation={narrow ? "vertical" : "horizontal"}>
          <ResizablePanel defaultSize={narrow ? "35%" : "32%"} minSize="20%" maxSize={narrow ? "60%" : "50%"}>
            <QueueList />
          </ResizablePanel>
          <ResizableHandle withHandle={narrow} />
          <ResizablePanel>
            <Detail />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <Shortcuts />
    </div>
  )
}

export default App
