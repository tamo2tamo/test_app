import { PostRecord, ReactionType, ReportRecord } from "@/lib/types";

interface PostDbRow {
  id: string;
  author_id: string;
  profile: PostRecord["profile"];
  allocations: PostRecord["allocations"];
  performance: PostRecord["performance"];
  memo: string;
  status: PostRecord["status"];
  view_count: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface ReportDbRow {
  id: number | string;
  post_id: string;
  reason: ReportRecord["reason"];
  memo: string;
  status: ReportRecord["status"];
  created_at: string;
}

export function mapPostRow(row: PostDbRow): PostRecord {
  return {
    id: row.id,
    authorId: row.author_id,
    profile: row.profile,
    allocations: row.allocations,
    performance: row.performance,
    memo: row.memo,
    status: row.status,
    views: row.view_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
    reactions: {
      helpful: 0,
      clear: 0,
      support: 0,
    },
    reports: 0,
  };
}

export function applyReactionCounts(posts: PostRecord[], rows: Array<{ post_id: string; type: ReactionType }>) {
  const byId = new Map(posts.map((post) => [post.id, post]));
  rows.forEach((row) => {
    const post = byId.get(row.post_id);
    if (!post) return;
    post.reactions[row.type] += 1;
  });
}

export function applyReportCounts(posts: PostRecord[], rows: Array<{ post_id: string }>) {
  const counter = new Map<string, number>();
  rows.forEach((row) => counter.set(row.post_id, (counter.get(row.post_id) ?? 0) + 1));
  posts.forEach((post) => {
    post.reports = counter.get(post.id) ?? 0;
  });
}

export function mapReportRow(row: ReportDbRow): ReportRecord {
  return {
    id: String(row.id),
    postId: row.post_id,
    reason: row.reason,
    memo: row.memo,
    status: row.status,
    createdAt: row.created_at,
  };
}
