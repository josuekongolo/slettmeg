import Link from "next/link";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineChatAlt,
  HiOutlineBookOpen,
  HiOutlineMail,
  HiExternalLink,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
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
      "Gå til 'Mine plattformer' og velg plattformen du vil slette deg fra. Klikk 'Start' og følg veiledningen. AI-assistenten vil hjelpe deg gjennom hele prosessen.",
  },
  {
    question: "Hvor lang tid tar det å slette en konto?",
    answer:
      "Dette varierer fra plattform til plattform. Noen tjenester sletter umiddelbart, mens andre kan ta opptil 30 dager ifølge GDPR. Du kan se estimert tid for hver plattform i oversikten.",
  },
  {
    question: "Hva er GDPR og hvordan hjelper det meg?",
    answer:
      "GDPR (General Data Protection Regulation) gir deg rett til å få slettet dine personlige data fra bedrifter. Vi hjelper deg med å sende formelle GDPR-forespørsler som bedrifter er juridisk forpliktet til å svare på innen 30 dager.",
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
];

const supportOptions = [
  {
    title: "AI Assistent",
    description: "Få umiddelbar hjelp fra vår AI-drevne assistent",
    icon: RiRobot2Line,
    href: "/dashboard/assistant",
    cta: "Start samtale",
  },
  {
    title: "Dokumentasjon",
    description: "Utforsk våre detaljerte guider og veiledninger",
    icon: HiOutlineBookOpen,
    href: "/docs",
    cta: "Les dokumentasjon",
  },
  {
    title: "E-poststøtte",
    description: "Kontakt oss for personlig hjelp",
    icon: HiOutlineMail,
    href: "mailto:support@slettmeg.no",
    cta: "Send e-post",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hjelp og støtte</h1>
        <p className="text-muted-foreground">
          Finn svar på spørsmål eller kontakt oss for hjelp
        </p>
      </div>

      {/* Support Options */}
      <div className="grid gap-4 md:grid-cols-3">
        {supportOptions.map((option) => (
          <Card key={option.title} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <option.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={option.href}>
                  {option.cta}
                  <HiExternalLink className="ml-2" size={16} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HiOutlineQuestionMarkCircle size={20} />
            Ofte stilte spørsmål
          </CardTitle>
          <CardDescription>
            Finn svar på de vanligste spørsmålene
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HiOutlineChatAlt size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Trenger du mer hjelp?</h3>
              <p className="text-sm text-muted-foreground">
                Vårt supportteam er klare til å hjelpe deg
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="mailto:support@slettmeg.no">Kontakt oss</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
