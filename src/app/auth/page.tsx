"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/app-state";

export default function AuthPage() {
  const { auth, loginWithEmail, signupWithEmail, loginWithGoogle, logout } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  async function onSignup() {
    setRegisterStatus("");
    const ok = await signupWithEmail(email, password);
    if (ok) {
      setRegisterStatus("受付中です。確認メールの送信をお待ちください。");
    } else {
      setRegisterStatus("登録に失敗しました。入力内容を確認してください。");
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>新規登録 / ログイン</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={() => loginWithEmail(email, password)}>メールでログイン</Button>
          <Button className="w-full" variant="outline" onClick={onSignup}>メールで新規登録</Button>
          <Button className="w-full" variant="outline" onClick={() => loginWithGoogle()}>Googleでログイン</Button>
          <p className="text-xs text-blue-700">{registerStatus}</p>
          {auth.userId && <Button className="w-full" variant="ghost" onClick={() => logout()}>ログアウト</Button>}
          {auth.userId && <p className="text-xs text-muted-foreground">ログイン中: {auth.email}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
