"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlineClock, HiCheck } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactInfo = [
  {
    icon: HiOutlineMail,
    title: "E-post",
    description: "support@slettmeg.no",
    subtext: "Vi svarer innen 24 timer",
  },
  {
    icon: HiOutlineLocationMarker,
    title: "Adresse",
    description: "Oslo, Norge",
    subtext: "SlettMeg AS",
  },
  {
    icon: HiOutlineClock,
    title: "Åpningstider",
    description: "Man-Fre: 09:00-17:00",
    subtext: "Norsk tid (CET)",
  },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Kontakt oss
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Har du spørsmål eller trenger hjelp? Vi er her for deg.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Kontaktinformasjon</h2>
                <p className="text-muted-foreground">
                  Du kan nå oss på følgende måter:
                </p>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <Card key={info.title}>
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <info.icon size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{info.title}</h3>
                          <p className="text-sm text-foreground">
                            {info.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {info.subtext}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send oss en melding</CardTitle>
                    <CardDescription>
                      Fyll ut skjemaet under så svarer vi så raskt som mulig.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Navn</Label>
                            <Input
                              id="name"
                              placeholder="Ditt navn"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-post</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="din@epost.no"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Emne</Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) =>
                              setFormData({ ...formData, subject: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Velg emne" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">
                                Generell henvendelse
                              </SelectItem>
                              <SelectItem value="support">
                                Teknisk støtte
                              </SelectItem>
                              <SelectItem value="billing">
                                Fakturering
                              </SelectItem>
                              <SelectItem value="gdpr">
                                GDPR-spørsmål
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnerskap
                              </SelectItem>
                              <SelectItem value="other">
                                Annet
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Melding</Label>
                          <Textarea
                            id="message"
                            placeholder="Skriv din melding her..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <CgSpinner className="mr-2 animate-spin" size={16} />
                              Sender...
                            </>
                          ) : (
                            "Send melding"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <HiCheck size={32} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                          Takk for din henvendelse!
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                          Vi har mottatt meldingen din og vil svare så raskt som
                          mulig, vanligvis innen 24 timer.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              name: "",
                              email: "",
                              subject: "",
                              message: "",
                            });
                          }}
                        >
                          Send ny melding
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold">Rask respons</h3>
                <p className="text-sm text-muted-foreground">
                  Vi svarer på alle henvendelser innen 24 timer på hverdager.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Norsk support</h3>
                <p className="text-sm text-muted-foreground">
                  Vårt supportteam snakker norsk og forstår lokale behov.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Personlig hjelp</h3>
                <p className="text-sm text-muted-foreground">
                  Vi gir deg individuell veiledning tilpasset dine behov.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-xl font-semibold">
              Har du sett på våre vanlige spørsmål?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Kanskje svaret allerede finnes i vår FAQ-seksjon.
            </p>
            <Button variant="outline" asChild>
              <Link href="/help">Se vanlige spørsmål</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
