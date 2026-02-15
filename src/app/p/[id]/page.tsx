import { redirect } from "next/navigation";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/mock/nisa_post_detail.html?id=${encodeURIComponent(id)}`);
}
