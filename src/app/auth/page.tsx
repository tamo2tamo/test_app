"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/app-state";

export default function AuthPage() {
  const { auth, loginWithEmail, signupWithEmail, loginWithGoogle, logout } = useAppState();
  const [mode, setMode] = useState<"email" | "google">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  async function onSignup() {
    setRegisterStatus("");
    if (password !== passwordConfirm) {
      setRegisterStatus("パスワード確認が一致しません。");
      return;
    }
    const ok = await signupWithEmail(email, password);
    if (ok) {
      setRegisterStatus("受付中です。確認メールの送信をお待ちください。");
    } else {
      setRegisterStatus("登録に失敗しました。入力内容を確認してください。");
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex justify-end">
        <Link href="/">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>新規登録 / ログイン</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
            <Button variant={mode === "email" ? "default" : "ghost"} onClick={() => setMode("email")}>
              メール
            </Button>
            <Button variant={mode === "google" ? "default" : "ghost"} onClick={() => setMode("google")}>
              Google
            </Button>
          </div>

          {mode === "email" && (
            <>
              <Input placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input type="password" placeholder="password (確認)" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
              <Button className="w-full" onClick={() => loginWithEmail(email, password)}>メールでログイン</Button>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={onSignup}>新規登録する</Button>
            </>
          )}

          {mode === "google" && (
            <Button className="w-full" variant="outline" onClick={() => loginWithGoogle()}>Googleでログイン</Button>
          )}
          <p className="text-xs text-blue-700">{registerStatus}</p>
          {auth.userId && <Button className="w-full" variant="ghost" onClick={() => logout()}>ログアウト</Button>}
          {auth.userId && <p className="text-xs text-muted-foreground">ログイン中: {auth.email}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
