"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiExternalLink,
  HiOutlineExclamationCircle,
  HiOutlineClipboardCopy,
  HiCheck,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineChatAlt,
} from "react-icons/hi";
import { HiOutlineMinusCircle } from "react-icons/hi";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { platforms } from "@/lib/platforms-data";
import { useDeletionStore, type DeletionRequest } from "@/lib/stores/deletion-store";
import {
  generateGDPRRequest,
  getPlatformGDPRContact,
  generateEmailSubject,
  type GDPRRequestData,
} from "@/lib/gdpr-generator";
import { PlatformIcon } from "@/components/platform-icon";

const difficultyConfig = {
  easy: { label: "Enkelt", color: "text-green-600", bg: "bg-green-100" },
  medium: { label: "Middels", color: "text-amber-600", bg: "bg-amber-100" },
  hard: { label: "Vanskelig", color: "text-red-600", bg: "bg-red-100" },
};

export default function PlatformDetailPage() {
  const params = useParams();
  const router = useRouter();
  const platformId = params.id as string;

  const platform = platforms.find((p) => p.id === platformId);

  const {
    startDeletion,
    getRequestByPlatform,
    completeStep,
    uncompleteStep,
    updateRequest,
    deleteRequest,
  } = useDeletionStore();

  const [request, setRequest] = useState<DeletionRequest | null>(null);
  const [copied, setCopied] = useState(false);
  const [gdprLetter, setGdprLetter] = useState("");
  const [showGdprDialog, setShowGdprDialog] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");

  // Load request from store
  useEffect(() => {
    const existingRequest = getRequestByPlatform(platformId);
    setRequest(existingRequest || null);
  }, [platformId, getRequestByPlatform]);

  if (!platform) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HiOutlineExclamationCircle size={48} className="text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">Plattform ikke funnet</h1>
        <p className="text-muted-foreground mb-4">
          Beklager, vi kunne ikke finne denne plattformen.
        </p>
        <Button asChild>
          <Link href="/dashboard/platforms">Tilbake til plattformer</Link>
        </Button>
      </div>
    );
  }

  const gdprContact = getPlatformGDPRContact(platformId);
  const completedSteps = request?.steps.filter((s) => s.completed).length || 0;
  const totalSteps = request?.steps.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleStartDeletion = () => {
    const newRequest = startDeletion(platformId, platform.name);
    setRequest(newRequest);
  };

  const handleToggleStep = (stepId: string, completed: boolean) => {
    if (!request) return;

    if (completed) {
      uncompleteStep(request.id, stepId);
    } else {
      completeStep(request.id, stepId);
    }

    // Refresh request from store
    const updatedRequest = getRequestByPlatform(platformId);
    setRequest(updatedRequest || null);
  };

  const handleCancelDeletion = () => {
    if (!request) return;
    deleteRequest(request.id);
    setRequest(null);
  };

  const handleGenerateGDPR = () => {
    const data: GDPRRequestData = {
      userName: userName || "Ditt navn",
      userEmail: userEmail || "din@epost.no",
      platformName: platform.name,
      accountIdentifier: accountIdentifier || undefined,
      requestType: "deletion",
    };
    const letter = generateGDPRRequest(data);
    setGdprLetter(letter);
  };

  const handleCopyLetter = async () => {
    await navigator.clipboard.writeText(gdprLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLetter = () => {
    const blob = new Blob([gdprLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GDPR-forespørsel-${platform.name}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMarkAsCompleted = () => {
    if (!request) return;

    // Mark all steps as completed
    request.steps.forEach((step) => {
      if (!step.completed) {
        completeStep(request.id, step.id);
      }
    });

    updateRequest(request.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    const updatedRequest = getRequestByPlatform(platformId);
    setRequest(updatedRequest || null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <HiArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
              <PlatformIcon platformId={platform.id} size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{platform.name}</h1>
              <p className="text-sm text-muted-foreground">{platform.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${difficultyConfig[platform.difficulty].bg} ${difficultyConfig[platform.difficulty].color}`}>
            {difficultyConfig[platform.difficulty].label}
          </Badge>
          <Badge variant="outline">
            <HiOutlineClock className="mr-1" size={12} />
            {platform.estimatedTime}
          </Badge>
        </div>
      </div>

      {/* Status Card */}
      {request && (
        <Card className={request.status === "completed" ? "border-green-500 bg-green-50/50" : "border-primary"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {request.status === "completed" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <HiOutlineCheckCircle size={20} className="text-green-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <HiOutlineClock size={20} className="text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {request.status === "completed"
                      ? "Sletting fullført!"
                      : `${completedSteps} av ${totalSteps} steg fullført`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.status === "completed"
                      ? `Fullført ${new Date(request.completedAt!).toLocaleDateString("nb-NO")}`
                      : "Hold orden på fremgangen din"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request.status !== "completed" && (
                  <Button size="sm" variant="outline" onClick={handleMarkAsCompleted}>
                    <HiOutlineCheckCircle className="mr-2" size={16} />
                    Marker som fullført
                  </Button>
                )}
              </div>
            </div>
            {request.status !== "completed" && (
              <Progress value={progress} className="mt-4 h-2" />
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="steps">Steg-for-steg</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR-forespørsel</TabsTrigger>
              <TabsTrigger value="info">Informasjon</TabsTrigger>
            </TabsList>

            {/* Steps Tab */}
            <TabsContent value="steps" className="mt-4">
              {!request ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <HiOutlineDocumentText size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Start slettingsprosessen
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Klikk på knappen nedenfor for å starte slettingsprosessen for {platform.name}.
                      Vi guider deg gjennom hvert steg.
                    </p>
                    <Button size="lg" onClick={handleStartDeletion}>
                      Start sletting av {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {request.steps.map((step, index) => (
                    <Card
                      key={step.id}
                      className={`transition-all ${
                        step.completed ? "border-green-200 bg-green-50/50" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleToggleStep(step.id, step.completed)}
                            className="mt-1 flex-shrink-0"
                          >
                            {step.completed ? (
                              <HiOutlineCheckCircle size={24} className="text-green-600" />
                            ) : (
                              <HiOutlineMinusCircle size={24} className="text-muted-foreground hover:text-primary transition-colors" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                STEG {index + 1}
                              </span>
                              {step.completed && step.completedAt && (
                                <span className="text-xs text-green-600">
                                  Fullført {new Date(step.completedAt).toLocaleDateString("nb-NO")}
                                </span>
                              )}
                            </div>
                            <h4 className={`font-medium mt-1 ${step.completed ? "text-green-900" : ""}`}>
                              {step.title}
                            </h4>
                            <p className={`text-sm mt-1 ${step.completed ? "text-green-700" : "text-muted-foreground"}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancelDeletion}
                    >
                      <HiOutlineRefresh className="mr-2" size={16} />
                      Avbryt prosessen
                    </Button>
                    {request.status !== "completed" && (
                      <Button className="flex-1" onClick={handleMarkAsCompleted}>
                        <HiOutlineCheckCircle className="mr-2" size={16} />
                        Marker som fullført
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* GDPR Tab */}
            <TabsContent value="gdpr" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HiOutlineMail size={20} />
                    GDPR Slettingsforespørsel
                  </CardTitle>
                  <CardDescription>
                    Generer en formell GDPR-forespørsel som du kan sende til {platform.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Ditt navn</Label>
                      <Input
                        id="userName"
                        placeholder="Ola Nordmann"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Din e-post</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="ola@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountId">
                      Konto/brukernavn på {platform.name} (valgfritt)
                    </Label>
                    <Input
                      id="accountId"
                      placeholder="Ditt brukernavn eller e-post på plattformen"
                      value={accountIdentifier}
                      onChange={(e) => setAccountIdentifier(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleGenerateGDPR} className="w-full">
                    <HiOutlineDocumentText className="mr-2" size={16} />
                    Generer GDPR-forespørsel
                  </Button>

                  {gdprLetter && (
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <Label>Generert forespørsel</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyLetter}
                          >
                            {copied ? (
                              <>
                                <HiCheck className="mr-1" size={12} />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <HiOutlineClipboardCopy className="mr-1" size={12} />
                                Kopier
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadLetter}
                          >
                            <HiOutlineDownload className="mr-1" size={12} />
                            Last ned
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={gdprLetter}
                        readOnly
                        className="min-h-[400px] font-mono text-sm"
                      />

                      {gdprContact && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                          <h4 className="font-medium mb-2">Hvor sende forespørselen</h4>
                          <div className="space-y-2 text-sm">
                            {gdprContact.email && (
                              <p>
                                <span className="text-muted-foreground">E-post:</span>{" "}
                                <a
                                  href={`mailto:${gdprContact.email}?subject=${encodeURIComponent(
                                    generateEmailSubject(platform.name, "deletion")
                                  )}`}
                                  className="text-primary hover:underline"
                                >
                                  {gdprContact.email}
                                </a>
                              </p>
                            )}
                            {gdprContact.url && (
                              <p>
                                <span className="text-muted-foreground">Online skjema:</span>{" "}
                                <a
                                  href={gdprContact.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Åpne kontaktskjema
                                  <HiExternalLink className="inline ml-1" size={12} />
                                </a>
                              </p>
                            )}
                            {gdprContact.notes && (
                              <p className="text-muted-foreground">{gdprContact.notes}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Om {platform.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{platform.description}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-muted-foreground">Vanskelighetsgrad</p>
                      <p className={`text-lg font-semibold ${difficultyConfig[platform.difficulty].color}`}>
                        {difficultyConfig[platform.difficulty].label}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-muted-foreground">Estimert tid</p>
                      <p className="text-lg font-semibold">{platform.estimatedTime}</p>
                    </div>
                  </div>

                  {platform.guideUrl && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <h4 className="font-medium mb-2">Ekstern veiledning</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Se detaljert veiledning fra slettmeg.no
                      </p>
                      <Button variant="outline" asChild>
                        <a
                          href={platform.guideUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Les veiledning
                          <HiExternalLink className="ml-2" size={16} />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hurtighandlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {platform.guideUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={platform.guideUrl} target="_blank" rel="noopener noreferrer">
                    <HiExternalLink className="mr-2" size={16} />
                    Se veiledning
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowGdprDialog(true)}
              >
                <HiOutlineDocumentText className="mr-2" size={16} />
                Generer GDPR-brev
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/assistant">
                  <HiOutlineChatAlt className="mr-2" size={16} />
                  Spør AI-assistent
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ta backup av data du vil beholde før sletting</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sjekk at du er logget inn på riktig konto</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Noen plattformer har en angrefrist - noter datoen</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>GDPR gir deg rett til svar innen 30 dager</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* GDPR Contact */}
          {gdprContact && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">GDPR-kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {gdprContact.email && (
                  <a
                    href={`mailto:${gdprContact.email}`}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <HiOutlineMail size={16} />
                    {gdprContact.email}
                  </a>
                )}
                {gdprContact.url && (
                  <a
                    href={gdprContact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <HiExternalLink size={16} />
                    Kontaktskjema
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
