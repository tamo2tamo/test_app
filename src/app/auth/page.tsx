"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/app-state";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { pushToast } from "@/lib/toast";

export default function AuthPage() {
  const { auth, loginWithEmail, loginWithGoogle, logout, refresh } = useAppState();
  const supabase = createSupabaseBrowserClient();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState("");
  const [mfaChallengeId, setMfaChallengeId] = useState("");
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  async function onLogin() {
    const ok = await loginWithEmail(loginEmail, loginPassword);
    if (ok) {
      setStatus({ type: "success", message: "ログインしました。" });
    } else {
      setStatus({ type: "error", message: "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。" });
    }
  }

  async function onIssuePassword() {
    if (!loginEmail) {
      pushToast("ログイン用メールアドレスを入力してください", "error");
      setStatus({ type: "error", message: "ログイン用メールアドレスを入力してください。" });
      return;
    }
    if (!supabase) {
      pushToast("Supabase設定が不足しています", "error");
      setStatus({ type: "error", message: "Supabase設定が不足しています。" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) {
      pushToast(error.message, "error");
      setStatus({ type: "error", message: `パスワード発行に失敗しました: ${error.message}` });
      return;
    }
    pushToast("パスワード再設定メールを送信しました", "success");
    setStatus({ type: "success", message: "パスワード再設定メールを送信しました。" });
  }

  async function onStartTotpSetup() {
    if (!supabase) {
      pushToast("Supabase設定が不足しています", "error");
      setStatus({ type: "error", message: "Supabase設定が不足しています。" });
      return;
    }

    setMfaBusy(true);
    try {
      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "NISA TOTP",
      });
      if (enrollError) throw enrollError;

      const factorId = enrollData.id;
      const qrCode = enrollData.totp.qr_code ?? "";
      if (!factorId || !qrCode) {
        throw new Error("TOTPの開始に失敗しました");
      }

      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });
      if (challengeError) throw challengeError;

      setMfaFactorId(factorId);
      setMfaChallengeId(challengeData.id);
      setMfaQrCode(qrCode);
      pushToast("認証アプリでQRコードを読み取り、6桁コードを入力してください", "info");
      setStatus({ type: "info", message: "QRコードを読み取り、6桁コードを入力してください。" });
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "2段階認証の開始に失敗しました", "error");
      setStatus({ type: "error", message: e instanceof Error ? e.message : "2段階認証の開始に失敗しました。" });
    } finally {
      setMfaBusy(false);
    }
  }

  async function onVerifyTotp() {
    if (!supabase) {
      pushToast("Supabase設定が不足しています", "error");
      setStatus({ type: "error", message: "Supabase設定が不足しています。" });
      return;
    }
    if (!mfaFactorId || !mfaChallengeId) {
      pushToast("先に2段階認証セットアップを開始してください", "error");
      setStatus({ type: "error", message: "先に2段階認証セットアップを開始してください。" });
      return;
    }
    if (!mfaCode) {
      pushToast("6桁コードを入力してください", "error");
      setStatus({ type: "error", message: "6桁コードを入力してください。" });
      return;
    }

    setMfaBusy(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: mfaCode,
      });
      if (error) throw error;

      setMfaCode("");
      setMfaFactorId("");
      setMfaChallengeId("");
      setMfaQrCode("");
      await refresh();
      pushToast("2段階認証を有効化しました", "success");
      setStatus({ type: "success", message: "2段階認証を有効化しました。" });
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "2段階認証の検証に失敗しました", "error");
      setStatus({ type: "error", message: e instanceof Error ? e.message : "2段階認証の検証に失敗しました。" });
    } finally {
      setMfaBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex justify-end">
        <Link href="/">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
      <Card id="login">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {status && (
            <p className={`rounded-md border px-3 py-2 text-sm ${
              status.type === "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : status.type === "error"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-blue-300 bg-blue-50 text-blue-700"
            }`}>
              {status.message}
            </p>
          )}
          <Input placeholder="email@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <div className="flex gap-2">
            <Input type={showLoginPassword ? "text" : "password"} placeholder="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => setShowLoginPassword((v) => !v)}>
              {showLoginPassword ? "非表示" : "表示"}
            </Button>
          </div>
          <Button className="w-full" onClick={() => void onLogin()}>ログイン</Button>
          <Button className="w-full" variant="outline" onClick={() => void onIssuePassword()}>パスワードを発行</Button>
          <Button className="w-full" variant="outline" onClick={() => {
            setStatus({ type: "info", message: "Googleログイン画面へ遷移します。" });
            void loginWithGoogle();
          }}>Googleでログイン</Button>
          <Link href="/auth/signup" className="block">
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">新規登録へ</Button>
          </Link>
        </CardContent>
      </Card>
      {auth.userId && (
        <Card className="mt-4">
          <CardContent className="space-y-2 pt-6">
            <p className="text-sm text-muted-foreground">ログイン中: {auth.email}</p>
            {auth.aal !== "aal2" ? (
              <div className="space-y-3 rounded-md border border-border p-3">
                <p className="text-sm font-medium">2段階認証（TOTP）を設定</p>
                <p className="text-xs text-muted-foreground">新規登録後はここで2段階認証を完了してください。投稿やリアクションに `aal2` が必要です。</p>
                {!mfaQrCode && (
                  <Button className="w-full" onClick={() => void onStartTotpSetup()} disabled={mfaBusy}>
                    {mfaBusy ? "開始中..." : "2段階認証を開始"}
                  </Button>
                )}
                {mfaQrCode && (
                  <div className="space-y-2">
                    <Image
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(mfaQrCode)}`}
                      alt="TOTP QR Code"
                      width={176}
                      height={176}
                      unoptimized
                      className="mx-auto rounded border border-border bg-white p-2"
                    />
                    <Input
                      placeholder="6桁コード"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                    />
                    <Button className="w-full" onClick={() => void onVerifyTotp()} disabled={mfaBusy}>
                      {mfaBusy ? "検証中..." : "2段階認証を有効化"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-green-700">2段階認証は有効です（aal2）。</p>
            )}
            <Button className="w-full" variant="ghost" onClick={() => logout()}>ログアウト</Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
