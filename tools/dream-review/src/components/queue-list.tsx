import { Check, CircleDashed, Flag, PencilLine, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { decisionLabel, KIND_LABEL, KIND_VARIANT } from "@/labels"
import { items, useReview, type Queue } from "@/store"
import type { Decision, Proposal, Skipped } from "@/types"

// Verdicts read by shape, not color: a red X would say "error", and nothing failed
function StatusIcon({ decision }: { decision?: Decision }) {
  const Icon = !decision
    ? CircleDashed
    : decision.edited
      ? PencilLine
      : decision.verdict === "approve" || decision.verdict === "keep-skipped"
        ? Check
        : decision.verdict === "should-save"
          ? Flag
          : X
  // A short settle when a verdict lands; no motion when it is cleared
  return (
    <span className="grid size-4 shrink-0 place-items-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={decision ? `${decision.verdict}-${!!decision.edited}` : "none"}
          initial={decision ? { opacity: 0, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="grid place-items-center"
        >
          <Icon className={decision ? "size-3.5" : "size-3.5 text-muted-foreground/60"} aria-hidden />
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">{decisionLabel(decision)}</span>
    </span>
  )
}

export function QueueList() {
  const { batch, decisions, queue, index, setQueue, select } = useReview()
  if (!batch) return null
  const list = items(batch, queue)
  const count = (q: Queue) => items(batch, q).length

  return (
    <section aria-label="Review queue" className="flex h-full flex-col">
      <div className="border-b p-3">
        <Tabs value={queue} onValueChange={(v) => setQueue(v as Queue)}>
          <TabsList className="w-full">
            <TabsTrigger value="proposals">
              Proposed <span className="text-muted-foreground tabular-nums">{count("proposals")}</span>
            </TabsTrigger>
            <TabsTrigger value="skipped">
              Not saved <span className="text-muted-foreground tabular-nums">{count("skipped")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {list.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground text-pretty">
            {queue === "proposals"
              ? "Dreaming proposed no changes in this batch."
              : "Dreaming saved everything it read, so there is nothing to check for misses."}
          </p>
        ) : (
          <ol className="flex flex-col gap-0.5 p-2">
            {list.map((item, i) => {
              const proposal = "kind" in item ? (item as Proposal) : null
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => select(queue, i)}
                    aria-current={i === index ? "true" : undefined}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60 aria-current:bg-muted"
                  >
                    <span className="mt-0.5">
                      <StatusIcon decision={decisions[item.id]} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      {proposal ? (
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Badge variant={KIND_VARIANT[proposal.kind]}>{KIND_LABEL[proposal.kind]}</Badge>
                          <span className="truncate text-xs text-muted-foreground">{proposal.section ?? proposal.file}</span>
                        </span>
                      ) : null}
                      <span className="line-clamp-2 text-pretty">
                        {proposal ? (proposal.after ?? proposal.before) : (item as Skipped).summary}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </ScrollArea>
    </section>
  )
}
