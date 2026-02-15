"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AllocationPie } from "@/components/allocation-pie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/lib/app-state";
import { AllocationKey, AllocationMap, PostRecord, ProfileInput } from "@/lib/types";

const defaultProfile: ProfileInput = {
  age: "30",
  family: "single",
  housing: "rent",
  occupation: "employee",
  income: "b500_800",
  history: "b1_3",
  nisa: "both",
  risk: "mid",
  policy: "balanced",
  investCash: "25_75",
};

const defaultAllocations: AllocationMap = {
  stock_jp: 10,
  stock_global: 20,
  fund_jp_index: 10,
  fund_global_index: 30,
  fund_jp_active: 4,
  fund_global_active: 8,
  reit: 4,
  bond_jp: 5,
  bond_global: 5,
  fx: 1,
  gold: 2,
  other: 1,
};

const allocationLabels: Record<AllocationKey, string> = {
  stock_jp: "株（国内）",
  stock_global: "株（海外）",
  fund_jp_index: "投信（国内インデックス）",
  fund_global_index: "投信（海外インデックス）",
  fund_jp_active: "投信（国内アクティブ）",
  fund_global_active: "投信（海外アクティブ）",
  reit: "不動産（REIT）",
  bond_jp: "債券（国内）",
  bond_global: "債券（海外）",
  fx: "FX",
  gold: "金",
  other: "その他",
};

export default function NewPostPage() {
  const router = useRouter();
  const { auth, submitPost } = useAppState();
  const userId = auth.userId;

  const [profile, setProfile] = useState<ProfileInput>(defaultProfile);
  const [allocations, setAllocations] = useState<AllocationMap>(defaultAllocations);
  const [oneYear, setOneYear] = useState(8.2);
  const [sinceStart, setSinceStart] = useState(25.4);
  const [memo, setMemo] = useState("無理のない積立を優先。暴落時にリバランス。\n金融助言ではなく自己記録です。");

  if (!userId) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>投稿にはログインが必要です</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">メールまたはGoogleログイン後に投稿できます。</p>
            <Link href="/auth" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground">
              /auth へ移動
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const total = Object.values(allocations).reduce((a, b) => a + b, 0);

  async function onSubmit() {
    if (total !== 100) return;
    if (!userId) return;

    const payload: Omit<PostRecord, "id" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "views" | "reactions" | "reports"> = {
      authorId: userId,
      profile,
      allocations,
      memo,
      performance: { oneYear, sinceStart },
    };

    const ok = await submitPost(payload);
    if (ok) router.push("/");
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-8">
      <div className="flex justify-end">
        <Link href="/">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>投稿する</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>年代</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.age} onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value as ProfileInput["age"] }))}>
              <option value="20">20代</option><option value="30">30代</option><option value="40">40代</option><option value="50">50代</option><option value="60+">60代以上</option>
            </select>
          </div>
          <div>
            <Label>家族構成</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.family} onChange={(e) => setProfile((p) => ({ ...p, family: e.target.value as ProfileInput["family"] }))}>
              <option value="single">独身</option><option value="married_no_child">既婚子なし</option><option value="married_with_child">既婚子あり</option><option value="other">その他</option>
            </select>
          </div>
          <div>
            <Label>住居</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.housing} onChange={(e) => setProfile((p) => ({ ...p, housing: e.target.value as ProfileInput["housing"] }))}>
              <option value="own">持家</option><option value="rent">賃貸</option>
            </select>
          </div>
          <div>
            <Label>職業</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.occupation} onChange={(e) => setProfile((p) => ({ ...p, occupation: e.target.value as ProfileInput["occupation"] }))}>
              <option value="employee">会社員</option><option value="public_servant">公務員</option><option value="self_employed">自営業</option><option value="student">学生</option><option value="unemployed">無職</option><option value="other">その他</option>
            </select>
          </div>
          <div>
            <Label>年収帯</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.income} onChange={(e) => setProfile((p) => ({ ...p, income: e.target.value as ProfileInput["income"] }))}>
              <option value="u300">〜300</option><option value="b300_500">300-500</option><option value="b500_800">500-800</option><option value="b800_1200">800-1200</option><option value="o1200">1200〜</option><option value="no_answer">回答しない</option>
            </select>
          </div>
          <div>
            <Label>投資歴</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.history} onChange={(e) => setProfile((p) => ({ ...p, history: e.target.value as ProfileInput["history"] }))}>
              <option value="u1">〜1年</option><option value="b1_3">1-3</option><option value="b3_5">3-5</option><option value="b5_10">5-10</option><option value="o10">10年以上</option>
            </select>
          </div>
          <div>
            <Label>NISA</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.nisa} onChange={(e) => setProfile((p) => ({ ...p, nisa: e.target.value as ProfileInput["nisa"] }))}>
              <option value="tsumitate_only">つみたてのみ</option><option value="growth_only">成長のみ</option><option value="both">両方</option>
            </select>
          </div>
          <div>
            <Label>リスク許容度</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.risk} onChange={(e) => setProfile((p) => ({ ...p, risk: e.target.value as ProfileInput["risk"] }))}>
              <option value="low">低</option><option value="mid">中</option><option value="high">高</option>
            </select>
          </div>
          <div>
            <Label>投資方針</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.policy} onChange={(e) => setProfile((p) => ({ ...p, policy: e.target.value as ProfileInput["policy"] }))}>
              <option value="long_term">長期積立</option><option value="balanced">バランス</option><option value="aggressive">攻め</option>
            </select>
          </div>
          <div>
            <Label>投資/現金比率</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={profile.investCash} onChange={(e) => setProfile((p) => ({ ...p, investCash: e.target.value as ProfileInput["investCash"] }))}>
              <option value="5_95">5/95</option><option value="10_90">10/90</option><option value="25_75">25/75</option><option value="50_50">50/50</option>
            </select>
          </div>

          <div>
            <Label>利回り過去1年(%)</Label>
            <Input type="number" min={-1000} max={1000} value={oneYear} onChange={(e) => setOneYear(Number(e.target.value))} />
          </div>
          <div>
            <Label>利回り開始来(%)</Label>
            <Input type="number" min={-1000} max={1000} value={sinceStart} onChange={(e) => setSinceStart(Number(e.target.value))} />
          </div>

          <div className="md:col-span-2">
            <Label>自由記述 (200字以内 / 外部リンク禁止)</Label>
            <Textarea className="min-h-28" value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={200} />
          </div>

          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>商品群配分: 合計 {total}% (100%必須)</Label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Object.entries(allocations).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs">{allocationLabels[key as AllocationKey]}</Label>
                    <Input type="number" min={0} max={100} value={value} onChange={(e) => setAllocations((prev) => ({ ...prev, [key]: Number(e.target.value) }))} />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="mb-2 text-sm font-medium">商品群の結果（円グラフ）</p>
              <AllocationPie allocations={allocations} pieClassName="h-80 w-80" />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button onClick={onSubmit} disabled={total !== 100 || auth.aal !== "aal2"}>投稿を送信</Button>
            <Button variant="outline" onClick={() => router.push("/")}>戻る</Button>
          </div>
          {auth.aal !== "aal2" && (
            <p className="md:col-span-2 text-xs text-red-600">投稿には2FA完了（aal2）が必要です。`/me` から認証状態を確認してください。</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
