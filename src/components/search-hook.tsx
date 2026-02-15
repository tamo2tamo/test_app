"use client";

import { useMemo, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppState } from "@/lib/app-state";
import { computeMatch, sortResults } from "@/lib/scoring";
import { SearchInput, SearchResult } from "@/lib/types";

const initialFilter: SearchInput = {
  profile: {
    age: "30",
    occupation: "employee",
    income: "b500_800",
    history: "b1_3",
    nisa: "both",
    risk: "mid",
    policy: "balanced",
    investCash: "25_75",
  },
  performance: {
    sinceStart: 20,
  },
  sort: "popular",
};

export function useSearchResults() {
  const { posts, loading: appLoading } = useAppState();
  const [filter, setFilter] = useState<SearchInput>(initialFilter);
  const [isPending, startTransition] = useTransition();

  const source = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);
  const results: SearchResult[] = useMemo(() => {
    const next = source.map((post) => computeMatch(post, filter));
    return sortResults(next, filter.sort);
  }, [source, filter]);

  const skeleton = (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  const controls = (
    <div className="grid gap-3 md:grid-cols-4">
      <div>
        <Label>並び替え</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.sort}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, sort: e.target.value as SearchInput["sort"] })))}
        >
          <option value="popular">人気順</option>
          <option value="new">新着順</option>
          <option value="match">一致度順</option>
        </select>
      </div>
      <div>
        <Label>年代</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.age}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, age: e.target.value as SearchInput["profile"]["age"] } })))}
        >
          <option value="20">20代</option>
          <option value="30">30代</option>
          <option value="40">40代</option>
          <option value="50">50代</option>
          <option value="60+">60代以上</option>
        </select>
      </div>
      <div>
        <Label>職業</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.occupation}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, occupation: e.target.value as SearchInput["profile"]["occupation"] } })))}
        >
          <option value="employee">会社員</option>
          <option value="public_servant">公務員</option>
          <option value="self_employed">自営業</option>
          <option value="student">学生</option>
          <option value="unemployed">無職</option>
          <option value="other">その他</option>
        </select>
      </div>
      <div>
        <Label>年収帯</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.income}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, income: e.target.value as SearchInput["profile"]["income"] } })))}
        >
          <option value="u300">〜300</option>
          <option value="b300_500">300-500</option>
          <option value="b500_800">500-800</option>
          <option value="b800_1200">800-1200</option>
          <option value="o1200">1200〜</option>
          <option value="no_answer">回答しない</option>
        </select>
      </div>
      <div>
        <Label>投資歴</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.history}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, history: e.target.value as SearchInput["profile"]["history"] } })))}
        >
          <option value="u1">〜1年</option>
          <option value="b1_3">1-3年</option>
          <option value="b3_5">3-5年</option>
          <option value="b5_10">5-10年</option>
          <option value="o10">10年以上</option>
        </select>
      </div>
      <div>
        <Label>NISA</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.nisa}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, nisa: e.target.value as SearchInput["profile"]["nisa"] } })))}
        >
          <option value="tsumitate_only">つみたてのみ</option>
          <option value="growth_only">成長のみ</option>
          <option value="both">両方</option>
        </select>
      </div>
      <div>
        <Label>リスク許容度</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.risk}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, risk: e.target.value as SearchInput["profile"]["risk"] } })))}
        >
          <option value="low">低</option>
          <option value="mid">中</option>
          <option value="high">高</option>
        </select>
      </div>
      <div>
        <Label>投資方針</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.policy}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, policy: e.target.value as SearchInput["profile"]["policy"] } })))}
        >
          <option value="long_term">長期積立</option>
          <option value="balanced">バランス</option>
          <option value="aggressive">攻め</option>
        </select>
      </div>
      <div>
        <Label>投資/現金比率</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          value={filter.profile.investCash}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, profile: { ...prev.profile, investCash: e.target.value as SearchInput["profile"]["investCash"] } })))}
        >
          <option value="5_95">5/95</option>
          <option value="10_90">10/90</option>
          <option value="25_75">25/75</option>
          <option value="50_50">50/50</option>
        </select>
      </div>
      <div>
        <Label>開始来(%) 目安</Label>
        <Input
          type="number"
          value={filter.performance?.sinceStart ?? ""}
          onChange={(e) => startTransition(() => setFilter((prev) => ({ ...prev, performance: { ...prev.performance, sinceStart: Number(e.target.value || 0) } })))}
        />
      </div>
    </div>
  );

  return { loading: appLoading || isPending, results, controls, skeleton };
}
