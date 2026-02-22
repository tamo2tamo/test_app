"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/app-state";

export default function SignupPage() {
  const { signupWithEmail, loginWithGoogle } = useAppState();
  const [signupMode, setSignupMode] = useState<"email" | "google">("email");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPasswordConfirm, setShowSignupPasswordConfirm] = useState(false);
  const [registerStatus, setRegisterStatus] = useState("");

  async function onSignup() {
    setRegisterStatus("");
    if (signupPassword !== signupPasswordConfirm) {
      setRegisterStatus("パスワード確認が一致しません。");
      return;
    }
    const ok = await signupWithEmail(signupEmail, signupPassword);
    if (ok) {
      setRegisterStatus("受付中です。確認メールの送信をお待ちください。");
    } else {
      setRegisterStatus("登録に失敗しました。入力内容を確認してください。");
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex justify-end gap-2">
        <Link href="/auth">
          <Button variant="outline">ログインへ</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
      <Card id="signup">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
            <Button variant={signupMode === "email" ? "default" : "ghost"} onClick={() => setSignupMode("email")}>
              メール
            </Button>
            <Button variant={signupMode === "google" ? "default" : "ghost"} onClick={() => setSignupMode("google")}>
              Google
            </Button>
          </div>
          {signupMode === "email" ? (
            <>
              <Input placeholder="email@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              <div className="flex gap-2">
                <Input type={showSignupPassword ? "text" : "password"} placeholder="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                <Button type="button" variant="outline" onClick={() => setShowSignupPassword((v) => !v)}>
                  {showSignupPassword ? "非表示" : "表示"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input type={showSignupPasswordConfirm ? "text" : "password"} placeholder="password (確認)" value={signupPasswordConfirm} onChange={(e) => setSignupPasswordConfirm(e.target.value)} />
                <Button type="button" variant="outline" onClick={() => setShowSignupPasswordConfirm((v) => !v)}>
                  {showSignupPasswordConfirm ? "非表示" : "表示"}
                </Button>
              </div>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={onSignup}>新規登録する</Button>
            </>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => loginWithGoogle()}>Googleで登録 / ログイン</Button>
          )}
          <p className="text-xs text-blue-700">{registerStatus}</p>
        </CardContent>
      </Card>
    </main>
  );
}
