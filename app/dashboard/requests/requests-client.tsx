"use client";

import { useState, useMemo } from "react";
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
import { PlatformIcon } from "@/components/platform-icon";
import type { DeletionRequest, Platform } from "@prisma/client";
import { useRouter } from "next/navigation";

interface RequestsClientProps {
  requests: (DeletionRequest & { platform: Platform })[];
}

const statusConfig = {
  COMPLETED: {
    label: "Fullført",
    icon: HiOutlineCheckCircle,
    variant: "success" as const,
    color: "text-green-500",
  },
  PENDING: {
    label: "Venter",
    icon: HiOutlineClock,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
  SUBMITTED: {
    label: "Sendt",
    icon: HiOutlineClock,
    variant: "default" as const,
    color: "text-blue-500",
  },
  IN_PROGRESS: {
    label: "Under behandling",
    icon: HiOutlineClock,
    variant: "warning" as const,
    color: "text-amber-500",
  },
  ACTION_REQUIRED: {
    label: "Krever handling",
    icon: HiOutlineExclamationCircle,
    variant: "destructive" as const,
    color: "text-red-500",
  },
  REJECTED: {
    label: "Avvist",
    icon: HiOutlineExclamationCircle,
    variant: "destructive" as const,
    color: "text-red-500",
  },
};

const requestTypeLabels: Record<string, string> = {
  ACCOUNT_DELETION: "Kontosletting",
  DATA_EXPORT: "Dataeksport",
  GDPR_REQUEST: "GDPR-forespørsel",
  PARTIAL_DELETION: "Delvis sletting",
};

export function RequestsClient({ requests: initialRequests }: RequestsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [requests, setRequests] = useState(initialRequests);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = request.platform.name
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
      completed: requests.filter((r) => r.status === "COMPLETED").length,
      pending: requests.filter((r) => r.status === "PENDING" || r.status === "SUBMITTED").length,
      inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
      action: requests.filter((r) => r.status === "ACTION_REQUIRED").length,
    };
  }, [requests]);

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      const response = await fetch(`/api/requests/${requestToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setRequests(prev => prev.filter(r => r.id !== requestToDelete));
        setRequestToDelete(null);
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        console.error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const confirmDelete = (requestId: string) => {
    setRequestToDelete(requestId);
    setDeleteDialogOpen(true);
  };

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
            <TabsTrigger value="PENDING">Venter</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">Under arbeid</TabsTrigger>
            <TabsTrigger value="COMPLETED">Fullført</TabsTrigger>
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
                const status = statusConfig[request.status as keyof typeof statusConfig];
                const StatusIcon = status?.icon || HiOutlineClock;
                const progress = 0; // Will be calculated from steps when implemented

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted/50">
                        <PlatformIcon platformId={request.platform.slug} size={26} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium truncate">{request.platform.name}</p>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {requestTypeLabels[request.type] || request.type}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4">
                          <p className="text-sm text-muted-foreground">
                            {request.status === "COMPLETED" ? "Fullført" : "Pågår"}
                          </p>
                          {request.status !== "COMPLETED" && (
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
                      <Badge variant={status?.variant || "secondary"}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status?.label || "Ukjent"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HiDotsHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/platforms/${request.platform.slug}`}>
                              <HiExternalLink className="mr-2" size={16} />
                              Se detaljer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/platforms/${request.platform.slug}`}>
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
