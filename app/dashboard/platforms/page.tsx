import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PlatformsClient } from "./platforms-client";

export default async function DashboardPlatformsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all platforms from database
  const platforms = await db.platform.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch user's platforms to show status
  const userPlatforms = await db.userPlatform.findMany({
    where: { userId: user.id },
  });

  // Fetch user's deletion requests
  const requests = await db.deletionRequest.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      platformId: true,
      status: true,
    },
  });

  // Get unique categories from platforms
  const categories = ["Alle", ...Array.from(new Set(platforms.map(p => p.category)))];

  return (
    <PlatformsClient
      platforms={platforms}
      userPlatforms={userPlatforms}
      requests={requests}
      categories={categories}
    />
  );
}
