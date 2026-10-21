// A dream run writes one Batch; the reviewer writes one Decision per item.

export type Evidence = {
  // Transcript path, URL, or repo the fact came from
  source: string
  // ISO timestamp of the message, when the source is a transcript
  at?: string
  // Nick's own words, verbatim; omitted when the source is code or a page
  quote?: string
}

export type ProposalKind = "add" | "update" | "merge" | "remove"

export type Proposal = {
  id: string
  kind: ProposalKind
  // Memory file the change lands in, relative to the memory repo
  file: string
  section?: string
  // Entry as it is now (update, merge, remove)
  before?: string
  // Entry as dreaming proposes it (add, update, merge)
  after?: string
  // Why dreaming thinks this belongs in memory
  rationale: string
  evidence: Evidence[]
}

// Something dreaming read but chose not to save, shown so the reviewer can
// catch omissions, not just wrong entries.
export type Skipped = {
  id: string
  summary: string
  reason: string
  evidence: Evidence[]
}

export type Batch = {
  id: string
  createdAt: string
  // Transcripts read since this date
  since: string
  note?: string
  proposals: Proposal[]
  skipped: Skipped[]
}

// approve/reject apply to proposals; keep-skipped/should-save to skipped items
export type Verdict = "approve" | "reject" | "keep-skipped" | "should-save"

export type Decision = {
  verdict: Verdict
  // Required on reject and should-save: the reason is the learning signal
  note?: string
  // Reviewer's rewrite of the proposed entry, approved as edited
  edited?: string
  decidedAt: string
}

export type Decisions = Record<string, Decision>
