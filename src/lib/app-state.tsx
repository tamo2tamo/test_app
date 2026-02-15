"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { pushToast } from "@/lib/toast";
import { PostRecord, ReportRecord } from "@/lib/types";

interface AuthState {
  userId: string | null;
  email: string | null;
  aal: "aal1" | "aal2";
  isAdmin: boolean;
}

interface AppState {
  posts: PostRecord[];
  reports: ReportRecord[];
  auth: AuthState;
  loading: boolean;
  refresh: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  submitPost: (post: Omit<PostRecord, "id" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "views" | "reactions" | "reports">) => Promise<boolean>;
  approvePost: (postId: string) => Promise<void>;
  hidePost: (postId: string) => Promise<void>;
  reactPost: (postId: string, key: "helpful" | "clear" | "support") => Promise<void>;
  reportPost: (postId: string, reason: ReportRecord["reason"], memo: string) => Promise<void>;
}

const AppStateContext = createContext<AppState | null>(null);
const supabase = createSupabaseBrowserClient();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error ?? "request_failed");
  }
  return json as T;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [auth, setAuth] = useState<AuthState>({ userId: null, email: null, aal: "aal1", isAdmin: false });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const me = await fetchJson<{ userId: string | null; email: string | null; aal: "aal1" | "aal2"; isAdmin: boolean }>("/api/me");
      setAuth({ userId: me.userId, email: me.email, aal: me.aal, isAdmin: me.isAdmin });

      const postScope = me.isAdmin ? "admin" : "default";
      const postsRes = await fetchJson<{ items: PostRecord[] }>(`/api/posts?scope=${postScope}`);
      setPosts(postsRes.items ?? []);

      if (me.isAdmin) {
        const reportsRes = await fetchJson<{ items: ReportRecord[] }>("/api/reports");
        setReports(reportsRes.items ?? []);
      } else {
        setReports([]);
      }
    } catch {
      setPosts([]);
      setReports([]);
      setAuth({ userId: null, email: null, aal: "aal1", isAdmin: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  const value = useMemo<AppState>(
    () => ({
      posts,
      reports,
      auth,
      loading,
      refresh,
      loginWithEmail: async (email, password) => {
        if (!supabase) {
          pushToast("Supabase設定が不足しています", "error");
          return false;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          pushToast(error.message, "error");
          return false;
        }
        pushToast("ログインしました", "success");
        await refresh();
        return true;
      },
      signupWithEmail: async (email, password) => {
        if (!supabase) {
          pushToast("Supabase設定が不足しています", "error");
          return false;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          pushToast(error.message, "error");
          return false;
        }
        pushToast("確認メールを送信しました", "success");
        return true;
      },
      loginWithGoogle: async () => {
        if (!supabase) {
          pushToast("Supabase設定が不足しています", "error");
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
        if (error) pushToast(error.message, "error");
      },
      logout: async () => {
        if (!supabase) {
          pushToast("Supabase設定が不足しています", "error");
          return;
        }
        await supabase.auth.signOut();
        pushToast("ログアウトしました", "info");
        await refresh();
      },
      submitPost: async (payload) => {
        try {
          await fetchJson<{ status: string }>("/api/posts", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          pushToast("投稿を受け付けました（審査中）", "success");
          await refresh();
          return true;
        } catch (e) {
          pushToast(e instanceof Error ? e.message : "投稿に失敗しました", "error");
          return false;
        }
      },
      approvePost: async (postId) => {
        try {
          await fetchJson<{ ok: boolean }>("/api/admin/reviews", {
            method: "POST",
            body: JSON.stringify({ postId, action: "approve" }),
          });
          pushToast("投稿を公開しました", "success");
          await refresh();
        } catch (e) {
          pushToast(e instanceof Error ? e.message : "承認に失敗しました", "error");
        }
      },
      hidePost: async (postId) => {
        try {
          await fetchJson<{ ok: boolean }>("/api/admin/reviews", {
            method: "POST",
            body: JSON.stringify({ postId, action: "reject" }),
          });
          pushToast("投稿を非公開化しました", "info");
          await refresh();
        } catch (e) {
          pushToast(e instanceof Error ? e.message : "非公開化に失敗しました", "error");
        }
      },
      reactPost: async (postId, key) => {
        try {
          await fetchJson<{ ok: boolean }>("/api/reactions", {
            method: "POST",
            body: JSON.stringify({ postId, type: key }),
          });
          pushToast("リアクションを送信しました", "success");
          await refresh();
        } catch (e) {
          pushToast(e instanceof Error ? e.message : "リアクションに失敗しました", "error");
        }
      },
      reportPost: async (postId, reason, memo) => {
        try {
          await fetchJson<{ status: string }>("/api/reports", {
            method: "POST",
            body: JSON.stringify({ postId, reason, memo }),
          });
          pushToast("通報を受け付けました", "info");
          await refresh();
        } catch (e) {
          pushToast(e instanceof Error ? e.message : "通報に失敗しました", "error");
        }
      },
    }),
    [posts, reports, auth, loading, refresh],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
