import Link from "next/link";
import {
  HiOutlineGlobe,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiArrowRight,
  HiOutlineExternalLink,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/platform-icon";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const statusConfig = {
  PENDING: { label: "Venter", variant: "secondary" as const, dot: "bg-yellow-500" },
  SUBMITTED: { label: "Sendt", variant: "default" as const, dot: "bg-blue-500" },
  IN_PROGRESS: { label: "Behandles", variant: "default" as const, dot: "bg-blue-500" },
  COMPLETED: { label: "Fullført", variant: "success" as const, dot: "bg-green-500" },
  ACTION_REQUIRED: { label: "Handling", variant: "warning" as const, dot: "bg-red-500" },
  REJECTED: { label: "Avvist", variant: "destructive" as const, dot: "bg-red-500" },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's deletion requests
  const requests = await db.deletionRequest.findMany({
    where: { userId: user.id },
    include: { platform: true },
    orderBy: { updatedAt: "desc" },
    take: 5, // Get recent 5 for display
  });

  // Fetch user platforms
  const userPlatforms = await db.userPlatform.findMany({
    where: { userId: user.id },
  });

  // Calculate stats
  const activePlatforms = userPlatforms.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "ACTION_REQUIRED"
  ).length;

  const completedPlatforms = userPlatforms.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const allRequests = await db.deletionRequest.findMany({
    where: { userId: user.id },
  });

  const pendingRequests = allRequests.filter(
    (r) => r.status === "PENDING" || r.status === "IN_PROGRESS" || r.status === "SUBMITTED"
  ).length;

  const actionRequiredRequests = allRequests.filter(
    (r) => r.status === "ACTION_REQUIRED"
  ).length;

  const stats = {
    activePlatforms,
    completedPlatforms,
    pending: pendingRequests,
    actionRequired: actionRequiredRequests,
    totalRequests: allRequests.length,
  };

  // Calculate overall progress (simple version - can be enhanced)
  const overallProgress = stats.totalRequests > 0
    ? Math.round((completedPlatforms / (completedPlatforms + activePlatforms || 1)) * 100)
    : 0;

  // Get suggested platforms (popular ones user hasn't started)
  const popularPlatformSlugs = ["facebook", "instagram", "google", "tiktok", "linkedin", "spotify"];
  const userPlatformIds = userPlatforms.map(up => up.platformId);

  const suggestedPlatforms = await db.platform.findMany({
    where: {
      slug: { in: popularPlatformSlugs },
      id: { notIn: userPlatformIds },
    },
    take: 4,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Velkommen tilbake</h1>
          <p className="text-muted-foreground">
            Her er en oversikt over dine slettingsforespørsler.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/platforms">
            Legg til plattform
            <HiArrowRight className="ml-2" size={16} />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-3.5 shadow-sm transition-all hover:shadow-md border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <HiOutlineGlobe size={16} className="text-primary" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight">{stats.activePlatforms}</span>
            <p className="text-xs text-muted-foreground">Aktive plattformer</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3.5 shadow-sm transition-all hover:shadow-md border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100">
              <HiOutlineCheckCircle size={16} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight">{stats.completedPlatforms}</span>
            <p className="text-xs text-muted-foreground">Fullførte slettinger</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3.5 shadow-sm transition-all hover:shadow-md border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-100">
              <HiOutlineClock size={16} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight">{stats.pending}</span>
            <p className="text-xs text-muted-foreground">Under behandling</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3.5 shadow-sm transition-all hover:shadow-md border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
              <HiOutlineExclamationCircle size={16} className="text-red-600" />
            </div>
            {stats.actionRequired > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight">{stats.actionRequired}</span>
            <p className="text-xs text-muted-foreground">Krever handling</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Progress Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Fremgang</h2>
              <p className="text-sm text-muted-foreground">Din slettingsstatus</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/requests">
                Se detaljer
                <HiOutlineExternalLink className="ml-1" size={12} />
              </Link>
            </Button>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <HiOutlineDocumentText size={28} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                Du har ingen aktive forespørsler ennå.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard/platforms">
                  Velg en plattform å slette
                  <HiArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total fremgang</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{stats.completedPlatforms}</div>
                  <div className="text-xs text-muted-foreground">Fullført</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pågår</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-red-600">{stats.actionRequired}</div>
                  <div className="text-xs text-muted-foreground">Handling</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Card */}
        <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <RiRobot2Line size={20} className="text-primary" />
          </div>
          <h2 className="mb-1 text-lg font-medium">AI Assistent</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Få hjelp til å slette dine kontoer
          </p>

          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <HiOutlineCheckCircle size={16} className="text-primary" />
              <span>Finn slettingslenker</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <HiOutlineCheckCircle size={16} className="text-primary" />
              <span>Generer GDPR-forespørsler</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <HiOutlineCheckCircle size={16} className="text-primary" />
              <span>Steg-for-steg veiledning</span>
            </li>
          </ul>

          <Button className="w-full" asChild>
            <Link href="/dashboard/assistant">
              Start samtale
              <HiArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-medium">Nylige forespørsler</h2>
            <p className="text-sm text-muted-foreground">Dine siste aktiviteter</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/requests">
              Se alle
              <HiOutlineExternalLink className="ml-1" size={12} />
            </Link>
          </Button>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Ingen forespørsler ennå. Start med å velge en plattform.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => {
              const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;
              const progress = 0; // Will be calculated from steps when implemented

              return (
                <Link
                  key={request.id}
                  href={`/dashboard/platforms/${request.platform.slug}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                      <PlatformIcon platformId={request.platform.slug} size={22} />
                    </div>
                    <div>
                      <p className="font-medium">{request.platform.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Progress value={progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {new Date(request.updatedAt).toLocaleDateString("nb-NO", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                      <span className="text-sm font-medium">
                        {status.label}
                      </span>
                    </div>
                    <HiArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested Platforms */}
      {suggestedPlatforms.length > 0 && requests.length === 0 && (
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Kom i gang</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Her er noen populære plattformer du kan starte med:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {suggestedPlatforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/dashboard/platforms/${platform.slug}`}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 hover:border-primary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  <PlatformIcon platformId={platform.slug} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{platform.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{platform.category}</p>
                </div>
                <HiArrowRight size={16} className="text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
