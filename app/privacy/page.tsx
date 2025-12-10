import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">
            Personvernerklæring
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground">
              Sist oppdatert: {new Date().toLocaleDateString("nb-NO")}
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">1. Introduksjon</h2>
              <p className="mt-4 text-muted-foreground">
                SlettMeg AS (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;) respekterer ditt personvern og er
                forpliktet til å beskytte dine personopplysninger. Denne personvernerklæringen
                informerer deg om hvordan vi behandler dine personopplysninger når du bruker
                vår tjeneste, og forteller deg om dine personvernrettigheter.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">2. Hvilke data vi samler inn</h2>
              <p className="mt-4 text-muted-foreground">
                Vi samler inn følgende typer personopplysninger:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Kontoinformasjon:</strong> Navn, e-postadresse når du registrerer deg
                </li>
                <li>
                  <strong>Bruksdata:</strong> Informasjon om hvordan du bruker tjenesten vår
                </li>
                <li>
                  <strong>Kommunikasjon:</strong> Meldinger du sender til oss via support
                </li>
                <li>
                  <strong>Teknisk data:</strong> IP-adresse, nettlesertype, enhetsinformasjon
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">3. Hvordan vi bruker dataene</h2>
              <p className="mt-4 text-muted-foreground">
                Vi bruker dine personopplysninger til følgende formål:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Levere og vedlikeholde tjenesten vår</li>
                <li>Sende deg viktige oppdateringer om dine slettingsforespørsler</li>
                <li>Forbedre og optimalisere tjenesten</li>
                <li>Svare på dine henvendelser og gi support</li>
                <li>Overholde juridiske forpliktelser</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">4. Dine rettigheter</h2>
              <p className="mt-4 text-muted-foreground">
                I henhold til GDPR og norsk personvernlovgivning har du følgende rettigheter:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Rett til innsyn:</strong> Du kan be om en kopi av dataene vi har om deg
                </li>
                <li>
                  <strong>Rett til retting:</strong> Du kan be om at vi korrigerer unøyaktige data
                </li>
                <li>
                  <strong>Rett til sletting:</strong> Du kan be om at vi sletter dine data
                </li>
                <li>
                  <strong>Rett til dataportabilitet:</strong> Du kan be om å motta dataene i et strukturert format
                </li>
                <li>
                  <strong>Rett til å protestere:</strong> Du kan motsette deg visse typer behandling
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">5. Sikkerhet</h2>
              <p className="mt-4 text-muted-foreground">
                Vi tar sikkerheten til dine personopplysninger på alvor. Vi bruker
                industristandarder for kryptering og sikkerhetstiltak for å beskytte
                dataene dine mot uautorisert tilgang, endring, avsløring eller ødeleggelse.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">6. Lagring av data</h2>
              <p className="mt-4 text-muted-foreground">
                Vi lagrer dine personopplysninger kun så lenge det er nødvendig for
                formålene beskrevet i denne personvernerklæringen, eller så lenge vi
                er pålagt av loven. Når du sletter kontoen din, vil vi slette eller
                anonymisere dine data innen 30 dager.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">7. Informasjonskapsler (Cookies)</h2>
              <p className="mt-4 text-muted-foreground">
                Vi bruker informasjonskapsler for å forbedre din opplevelse på nettsiden.
                Du kan administrere dine preferanser for informasjonskapsler i nettleserinnstillingene.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">8. Kontakt oss</h2>
              <p className="mt-4 text-muted-foreground">
                Hvis du har spørsmål om denne personvernerklæringen eller ønsker å
                utøve dine rettigheter, kan du kontakte oss på:
              </p>
              <div className="mt-4 rounded-lg bg-muted p-4">
                <p className="text-muted-foreground">
                  <strong>SlettMeg AS</strong><br />
                  E-post: personvern@slettmeg.no<br />
                  Adresse: Oslo, Norge
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">9. Endringer</h2>
              <p className="mt-4 text-muted-foreground">
                Vi kan oppdatere denne personvernerklæringen fra tid til annen.
                Vi vil varsle deg om eventuelle vesentlige endringer ved å legge
                ut den nye personvernerklæringen på denne siden og oppdatere datoen
                &quot;Sist oppdatert&quot; øverst.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t pt-8">
            <Link
              href="/"
              className="text-primary hover:underline"
            >
              &larr; Tilbake til forsiden
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
