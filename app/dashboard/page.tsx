"use client";

import { useMemo, useState, useEffect } from "react";
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
import { CgSpinner } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeletionStore } from "@/lib/stores/deletion-store";
import { platforms as allPlatforms } from "@/lib/platforms-data";
import { PlatformIcon } from "@/components/platform-icon";

const statusConfig = {
  pending: { label: "Venter", variant: "secondary" as const, dot: "bg-yellow-500" },
  submitted: { label: "Sendt", variant: "default" as const, dot: "bg-blue-500" },
  in_progress: { label: "Behandles", variant: "default" as const, dot: "bg-blue-500" },
  completed: { label: "Fullført", variant: "success" as const, dot: "bg-green-500" },
  action_required: { label: "Handling", variant: "warning" as const, dot: "bg-red-500" },
  rejected: { label: "Avvist", variant: "destructive" as const, dot: "bg-red-500" },
};

export default function DashboardPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { requests, userPlatforms, getStats } = useDeletionStore();

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const stats = useMemo(() => {
    const storeStats = getStats();
    const activePlatforms = Object.values(userPlatforms).filter(
      (p) => p.status === "in_progress" || p.status === "action_required"
    ).length;
    const completedPlatforms = Object.values(userPlatforms).filter(
      (p) => p.status === "completed"
    ).length;

    return {
      activePlatforms,
      completedPlatforms,
      pending: storeStats.pending + storeStats.inProgress,
      actionRequired: storeStats.actionRequired,
      totalRequests: storeStats.total,
    };
  }, [userPlatforms, getStats]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (requests.length === 0) return 0;
    const totalSteps = requests.reduce((acc, r) => acc + (r.steps?.length || 0), 0);
    const completedSteps = requests.reduce(
      (acc, r) => acc + (r.steps?.filter((s) => s.completed).length || 0),
      0
    );
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }, [requests]);

  // Get recent requests (last 5)
  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [requests]);

  // Get suggested platforms (popular ones not started)
  const suggestedPlatforms = useMemo(() => {
    const popularIds = ["facebook", "instagram", "google", "tiktok", "linkedin", "spotify"];
    return allPlatforms
      .filter((p) => popularIds.includes(p.id) && !userPlatforms[p.id])
      .slice(0, 4);
  }, [userPlatforms]);

  // Show loading skeleton during hydration to prevent mismatch
  if (!hasMounted) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-3.5 shadow-sm">
              <Skeleton className="h-8 w-8 rounded-md mb-2.5" />
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-3">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-6" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
            <Skeleton className="h-10 w-10 rounded-lg mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="space-y-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-40" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

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

        {recentRequests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Ingen forespørsler ennå. Start med å velge en plattform.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {recentRequests.map((request) => {
              const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
              const steps = request.steps || [];
              const completedSteps = steps.filter(s => s.completed).length;
              const totalSteps = steps.length;
              const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

              return (
                <Link
                  key={request.id}
                  href={`/dashboard/platforms/${request.platformId}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                      <PlatformIcon platformId={request.platformId} size={22} />
                    </div>
                    <div>
                      <p className="font-medium">{request.platformName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Progress value={progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">
                          {completedSteps}/{totalSteps} steg
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
                href={`/dashboard/platforms/${platform.id}`}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 hover:border-primary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  <PlatformIcon platformId={platform.id} size={22} />
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
