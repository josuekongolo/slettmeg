"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  HiOutlineChatAlt,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateGDPRRequest,
  getPlatformGDPRContact,
  generateEmailSubject,
  type GDPRRequestData,
} from "@/lib/gdpr-generator";
import { PlatformIcon } from "@/components/platform-icon";
import type { Platform, DeletionRequest } from "@prisma/client";

interface PlatformDetailClientProps {
  platform: Platform;
  deletionRequest: DeletionRequest | null;
  userId: string;
}

const difficultyConfig = {
  EASY: { label: "Enkelt", color: "text-green-600", bg: "bg-green-100" },
  MEDIUM: { label: "Middels", color: "text-amber-600", bg: "bg-amber-100" },
  HARD: { label: "Vanskelig", color: "text-red-600", bg: "bg-red-100" },
};

export function PlatformDetailClient({
  platform,
  deletionRequest: initialRequest,
  userId,
}: PlatformDetailClientProps) {
  const router = useRouter();
  const [deletionRequest, setDeletionRequest] = useState(initialRequest);
  const [copied, setCopied] = useState(false);
  const [gdprLetter, setGdprLetter] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const gdprContact = getPlatformGDPRContact(platform.slug);

  const handleStartDeletion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: platform.id,
          type: "ACCOUNT_DELETION",
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setDeletionRequest(newRequest);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating deletion request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!deletionRequest) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/requests/${deletionRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setDeletionRequest(updated);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!deletionRequest) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/requests/${deletionRequest.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeletionRequest(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    } finally {
      setIsLoading(false);
    }
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

  const statusLabel = deletionRequest?.status === "COMPLETED" ? "Fullført" : "Under arbeid";

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
              <PlatformIcon platformId={platform.slug} size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{platform.name}</h1>
              <p className="text-sm text-muted-foreground">{platform.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${difficultyConfig[platform.difficulty as keyof typeof difficultyConfig].bg} ${difficultyConfig[platform.difficulty as keyof typeof difficultyConfig].color}`}>
            {difficultyConfig[platform.difficulty as keyof typeof difficultyConfig].label}
          </Badge>
          <Badge variant="outline">
            <HiOutlineClock className="mr-1" size={12} />
            {platform.estimatedTime}
          </Badge>
        </div>
      </div>

      {/* Status Card */}
      {deletionRequest && (
        <Card className={deletionRequest.status === "COMPLETED" ? "border-green-500 bg-green-50/50" : "border-primary"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {deletionRequest.status === "COMPLETED" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <HiOutlineCheckCircle size={20} className="text-green-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <HiOutlineClock size={20} className="text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{statusLabel}</p>
                  <p className="text-sm text-muted-foreground">
                    Opprettet {new Date(deletionRequest.createdAt).toLocaleDateString("nb-NO")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {deletionRequest.status !== "COMPLETED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAsCompleted}
                    disabled={isLoading}
                  >
                    <HiOutlineCheckCircle className="mr-2" size={16} />
                    Marker som fullført
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="info">Informasjon</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR-forespørsel</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-4">
              {!deletionRequest ? (
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
                    </p>
                    <Button
                      size="lg"
                      onClick={handleStartDeletion}
                      disabled={isLoading}
                    >
                      {isLoading ? "Starter..." : `Start sletting av ${platform.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Om {platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{platform.description}</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium text-muted-foreground">Vanskelighetsgrad</p>
                        <p className={`text-lg font-semibold ${difficultyConfig[platform.difficulty as keyof typeof difficultyConfig].color}`}>
                          {difficultyConfig[platform.difficulty as keyof typeof difficultyConfig].label}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium text-muted-foreground">Estimert tid</p>
                        <p className="text-lg font-semibold">{platform.estimatedTime}</p>
                      </div>
                    </div>

                    {deletionRequest.status !== "COMPLETED" && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={handleCancelDeletion}
                          disabled={isLoading}
                        >
                          Avbryt prosessen
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleMarkAsCompleted}
                          disabled={isLoading}
                        >
                          <HiOutlineCheckCircle className="mr-2" size={16} />
                          Marker som fullført
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
