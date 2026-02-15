"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/lib/app-state";
import { pushToast } from "@/lib/toast";

type ProfileForm = {
  displayName: string;
  ageGroup: string;
  occupation: string;
  annualIncomeBand: string;
  investmentHistory: string;
  nisaType: string;
  riskTolerance: string;
  investmentPolicy: string;
  familyType: string;
  housingType: string;
  investCashRatio: string;
};

const defaultForm: ProfileForm = {
  displayName: "",
  ageGroup: "30",
  occupation: "employee",
  annualIncomeBand: "b500_800",
  investmentHistory: "b1_3",
  nisaType: "both",
  riskTolerance: "mid",
  investmentPolicy: "balanced",
  familyType: "single",
  housingType: "rent",
  investCashRatio: "25_75",
};

export default function MePage() {
  const { auth, refresh } = useAppState();
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!auth.userId) return;
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.profile) return;
      setForm((prev) => ({
        ...prev,
        displayName: data.profile.displayName ?? "",
        ageGroup: data.profile.ageGroup ?? prev.ageGroup,
        occupation: data.profile.occupation ?? prev.occupation,
        annualIncomeBand: data.profile.annualIncomeBand ?? prev.annualIncomeBand,
        investmentHistory: data.profile.investmentHistory ?? prev.investmentHistory,
        nisaType: data.profile.nisaType ?? prev.nisaType,
        riskTolerance: data.profile.riskTolerance ?? prev.riskTolerance,
        investmentPolicy: data.profile.investmentPolicy ?? prev.investmentPolicy,
        familyType: data.profile.familyType ?? prev.familyType,
        housingType: data.profile.housingType ?? prev.housingType,
        investCashRatio: data.profile.investCashRatio ?? prev.investCashRatio,
      }));
    }
    void loadProfile();
  }, [auth.userId]);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "save_failed");
      }
      pushToast("登録情報を保存しました", "success");
      await refresh();
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "保存に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!auth.userId) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>ログインしてください</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button>新規登録 / ログインへ</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
      <div className="flex justify-end">
        <Link href="/">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>マイページ</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>表示名</Label>
            <Input value={form.displayName} onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))} />
          </div>
          <div>
            <Label>年代</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.ageGroup} onChange={(e) => setForm((prev) => ({ ...prev, ageGroup: e.target.value }))}>
              <option value="20">20代</option><option value="30">30代</option><option value="40">40代</option><option value="50">50代</option><option value="60+">60代以上</option>
            </select>
          </div>
          <div>
            <Label>職業</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.occupation} onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))}>
              <option value="employee">会社員</option><option value="public_servant">公務員</option><option value="self_employed">自営業</option><option value="student">学生</option><option value="unemployed">無職</option><option value="other">その他</option>
            </select>
          </div>
          <div>
            <Label>年収帯</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.annualIncomeBand} onChange={(e) => setForm((prev) => ({ ...prev, annualIncomeBand: e.target.value }))}>
              <option value="u300">〜300</option><option value="b300_500">300-500</option><option value="b500_800">500-800</option><option value="b800_1200">800-1200</option><option value="o1200">1200〜</option><option value="no_answer">回答しない</option>
            </select>
          </div>
          <div>
            <Label>投資歴</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.investmentHistory} onChange={(e) => setForm((prev) => ({ ...prev, investmentHistory: e.target.value }))}>
              <option value="u1">〜1年</option><option value="b1_3">1-3</option><option value="b3_5">3-5</option><option value="b5_10">5-10</option><option value="o10">10年以上</option>
            </select>
          </div>
          <div>
            <Label>NISA</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.nisaType} onChange={(e) => setForm((prev) => ({ ...prev, nisaType: e.target.value }))}>
              <option value="tsumitate_only">つみたてのみ</option><option value="growth_only">成長のみ</option><option value="both">両方</option>
            </select>
          </div>
          <div>
            <Label>リスク許容度</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.riskTolerance} onChange={(e) => setForm((prev) => ({ ...prev, riskTolerance: e.target.value }))}>
              <option value="low">低</option><option value="mid">中</option><option value="high">高</option>
            </select>
          </div>
          <div>
            <Label>投資方針</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.investmentPolicy} onChange={(e) => setForm((prev) => ({ ...prev, investmentPolicy: e.target.value }))}>
              <option value="long_term">長期積立</option><option value="balanced">バランス</option><option value="aggressive">攻め</option>
            </select>
          </div>
          <div>
            <Label>家族構成</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.familyType} onChange={(e) => setForm((prev) => ({ ...prev, familyType: e.target.value }))}>
              <option value="single">独身</option><option value="married_no_child">既婚子なし</option><option value="married_with_child">既婚子あり</option><option value="other">その他</option>
            </select>
          </div>
          <div>
            <Label>住居</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.housingType} onChange={(e) => setForm((prev) => ({ ...prev, housingType: e.target.value }))}>
              <option value="own">持家</option><option value="rent">賃貸</option>
            </select>
          </div>
          <div>
            <Label>投資/現金比率</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-border px-3" value={form.investCashRatio} onChange={(e) => setForm((prev) => ({ ...prev, investCashRatio: e.target.value }))}>
              <option value="5_95">5/95</option><option value="10_90">10/90</option><option value="25_75">25/75</option><option value="50_50">50/50</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">現在の認証強度: {auth.aal}。投稿/リアクション/通報は `aal2` が必要です。</p>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button onClick={() => void saveProfile()} disabled={saving}>{saving ? "保存中..." : "登録情報を保存"}</Button>
            <Link href="/post/new">
              <Button variant="outline">投稿へ</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
