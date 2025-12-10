import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { PlatformDetailClient } from "./platform-detail-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  // Fetch platform by slug
  const platform = await db.platform.findUnique({
    where: { slug: id },
  });

  if (!platform) {
    notFound();
  }

  // Fetch existing deletion request for this platform
  const deletionRequest = await db.deletionRequest.findFirst({
    where: {
      userId: user.id,
      platformId: platform.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PlatformDetailClient
      platform={platform}
      deletionRequest={deletionRequest}
      userId={user.id}
    />
  );
}
