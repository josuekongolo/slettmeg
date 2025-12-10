import Link from "next/link";
import { HiOutlineQuestionMarkCircle, HiOutlineBookOpen, HiOutlineMail, HiOutlineShieldCheck, HiOutlineClock, HiOutlineDocumentText } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Hvordan starter jeg en slettingsforespørsel?",
    answer:
      "Logg inn på din konto, gå til 'Mine plattformer' og velg plattformen du vil slette deg fra. Klikk 'Start' og følg veiledningen. Vår AI-assistent vil hjelpe deg gjennom hele prosessen med trinnvise instruksjoner.",
  },
  {
    question: "Hvor lang tid tar det å slette en konto?",
    answer:
      "Dette varierer fra plattform til plattform. Noen tjenester sletter umiddelbart, mens andre kan ta opptil 30 dager i henhold til GDPR. Du kan se estimert tid for hver plattform i oversikten vår.",
  },
  {
    question: "Hva er GDPR og hvordan hjelper det meg?",
    answer:
      "GDPR (General Data Protection Regulation) er EUs personvernforordning som gir deg rett til å få slettet dine personlige data fra bedrifter. Vi hjelper deg med å sende formelle GDPR-forespørsler som bedrifter er juridisk forpliktet til å svare på innen 30 dager.",
  },
  {
    question: "Er mine data trygge hos SlettMeg?",
    answer:
      "Ja, vi tar personvern svært alvorlig. Vi lagrer aldri dine passord eller sensitive innloggingsdata. All kommunikasjon er kryptert, og vi følger GDPR og norske personvernregler.",
  },
  {
    question: "Kan jeg angre en slettingsforespørsel?",
    answer:
      "Mange plattformer har en angrefrist (typisk 30 dager) hvor du kan reaktivere kontoen. Etter denne perioden er slettingen permanent. Vi informerer deg om angrefrister for hver plattform.",
  },
  {
    question: "Hva skjer hvis en plattform ikke svarer?",
    answer:
      "Hvis en plattform ikke svarer innen 30 dager, kan du eskalere saken til Datatilsynet. Vi hjelper deg med å dokumentere forsøkene og kan generere en klage til myndighetene.",
  },
  {
    question: "Hvilke plattformer støtter dere?",
    answer:
      "Vi støtter over 100 populære plattformer inkludert sosiale medier, e-handel, strømmetjenester og mer. Se vår fullstendige liste på plattformsiden.",
  },
  {
    question: "Koster det noe å bruke SlettMeg?",
    answer:
      "Vi tilbyr en gratis plan med begrenset funksjonalitet, samt betalte planer med flere funksjoner som ubegrensede plattformer, avansert AI-assistent og automatiske forespørsler.",
  },
];

const helpTopics = [
  {
    title: "Kom i gang",
    description: "Lær det grunnleggende om å bruke SlettMeg",
    icon: HiOutlineBookOpen,
    href: "/auth/register",
  },
  {
    title: "GDPR-rettigheter",
    description: "Forstå dine rettigheter under GDPR",
    icon: HiOutlineShieldCheck,
    href: "/privacy",
  },
  {
    title: "Slettingsprosessen",
    description: "Hvordan slettingsforespørsler fungerer",
    icon: HiOutlineClock,
    href: "/platforms",
  },
  {
    title: "AI-assistent",
    description: "Få hjelp fra vår AI-drevne assistent",
    icon: RiRobot2Line,
    href: "/auth/login",
  },
];

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HiOutlineQuestionMarkCircle size={32} className="text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Hvordan kan vi hjelpe deg?
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Finn svar på vanlige spørsmål eller kontakt oss for personlig hjelp.
            </p>
          </div>
        </section>

        {/* Help Topics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-semibold">Populære emner</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {helpTopics.map((topic) => (
                <Card key={topic.title} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <topic.icon size={24} className="text-primary" />
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={topic.href}>Les mer</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-semibold">Ofte stilte spørsmål</h2>
              <p className="text-muted-foreground">
                Finn svar på de vanligste spørsmålene om SlettMeg
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HiOutlineMail size={32} className="text-primary" />
            </div>
            <h2 className="mb-4 text-2xl font-bold">Fant du ikke svaret?</h2>
            <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
              Vårt supportteam er klare til å hjelpe deg. Send oss en melding så
              svarer vi så raskt som mulig.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/contact">Kontakt oss</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@slettmeg.no">
                  <HiOutlineMail className="mr-2" size={16} />
                  support@slettmeg.no
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
