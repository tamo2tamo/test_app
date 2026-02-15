"use client";

import { useAppState } from "@/lib/app-state";
import { pushToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

export function ReactionButtons({ postId }: { postId: string }) {
  const { reactPost, reportPost } = useAppState();

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => void reactPost(postId, "helpful")}>参考になった</Button>
      <Button size="sm" variant="outline" onClick={() => void reactPost(postId, "clear")}>わかりやすい</Button>
      <Button size="sm" variant="outline" onClick={() => void reactPost(postId, "support")}>応援</Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          void reportPost(postId, "other", "確認お願いします");
          pushToast("通報を送信しました", "info");
        }}
      >
        通報
      </Button>
    </div>
  );
}
