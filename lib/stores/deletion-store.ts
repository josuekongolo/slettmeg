"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type PlatformStatus = "not_started" | "in_progress" | "completed" | "action_required";
export type RequestType = "account_deletion" | "data_export" | "gdpr_request" | "partial_deletion";
export type RequestStatus = "pending" | "submitted" | "in_progress" | "completed" | "rejected" | "action_required";

export interface DeletionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface DeletionRequest {
  id: string;
  platformId: string;
  platformName: string;
  type: RequestType;
  status: RequestStatus;
  message?: string;
  response?: string;
  steps: DeletionStep[];
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface UserPlatform {
  platformId: string;
  status: PlatformStatus;
  username?: string;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

interface DeletionStore {
  // State
  requests: DeletionRequest[];
  userPlatforms: Record<string, UserPlatform>;

  // Request Actions
  createRequest: (platformId: string, platformName: string, type: RequestType) => DeletionRequest;
  updateRequest: (requestId: string, updates: Partial<DeletionRequest>) => void;
  deleteRequest: (requestId: string) => void;
  getRequestsByStatus: (status: RequestStatus) => DeletionRequest[];
  getRequestByPlatform: (platformId: string) => DeletionRequest | undefined;

  // Step Actions
  completeStep: (requestId: string, stepId: string) => void;
  uncompleteStep: (requestId: string, stepId: string) => void;

  // Platform Status Actions
  updatePlatformStatus: (platformId: string, status: PlatformStatus) => void;
  getPlatformStatus: (platformId: string) => PlatformStatus;
  startDeletion: (platformId: string, platformName: string) => DeletionRequest;

  // Stats
  getStats: () => {
    total: number;
    inProgress: number;
    completed: number;
    actionRequired: number;
    pending: number;
  };
}

// Generate default deletion steps based on platform
function generateDeletionSteps(platformId: string, platformName: string): DeletionStep[] {
  const baseSteps: DeletionStep[] = [
    {
      id: "backup",
      title: "Last ned dine data (valgfritt)",
      description: `Før du sletter kontoen din, kan du laste ned en kopi av dine data fra ${platformName}.`,
      completed: false,
    },
    {
      id: "login",
      title: "Logg inn på kontoen",
      description: `Logg inn på din ${platformName}-konto med dine innloggingsdetaljer.`,
      completed: false,
    },
    {
      id: "settings",
      title: "Gå til kontoinnstillinger",
      description: "Naviger til innstillinger eller kontoinnstillinger i menyen.",
      completed: false,
    },
    {
      id: "find-delete",
      title: "Finn slettealternativet",
      description: "Se etter 'Slett konto', 'Deaktiver konto' eller lignende alternativ.",
      completed: false,
    },
    {
      id: "confirm",
      title: "Bekreft slettingen",
      description: "Følg instruksjonene for å bekrefte at du vil slette kontoen. Du kan bli bedt om å oppgi passord.",
      completed: false,
    },
    {
      id: "verify",
      title: "Bekreft via e-post",
      description: "Sjekk e-posten din for en bekreftelseslenke og klikk på den for å fullføre slettingen.",
      completed: false,
    },
  ];

  // Add platform-specific steps
  const platformSpecificSteps: Record<string, DeletionStep[]> = {
    facebook: [
      ...baseSteps.slice(0, 2),
      {
        id: "fb-settings",
        title: "Gå til Innstillinger og personvern",
        description: "Klikk på profilbildet ditt øverst til høyre, deretter 'Innstillinger og personvern' → 'Innstillinger'.",
        completed: false,
      },
      {
        id: "fb-meta",
        title: "Åpne Meta-kontosenter",
        description: "Klikk på 'Kontosenter' i menyen til venstre.",
        completed: false,
      },
      {
        id: "fb-personal",
        title: "Gå til Personlige opplysninger",
        description: "Velg 'Personlige opplysninger' → 'Kontoeierskap og kontroll'.",
        completed: false,
      },
      {
        id: "fb-deactivate",
        title: "Velg Deaktivering eller sletting",
        description: "Velg 'Deaktivering eller sletting' og deretter 'Slett konto'.",
        completed: false,
      },
      {
        id: "fb-confirm",
        title: "Bekreft permanent sletting",
        description: "Bekreft at du vil slette kontoen. Merk: Det tar 30 dager før kontoen slettes permanent.",
        completed: false,
      },
    ],
    instagram: [
      ...baseSteps.slice(0, 2),
      {
        id: "ig-profile",
        title: "Gå til profilen din",
        description: "Trykk på profilikonet nederst til høyre.",
        completed: false,
      },
      {
        id: "ig-settings",
        title: "Åpne innstillinger",
        description: "Trykk på hamburgermenyen (≡) øverst til høyre og velg 'Innstillinger og personvern'.",
        completed: false,
      },
      {
        id: "ig-accounts-center",
        title: "Gå til Kontosenter",
        description: "Velg 'Kontosenter' → 'Personlige opplysninger' → 'Kontoeierskap og kontroll'.",
        completed: false,
      },
      {
        id: "ig-delete",
        title: "Velg Slett konto",
        description: "Velg 'Deaktivering eller sletting' → 'Slett konto' → velg Instagram-kontoen.",
        completed: false,
      },
      {
        id: "ig-confirm",
        title: "Bekreft slettingen",
        description: "Skriv inn passordet ditt og bekreft slettingen.",
        completed: false,
      },
    ],
    google: [
      ...baseSteps.slice(0, 1),
      {
        id: "google-account",
        title: "Gå til Google-kontoen din",
        description: "Besøk myaccount.google.com og logg inn.",
        completed: false,
      },
      {
        id: "google-data",
        title: "Gå til Data og personvern",
        description: "Klikk på 'Data og personvern' i menyen til venstre.",
        completed: false,
      },
      {
        id: "google-more",
        title: "Finn flere alternativer",
        description: "Bla ned til 'Flere alternativer' og klikk på 'Slett Google-kontoen din'.",
        completed: false,
      },
      {
        id: "google-verify",
        title: "Bekreft identiteten din",
        description: "Du kan bli bedt om å oppgi passordet ditt på nytt.",
        completed: false,
      },
      {
        id: "google-review",
        title: "Gjennomgå hva som slettes",
        description: "Les gjennom informasjonen om hva som vil bli slettet (Gmail, YouTube, Drive, osv.).",
        completed: false,
      },
      {
        id: "google-confirm",
        title: "Bekreft slettingen",
        description: "Kryss av i boksene for å bekrefte, og klikk 'Slett konto'.",
        completed: false,
      },
    ],
    tiktok: [
      ...baseSteps.slice(0, 2),
      {
        id: "tiktok-profile",
        title: "Gå til profilen din",
        description: "Trykk på 'Profil' nederst til høyre.",
        completed: false,
      },
      {
        id: "tiktok-menu",
        title: "Åpne innstillingsmenyen",
        description: "Trykk på hamburgermenyen (≡) øverst til høyre.",
        completed: false,
      },
      {
        id: "tiktok-settings",
        title: "Velg Innstillinger og personvern",
        description: "Velg 'Innstillinger og personvern' fra menyen.",
        completed: false,
      },
      {
        id: "tiktok-account",
        title: "Gå til Konto",
        description: "Velg 'Konto' → 'Slett konto'.",
        completed: false,
      },
      {
        id: "tiktok-confirm",
        title: "Bekreft slettingen",
        description: "Følg instruksjonene for å bekrefte slettingen. Kontoen deaktiveres i 30 dager før permanent sletting.",
        completed: false,
      },
    ],
    linkedin: [
      ...baseSteps.slice(0, 2),
      {
        id: "linkedin-settings",
        title: "Gå til innstillinger",
        description: "Klikk på profilbildet ditt, deretter 'Innstillinger og personvern'.",
        completed: false,
      },
      {
        id: "linkedin-account",
        title: "Velg Kontoadministrasjon",
        description: "Klikk på 'Kontoadministrasjon' i menyen.",
        completed: false,
      },
      {
        id: "linkedin-close",
        title: "Velg Lukk konto",
        description: "Klikk på 'Lukk konto' og velg en grunn for lukkingen.",
        completed: false,
      },
      {
        id: "linkedin-confirm",
        title: "Bekreft med passord",
        description: "Skriv inn passordet ditt og bekreft slettingen.",
        completed: false,
      },
    ],
    spotify: [
      ...baseSteps.slice(0, 1),
      {
        id: "spotify-support",
        title: "Gå til Spotify Support",
        description: "Besøk support.spotify.com/contact-spotify-support/",
        completed: false,
      },
      {
        id: "spotify-account",
        title: "Velg Kontohjelp",
        description: "Velg 'Konto' → 'Jeg vil lukke Spotify-kontoen min permanent'.",
        completed: false,
      },
      {
        id: "spotify-login",
        title: "Logg inn og bekreft",
        description: "Logg inn på kontoen din og følg instruksjonene for å slette.",
        completed: false,
      },
      {
        id: "spotify-cancel",
        title: "Avbryt eventuelle abonnementer",
        description: "Hvis du har Premium, må du avbryte abonnementet først.",
        completed: false,
      },
    ],
    netflix: [
      ...baseSteps.slice(0, 2),
      {
        id: "netflix-account",
        title: "Gå til Konto",
        description: "Klikk på profilikonet øverst til høyre og velg 'Konto'.",
        completed: false,
      },
      {
        id: "netflix-cancel",
        title: "Avbryt medlemskap",
        description: "Klikk på 'Avbryt medlemskap' under 'Medlemskap og fakturering'.",
        completed: false,
      },
      {
        id: "netflix-delete",
        title: "Slett kontoen",
        description: "Etter at medlemskapet er avbrutt, kan du kontakte Netflix kundeservice for å slette kontoen helt.",
        completed: false,
      },
    ],
  };

  return platformSpecificSteps[platformId] || baseSteps;
}

// Generate unique ID
function generateId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const useDeletionStore = create<DeletionStore>()(
  persist(
    (set, get) => ({
      requests: [],
      userPlatforms: {},

      createRequest: (platformId, platformName, type) => {
        const newRequest: DeletionRequest = {
          id: generateId(),
          platformId,
          platformName,
          type,
          status: "pending",
          steps: generateDeletionSteps(platformId, platformName),
          currentStep: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          requests: [...state.requests, newRequest],
          userPlatforms: {
            ...state.userPlatforms,
            [platformId]: {
              platformId,
              status: "in_progress",
              startedAt: new Date().toISOString(),
            },
          },
        }));

        return newRequest;
      },

      updateRequest: (requestId, updates) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === requestId
              ? { ...req, ...updates, updatedAt: new Date().toISOString() }
              : req
          ),
        }));
      },

      deleteRequest: (requestId) => {
        const request = get().requests.find((r) => r.id === requestId);
        set((state) => ({
          requests: state.requests.filter((req) => req.id !== requestId),
          userPlatforms: request
            ? {
                ...state.userPlatforms,
                [request.platformId]: {
                  ...state.userPlatforms[request.platformId],
                  status: "not_started",
                },
              }
            : state.userPlatforms,
        }));
      },

      getRequestsByStatus: (status) => {
        return get().requests.filter((req) => req.status === status);
      },

      getRequestByPlatform: (platformId) => {
        return get().requests.find((req) => req.platformId === platformId);
      },

      completeStep: (requestId, stepId) => {
        set((state) => {
          const request = state.requests.find((r) => r.id === requestId);
          if (!request) return state;

          const updatedSteps = request.steps.map((step) =>
            step.id === stepId
              ? { ...step, completed: true, completedAt: new Date().toISOString() }
              : step
          );

          const completedCount = updatedSteps.filter((s) => s.completed).length;
          const allCompleted = completedCount === updatedSteps.length;

          const updatedRequests = state.requests.map((req) => {
            if (req.id !== requestId) return req;
            return {
              ...req,
              steps: updatedSteps,
              currentStep: completedCount,
              status: allCompleted ? ("completed" as RequestStatus) : ("in_progress" as RequestStatus),
              completedAt: allCompleted ? new Date().toISOString() : req.completedAt,
              updatedAt: new Date().toISOString(),
            };
          });

          // Update platform status if all steps are completed
          const updatedUserPlatforms = allCompleted
            ? {
                ...state.userPlatforms,
                [request.platformId]: {
                  ...state.userPlatforms[request.platformId],
                  status: "completed" as PlatformStatus,
                  completedAt: new Date().toISOString(),
                },
              }
            : state.userPlatforms;

          return {
            requests: updatedRequests,
            userPlatforms: updatedUserPlatforms,
          };
        });
      },

      uncompleteStep: (requestId, stepId) => {
        set((state) => ({
          requests: state.requests.map((req) => {
            if (req.id !== requestId) return req;

            const updatedSteps = req.steps.map((step) =>
              step.id === stepId
                ? { ...step, completed: false, completedAt: undefined }
                : step
            );

            const completedCount = updatedSteps.filter((s) => s.completed).length;

            return {
              ...req,
              steps: updatedSteps,
              currentStep: completedCount,
              status: completedCount === 0 ? "pending" : "in_progress",
              completedAt: undefined,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updatePlatformStatus: (platformId, status) => {
        set((state) => ({
          userPlatforms: {
            ...state.userPlatforms,
            [platformId]: {
              ...state.userPlatforms[platformId],
              platformId,
              status,
              ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}),
            },
          },
        }));
      },

      getPlatformStatus: (platformId) => {
        const platform = get().userPlatforms[platformId];
        return platform?.status || "not_started";
      },

      startDeletion: (platformId, platformName) => {
        const existingRequest = get().getRequestByPlatform(platformId);
        if (existingRequest) {
          return existingRequest;
        }
        return get().createRequest(platformId, platformName, "account_deletion");
      },

      getStats: () => {
        const requests = get().requests;
        return {
          total: requests.length,
          inProgress: requests.filter((r) => r.status === "in_progress").length,
          completed: requests.filter((r) => r.status === "completed").length,
          actionRequired: requests.filter((r) => r.status === "action_required").length,
          pending: requests.filter((r) => r.status === "pending" || r.status === "submitted").length,
        };
      },
    }),
    {
      name: "slettmeg-deletion-store",
    }
  )
);
