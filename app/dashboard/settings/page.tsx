import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch full user profile from database
  const profile = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect("/auth/login");
  }

  // Server Action to update profile
  async function updateProfile(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user) return;

    const name = formData.get("name") as string;

    await db.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
      },
    });

    revalidatePath("/dashboard/settings");
  }

  // Server Action to delete account
  async function deleteAccount() {
    "use server";

    const user = await getCurrentUser();
    if (!user) return;

    // Delete all user's data
    await db.chatMessage.deleteMany({ where: { userId: user.id } });
    await db.deletionRequest.deleteMany({ where: { userId: user.id } });
    await db.userPlatform.deleteMany({ where: { userId: user.id } });
    await db.subscription.deleteMany({ where: { userId: user.id } });
    await db.user.delete({ where: { id: user.id } });

    redirect("/");
  }

  return (
    <SettingsClient
      profile={profile}
      updateProfile={updateProfile}
      deleteAccount={deleteAccount}
    />
  );
}
