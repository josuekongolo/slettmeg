"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineShieldCheck, HiOutlineMail, HiArrowRight } from "react-icons/hi";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending magic link
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <HiOutlineShieldCheck size={24} className="text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SlettMeg</span>
          </Link>
          <div>
            <CardTitle className="text-2xl">Velkommen tilbake</CardTitle>
            <CardDescription>
              Logg inn for å fortsette med å slette ditt digitale fotavtrykk
            </CardDescription>
          </div>
        </CardHeader>

        {!isEmailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <CgSpinner className="mr-2 animate-spin" size={16} />
                    Sender...
                  </>
                ) : (
                  <>
                    Logg inn med e-post
                    <HiArrowRight className="ml-2" size={16} />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Har du ikke en konto?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-primary hover:underline"
                >
                  Registrer deg
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
              <h3 className="text-lg font-semibold">Sjekk e-posten din</h3>
              <p className="text-sm text-muted-foreground">
                Vi har sendt en innloggingslenke til{" "}
                <span className="font-medium text-foreground">{email}</span>
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
  );
}
