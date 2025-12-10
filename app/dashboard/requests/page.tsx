"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  HiSearch,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiExternalLink,
  HiDotsHorizontal,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiArrowRight,
  HiPlus,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletionStore, type RequestStatus } from "@/lib/stores/deletion-store";
import { PlatformIcon } from "@/components/platform-icon";

const statusConfig: Record<RequestStatus, { label: string; icon: typeof HiOutlineCheckCircle; variant: "default" | "secondary" | "success" | "warning" | "destructive"; color: string }> = {
  completed: {
    label: "Fullført",
    icon: HiOutlineCheckCircle,
    variant: "success",
    color: "text-green-500",
  },
  pending: {
    label: "Venter",
    icon: HiOutlineClock,
    variant: "secondary",
    color: "text-muted-foreground",
  },
  submitted: {
    label: "Sendt",
    icon: HiOutlineClock,
    variant: "default",
    color: "text-blue-500",
  },
  in_progress: {
    label: "Under behandling",
    icon: HiOutlineClock,
    variant: "warning",
    color: "text-amber-500",
  },
  action_required: {
    label: "Krever handling",
    icon: HiOutlineExclamationCircle,
    variant: "destructive",
    color: "text-red-500",
  },
  rejected: {
    label: "Avvist",
    icon: HiOutlineExclamationCircle,
    variant: "destructive",
    color: "text-red-500",
  },
};

const requestTypeLabels: Record<string, string> = {
  account_deletion: "Kontosletting",
  data_export: "Dataeksport",
  gdpr_request: "GDPR-forespørsel",
  partial_deletion: "Delvis sletting",
};

export default function RequestsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const { requests, deleteRequest, getStats } = useDeletionStore();

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = request.platformName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      completed: requests.filter((r) => r.status === "completed").length,
      pending: requests.filter((r) => r.status === "pending" || r.status === "submitted").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      action: requests.filter((r) => r.status === "action_required").length,
    };
  }, [requests]);

  const handleDeleteRequest = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete);
      setRequestToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (requestId: string) => {
    setRequestToDelete(requestId);
    setDeleteDialogOpen(true);
  };

  // Show loading skeleton during hydration to prevent mismatch
  if (!hasMounted) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-64" />
        </div>

        {/* List Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Slettingsforespørsler
          </h1>
          <p className="text-muted-foreground">
            Oversikt over alle dine slettingsforespørsler
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/platforms">
            <HiPlus className="mr-2" size={16} />
            Ny forespørsel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totalt</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <HiOutlineDocumentText size={32} className="text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fullført</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <HiOutlineCheckCircle size={32} className="text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under arbeid</p>
                <p className="text-2xl font-bold">{stats.inProgress + stats.pending}</p>
              </div>
              <HiOutlineClock size={32} className="text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Krever handling</p>
                <p className="text-2xl font-bold">{stats.action}</p>
              </div>
              <HiOutlineExclamationCircle size={32} className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Søk etter plattform..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="pending">Venter</TabsTrigger>
            <TabsTrigger value="in_progress">Under arbeid</TabsTrigger>
            <TabsTrigger value="completed">Fullført</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <HiOutlineDocumentText size={32} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Ingen forespørsler ennå</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start med å velge en plattform du vil slette deg fra. Vi guider deg gjennom hele prosessen.
            </p>
            <Button asChild>
              <Link href="/dashboard/platforms">
                Se plattformer
                <HiArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Forespørsler</CardTitle>
            <CardDescription>
              {filteredRequests.length} forespørsel{filteredRequests.length !== 1 ? "er" : ""} funnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                const steps = request.steps || [];
                const completedSteps = steps.filter((s) => s.completed).length;
                const totalSteps = steps.length;
                const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted/50">
                        <PlatformIcon platformId={request.platformId} size={26} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium truncate">{request.platformName}</p>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {requestTypeLabels[request.type] || request.type}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4">
                          <p className="text-sm text-muted-foreground">
                            {completedSteps} av {totalSteps} steg fullført
                          </p>
                          {request.status !== "completed" && (
                            <div className="flex-1 max-w-[120px]">
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden text-right sm:block">
                        <p className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString("nb-NO")}
                        </p>
                        <p className="text-xs text-muted-foreground">Opprettet</p>
                      </div>
                      <Badge variant={statusConfig[request.status].variant}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[request.status].label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HiDotsHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/platforms/${request.platformId}`}>
                              <HiExternalLink className="mr-2" size={16} />
                              Se detaljer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/platforms/${request.platformId}`}>
                              <HiOutlineDocumentText className="mr-2" size={16} />
                              Fortsett prosessen
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => confirmDelete(request.id)}
                          >
                            <HiOutlineTrash className="mr-2" size={16} />
                            Slett forespørsel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && requests.length > 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Ingen forespørsler funnet. Prøv å endre søket.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette forespørselen og all fremgang. Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
