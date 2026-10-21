import type { Decision, ProposalKind, Verdict } from "@/types"

export const KIND_LABEL: Record<ProposalKind, string> = {
  add: "Add",
  update: "Update",
  merge: "Merge",
  remove: "Remove",
}

// Removal is the one kind that loses information, so it alone gets a warning color
export const KIND_VARIANT: Record<ProposalKind, "default" | "secondary" | "outline" | "destructive"> = {
  add: "default",
  update: "secondary",
  merge: "outline",
  remove: "destructive",
}

const VERDICT_LABEL: Record<Verdict, string> = {
  approve: "Approved",
  reject: "Rejected",
  "keep-skipped": "Skip confirmed",
  "should-save": "Marked as missed",
}

export function decisionLabel(d: Decision | undefined) {
  if (!d) return "Not reviewed"
  return d.edited ? "Approved with edits" : VERDICT_LABEL[d.verdict]
}
