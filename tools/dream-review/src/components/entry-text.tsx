import { Clock3, FileCode2, MessageSquareQuote } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Evidence } from "@/types"

// Memory entries use `backticks` for code; render those as code, the rest as text
export function EntryText({ text }: { text: string }) {
  return (
    <p className="text-sm leading-relaxed text-pretty">
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded-sm bg-muted px-1 py-px font-mono text-[0.8em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </p>
  )
}

function sourceLabel(source: string) {
  const session = source.match(/([0-9a-f]{8})-[0-9a-f-]+\.jsonl$/)
  return session ? `Claude Code session ${session[1]}` : source
}

const timeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {evidence.map((e, i) => (
        <li key={i} className="flex flex-col gap-1.5">
          {e.quote ? (
            <blockquote className="flex gap-2 border-l-2 border-foreground/20 pl-3 text-sm leading-relaxed">
              <MessageSquareQuote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span lang="zh">{e.quote}</span>
            </blockquote>
          ) : null}
          <div className="flex items-center gap-3 pl-3 text-xs text-muted-foreground">
            <Tooltip>
              <TooltipTrigger className="inline-flex min-w-0 items-center gap-1 truncate text-left">
                <FileCode2 className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{sourceLabel(e.source)}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm break-all">{e.source}</TooltipContent>
            </Tooltip>
            {e.at ? (
              <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
                <Clock3 className="size-3" aria-hidden />
                {timeFormat.format(new Date(e.at))}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
