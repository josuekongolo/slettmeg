import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { RequestsClient } from "./requests-client";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all deletion requests with platform details
  const requests = await db.deletionRequest.findMany({
    where: { userId: user.id },
    include: { platform: true },
    orderBy: { updatedAt: "desc" },
  });

  return <RequestsClient requests={requests} />;
}
