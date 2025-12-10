"use client";

import { useState } from "react";
import { HiOutlineUser, HiOutlineBell, HiOutlineShieldCheck, HiOutlineTrash, HiOutlineSave } from "react-icons/hi";
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

export default function SettingsPage() {
  const [name, setName] = useState("Ola Nordmann");
  const [email, setEmail] = useState("ola@example.com");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Navn</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-postadresse</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
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
              <Button variant="destructive" size="sm" className="mt-4">
                Slett min konto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
