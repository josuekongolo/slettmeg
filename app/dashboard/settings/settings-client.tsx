"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineSave,
} from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { User } from "@prisma/client";

interface SettingsClientProps {
  profile: User;
  updateProfile: (formData: FormData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export function SettingsClient({
  profile,
  updateProfile,
  deleteAccount,
}: SettingsClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await updateProfile(formData);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Innstillinger</h1>
        <p className="text-muted-foreground">
          Administrer din konto og preferanser
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiOutlineUser size={20} />
              Profil
            </CardTitle>
            <CardDescription>
              Oppdater din profilinformasjon
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Navn</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={profile.name || ""}
                  placeholder="Ditt navn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-postadresse</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  E-postadressen kan ikke endres
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <CgSpinner className="mr-2 animate-spin" size={16} />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <HiOutlineSave className="mr-2" size={16} />
                    Lagre endringer
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiOutlineBell size={20} />
              Varsler
            </CardTitle>
            <CardDescription>
              Velg hvilke varsler du vil motta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="email-updates" defaultChecked />
              <Label htmlFor="email-updates">
                E-postvarsler om slettingsforespørsler
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email-completed" defaultChecked />
              <Label htmlFor="email-completed">
                Varsle når en sletting er fullført
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email-action" defaultChecked />
              <Label htmlFor="email-action">
                Varsle når handling er påkrevd
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email-newsletter" />
              <Label htmlFor="email-newsletter">
                Motta nyhetsbrev om personvern
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiOutlineShieldCheck size={20} />
              Personvern
            </CardTitle>
            <CardDescription>
              Administrer dine personverninnstillinger
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="analytics" defaultChecked />
              <Label htmlFor="analytics">
                Tillat anonym bruksstatistikk
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="chat-history" defaultChecked />
              <Label htmlFor="chat-history">
                Lagre samtalehistorikk med AI-assistent
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <HiOutlineTrash size={20} />
              Faresone
            </CardTitle>
            <CardDescription>
              Irreversible handlinger for din konto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/50 p-4">
              <h4 className="font-medium">Slett konto</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Sletting av kontoen din vil fjerne all data permanent. Denne
                handlingen kan ikke angres.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <CgSpinner className="mr-2 animate-spin" size={16} />
                        Sletter...
                      </>
                    ) : (
                      "Slett min konto"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Er du helt sikker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Dette vil permanent slette din konto og alle tilknyttede data.
                      Denne handlingen kan ikke angres.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ja, slett kontoen min
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
