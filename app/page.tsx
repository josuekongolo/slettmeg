import Link from "next/link";
import {
  HiOutlineShieldCheck,
  HiOutlineGlobe,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiArrowRight,
  HiOutlineLockClosed,
  HiOutlineLightningBolt,
  HiStar,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: RiRobot2Line,
    title: "AI-drevet veiledning",
    description:
      "Intelligent assistent som guider deg steg for steg gjennom slettingsprosessen for hver plattform.",
  },
  {
    icon: HiOutlineGlobe,
    title: "100+ plattformer",
    description:
      "Omfattende dekning av sosiale medier, streamingtjenester, datingapper og flere.",
  },
  {
    icon: HiOutlineDocumentText,
    title: "GDPR-forespørsler",
    description:
      "Automatisk genererte, juridisk korrekte slettingsforespørsler tilpasset norsk lov.",
  },
  {
    icon: HiOutlineLockClosed,
    title: "Personvern først",
    description:
      "Vi lagrer aldri passord eller sensitive data. Alt behandles sikkert og lokalt.",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Sanntidsoppdateringer",
    description:
      "Følg fremgangen live og motta varsler når forespørsler behandles.",
  },
  {
    icon: HiOutlineCheckCircle,
    title: "Full oversikt",
    description:
      "Dashboard med komplett status over alle dine slettingsforespørsler.",
  },
];

const platforms = [
  "Facebook",
  "Instagram",
  "TikTok",
  "Google",
  "LinkedIn",
  "Snapchat",
  "Spotify",
  "Twitter",
];

const stats = [
  { value: "50K+", label: "Kontoer slettet" },
  { value: "100+", label: "Plattformer" },
  { value: "99%", label: "Suksessrate" },
  { value: "4.9", label: "Brukerrating", icon: HiStar },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <HiOutlineShieldCheck size={16} />
                <span>Beskytt ditt digitale personvern</span>
              </div>

              <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Ta kontroll over din
                <span className="mt-2 block text-primary">digitale identitet</span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                SlettMeg bruker kunstig intelligens til å hjelpe deg med å fjerne personlig informasjon fra digitale plattformer. Enkelt, sikkert og effektivt.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/auth/register">
                    Kom i gang gratis
                    <HiArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href="/platforms">Se alle plattformer</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500" />
                  <span>Ingen kredittkort påkrevd</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500" />
                  <span>GDPR-kompatibel</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle size={16} className="text-green-500" />
                  <span>Norsk selskap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle gradient orb */}
          <div className="pointer-events-none absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-semibold text-foreground md:text-4xl">
                      {stat.value}
                    </span>
                    {stat.icon && <stat.icon className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Støtter sletting fra ledende plattformer
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="text-xl font-medium text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/30 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Alt du trenger for digital personvern
              </h2>
              <p className="text-lg text-muted-foreground">
                Kraftige verktøy designet for å gi deg full kontroll over dine personlige data på nettet.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Slik fungerer det
              </h2>
              <p className="text-lg text-muted-foreground">
                Tre enkle steg til en renere digital tilværelse
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-3 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Velg plattformer",
                  description:
                    "Bla gjennom vår liste og velg tjenestene du vil fjerne deg fra.",
                },
                {
                  step: "02",
                  title: "AI genererer forespørsler",
                  description:
                    "Vår AI oppretter skreddersydde slettingsforespørsler for hver tjeneste.",
                },
                {
                  step: "03",
                  title: "Spor fremgangen",
                  description:
                    "Følg med på status og motta varsler når forespørsler fullføres.",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center">
                  {index < 2 && (
                    <div className="absolute left-full top-8 hidden h-px w-full -translate-x-4 bg-border md:block" />
                  )}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-lg font-medium">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} size={24} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="mb-6 text-xl font-medium text-foreground md:text-2xl">
                &ldquo;SlettMeg gjorde det utrolig enkelt å ta kontroll over mine personlige data. På bare noen timer hadde jeg sendt slettingsforespørsler til over 20 tjenester.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                  MH
                </div>
                <div className="text-left">
                  <div className="font-medium">Maria Hansen</div>
                  <div className="text-sm text-muted-foreground">Verifisert bruker</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-16">
              <HiOutlineShieldCheck className="mx-auto mb-6 opacity-90" size={48} />
              <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">
                Klar til å ta tilbake kontrollen?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
                Bli med tusenvis av nordmenn som har tatt kontroll over sin digitale identitet. Kom i gang på under ett minutt.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
                  <Link href="/auth/register">
                    Start gratis nå
                    <HiArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-primary-foreground/20 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/pricing">Se priser</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
