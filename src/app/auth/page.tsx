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
          <Button className="w-full" variant="outline" onClick={() => signupWithEmail(email, password)}>メールで新規登録</Button>
          <Button className="w-full" variant="outline" onClick={() => loginWithGoogle()}>Googleでログイン</Button>
          {auth.userId && <Button className="w-full" variant="ghost" onClick={() => logout()}>ログアウト</Button>}
          {auth.userId && <p className="text-xs text-muted-foreground">ログイン中: {auth.email}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
