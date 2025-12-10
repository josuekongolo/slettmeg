"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineShieldCheck, HiOutlineMail, HiOutlineUser, HiArrowRight, HiCheck } from "react-icons/hi";
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

const benefits = [
  "AI-drevet veiledning for kontosletting",
  "Støtte for over 100 plattformer",
  "Automatiske GDPR-forespørsler",
  "Sporbar fremgang",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2">
        {/* Benefits Section */}
        <div className="hidden flex-col justify-center space-y-6 lg:flex">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ta kontroll over ditt digitale personvern
            </h1>
            <p className="mt-2 text-muted-foreground">
              Registrer deg gratis og start med å slette ditt digitale fotavtrykk
              i dag.
            </p>
          </div>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <HiCheck size={16} className="text-primary" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader className="space-y-4 text-center">
            <Link href="/" className="mx-auto flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <HiOutlineShieldCheck size={24} className="text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">SlettMeg</span>
            </Link>
            <div>
              <CardTitle className="text-2xl">Opprett konto</CardTitle>
              <CardDescription>
                Kom i gang på under ett minutt
              </CardDescription>
            </div>
          </CardHeader>

          {!isEmailSent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Navn</Label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ditt navn"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-postadresse</Label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="din@epost.no"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ved å registrere deg godtar du våre{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    vilkår
                  </Link>{" "}
                  og{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    personvernregler
                  </Link>
                  .
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <CgSpinner className="mr-2 animate-spin" size={16} />
                      Oppretter konto...
                    </>
                  ) : (
                    <>
                      Opprett konto
                      <HiArrowRight className="ml-2" size={16} />
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Har du allerede en konto?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Logg inn
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <HiOutlineMail size={32} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Bekreft e-posten din</h3>
                <p className="text-sm text-muted-foreground">
                  Vi har sendt en bekreftelseslenke til{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Klikk på lenken i e-posten for å fullføre registreringen.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEmailSent(false)}
              >
                Bruk en annen e-postadresse
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
