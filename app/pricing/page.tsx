import Link from "next/link";
import { HiCheck } from "react-icons/hi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Gratis",
    price: "0",
    description: "Perfekt for å prøve tjenesten",
    features: [
      "5 plattformer",
      "Grunnleggende AI-veiledning",
      "Manuell oppfølging",
      "E-poststøtte",
    ],
    cta: "Kom i gang",
    popular: false,
  },
  {
    name: "Pro",
    price: "79",
    description: "For de som vil ta kontroll",
    features: [
      "Ubegrenset plattformer",
      "Avansert AI-assistent",
      "Automatiske forespørsler",
      "GDPR-maler",
      "Prioritert støtte",
      "Fremgangssporing",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "199",
    description: "For bedrifter og team",
    features: [
      "Alt i Pro",
      "Flere brukere",
      "Admin-dashboard",
      "API-tilgang",
      "Dedikert støtte",
      "Tilpassede integrasjoner",
    ],
    cta: "Kontakt oss",
    popular: false,
  },
];

const faqs = [
  {
    question: "Hvordan fungerer AI-assistenten?",
    answer:
      "Vår AI-assistent analyserer hver plattforms slettingsprosess og guider deg gjennom stegene. Den genererer også tilpassede slettingsforespørsler basert på GDPR og plattformens spesifikke krav.",
  },
  {
    question: "Er mine data trygge?",
    answer:
      "Absolutt. Vi lagrer aldri dine passord eller sensitive data. All behandling skjer sikkert, og vi følger GDPR og norske personvernregler.",
  },
  {
    question: "Hvor lang tid tar det å slette en konto?",
    answer:
      "Dette varierer fra plattform til plattform. Noen prosesser tar minutter, mens andre kan ta opptil 30 dager ifølge GDPR. Vi holder deg oppdatert på status hele veien.",
  },
  {
    question: "Kan jeg kansellere når som helst?",
    answer:
      "Ja, du kan kansellere abonnementet ditt når som helst. Det er ingen bindingstid, og du beholder tilgangen ut den betalte perioden.",
  },
  {
    question: "Hvilke plattformer støtter dere?",
    answer:
      "Vi støtter over 100 plattformer inkludert sosiale medier (Facebook, Instagram, TikTok), streaming (Spotify, Netflix), dating-apper, og mange flere. Listen oppdateres kontinuerlig.",
  },
  {
    question: "Hva om en plattform ikke er støttet?",
    answer:
      "Du kan foreslå nye plattformer, og vår AI kan fortsatt hjelpe deg med generell GDPR-veiledning. Vi legger til nye plattformer basert på brukerforespørsler.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Enkle og transparente priser
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Velg planen som passer best for deg. Ingen skjulte kostnader, ingen
              overraskelser.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Mest populær
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground"> kr/mnd</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <HiCheck size={20} className="text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/auth/register">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
                Ofte stilte spørsmål
              </h2>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
