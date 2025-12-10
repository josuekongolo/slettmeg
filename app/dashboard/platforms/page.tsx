"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  HiSearch,
  HiPlus,
  HiExternalLink,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineExternalLink,
  HiArrowRight,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  platforms as allPlatforms,
  categories,
  type Platform,
} from "@/lib/platforms-data";
import { useDeletionStore, type PlatformStatus } from "@/lib/stores/deletion-store";
import { PlatformIcon } from "@/components/platform-icon";

interface UserPlatform extends Platform {
  status: PlatformStatus;
  progress?: number;
}

const statusConfig = {
  not_started: {
    label: "Ikke startet",
    icon: HiPlus,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  in_progress: {
    label: "Under arbeid",
    icon: HiOutlineClock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  completed: {
    label: "Fullført",
    icon: HiOutlineCheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  action_required: {
    label: "Krever handling",
    icon: HiOutlineExclamationCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

const difficultyConfig = {
  easy: { label: "Enkelt", variant: "success" as const },
  medium: { label: "Middels", variant: "warning" as const },
  hard: { label: "Vanskelig", variant: "destructive" as const },
};

export default function DashboardPlatformsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { userPlatforms, requests, getRequestByPlatform, getStats } = useDeletionStore();

  // Merge platform data with user status
  const userPlatformsWithData: UserPlatform[] = useMemo(() => {
    return allPlatforms.map((platform) => {
      const userPlatform = userPlatforms[platform.id];
      const request = getRequestByPlatform(platform.id);
      const progress = request
        ? (request.steps.filter((s) => s.completed).length / request.steps.length) * 100
        : 0;

      return {
        ...platform,
        status: userPlatform?.status || "not_started",
        progress,
      };
    });
  }, [userPlatforms, getRequestByPlatform]);

  const filteredPlatforms = useMemo(() => {
    return userPlatformsWithData.filter((platform) => {
      const matchesSearch = platform.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Alle" || platform.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || platform.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [userPlatformsWithData, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const storeStats = getStats();
    const inProgress = userPlatformsWithData.filter((p) => p.status === "in_progress").length;
    const completed = userPlatformsWithData.filter((p) => p.status === "completed").length;
    const actionRequired = userPlatformsWithData.filter((p) => p.status === "action_required").length;
    return {
      total: allPlatforms.length,
      inProgress,
      completed,
      actionRequired,
      requests: storeStats.total
    };
  }, [userPlatformsWithData, getStats]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plattformer</h1>
          <p className="text-muted-foreground">
            Velg plattformene du vil slette deg fra
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assistant">
            Få hjelp av AI
            <HiOutlineExternalLink className="ml-2" size={16} />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tilgjengelige
                </p>
                <p className="mt-1 text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <HiPlus size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Under arbeid
                </p>
                <p className="mt-1 text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <HiOutlineClock size={20} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fullført
                </p>
                <p className="mt-1 text-2xl font-bold">{stats.completed}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <HiOutlineCheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Krever handling
                </p>
                <p className="mt-1 text-2xl font-bold">{stats.actionRequired}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <HiOutlineExclamationCircle size={20} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1 lg:max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Søk etter plattform..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("all")}
          >
            Alle
          </Button>
          <Button
            variant={selectedStatus === "in_progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("in_progress")}
          >
            <HiOutlineClock className="mr-1" size={12} />
            Under arbeid
          </Button>
          <Button
            variant={selectedStatus === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("completed")}
          >
            <HiOutlineCheckCircle className="mr-1" size={12} />
            Fullført
          </Button>
          <Button
            variant={selectedStatus === "action_required" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("action_required")}
          >
            <HiOutlineExclamationCircle className="mr-1" size={12} />
            Krever handling
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.slice(0, 10).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="shrink-0 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Viser {filteredPlatforms.length} plattformer
        </p>
        {(selectedCategory !== "Alle" || selectedStatus !== "all" || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Alle");
              setSelectedStatus("all");
            }}
          >
            Nullstill filter
          </Button>
        )}
      </div>

      {/* Platforms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPlatforms.map((platform) => {
          const StatusIcon = statusConfig[platform.status].icon;
          return (
            <Card
              key={platform.id}
              className="group transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/50">
                      <PlatformIcon platformId={platform.id} size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{platform.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {platform.category}
                      </CardDescription>
                    </div>
                  </div>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${statusConfig[platform.status].bg}`}
                  >
                    <StatusIcon
                      className={`h-4 w-4 ${statusConfig[platform.status].color}`}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {platform.description}
                </p>

                {/* Progress bar for in-progress platforms */}
                {platform.status === "in_progress" && platform.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Fremgang</span>
                      <span className="font-medium">{Math.round(platform.progress)}%</span>
                    </div>
                    <Progress value={platform.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={difficultyConfig[platform.difficulty].variant}
                      className="text-xs"
                    >
                      {difficultyConfig[platform.difficulty].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {platform.estimatedTime}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      platform.status === "not_started"
                        ? "default"
                        : platform.status === "completed"
                        ? "outline"
                        : "secondary"
                    }
                    className="h-8 text-xs"
                    asChild
                  >
                    <Link href={`/dashboard/platforms/${platform.id}`}>
                      {platform.status === "not_started" ? (
                        <>
                          Start
                          <HiArrowRight className="ml-1" size={12} />
                        </>
                      ) : platform.status === "completed" ? (
                        "Se detaljer"
                      ) : platform.status === "action_required" ? (
                        "Se handling"
                      ) : (
                        <>
                          Fortsett
                          <HiArrowRight className="ml-1" size={12} />
                        </>
                      )}
                    </Link>
                  </Button>
                </div>
                {platform.guideUrl && (
                  <div className="pt-2 border-t">
                    <a
                      href={platform.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Se veiledning på slettmeg.no
                      <HiExternalLink size={12} />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPlatforms.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <HiSearch size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Ingen plattformer funnet</h3>
          <p className="text-muted-foreground">
            Prøv å endre søket eller velg en annen kategori.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Alle");
              setSelectedStatus("all");
            }}
          >
            Nullstill filter
          </Button>
        </div>
      )}
    </div>
  );
}
