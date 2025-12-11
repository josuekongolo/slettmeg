"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">
            Vilkår for bruk
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground">
              Sist oppdatert: {new Date().toLocaleDateString("nb-NO")}
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">1. Aksept av vilkår</h2>
              <p className="mt-4 text-muted-foreground">
                Ved å bruke SlettMeg sine tjenester aksepterer du disse vilkårene
                for bruk. Hvis du ikke godtar vilkårene, ber vi deg om å ikke bruke
                tjenesten.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">2. Beskrivelse av tjenesten</h2>
              <p className="mt-4 text-muted-foreground">
                SlettMeg er en AI-drevet tjeneste som hjelper brukere med å:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Identifisere plattformer der de har registrerte kontoer</li>
                <li>Generere GDPR-forespørsler for sletting av personopplysninger</li>
                <li>Følge opp slettingsforespørsler</li>
                <li>Få veiledning om personvern og datasletting</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">3. Brukerkontoer</h2>
              <p className="mt-4 text-muted-foreground">
                For å bruke tjenesten må du opprette en konto. Du er ansvarlig for:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Å oppgi korrekt og oppdatert informasjon</li>
                <li>Å holde påloggingsinformasjonen din konfidensiell</li>
                <li>All aktivitet som skjer under din konto</li>
                <li>Å varsle oss umiddelbart ved uautorisert bruk</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">4. Akseptabel bruk</h2>
              <p className="mt-4 text-muted-foreground">
                Du samtykker i å ikke bruke tjenesten til:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Ulovlige aktiviteter eller formål</li>
                <li>Å sende falske eller villedende forespørsler</li>
                <li>Å utgi deg for å være en annen person</li>
                <li>Å forsøke å få uautorisert tilgang til systemet</li>
                <li>Å forstyrre eller skade tjenesten</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">5. Betalingsvilkår</h2>
              <p className="mt-4 text-muted-foreground">
                Noen av våre tjenester krever betaling. Ved kjøp av betalte tjenester:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Alle priser er oppgitt i norske kroner (NOK) inkludert mva.</li>
                <li>Abonnementer fornyes automatisk med mindre de kanselleres</li>
                <li>Du kan kansellere abonnementet når som helst</li>
                <li>Refusjon gis i henhold til norsk forbrukerlovgivning</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">6. Ansvarsfraskrivelse</h2>
              <p className="mt-4 text-muted-foreground">
                SlettMeg tilbyr verktøy og veiledning for datasletting, men:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Vi garanterer ikke at alle plattformer vil etterkomme forespørsler</li>
                <li>Tiden det tar å fullføre sletting varierer mellom plattformer</li>
                <li>Vi er ikke ansvarlige for tredjeparters handlinger</li>
                <li>Tjenesten leveres &quot;som den er&quot; uten garantier</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">7. Immaterielle rettigheter</h2>
              <p className="mt-4 text-muted-foreground">
                Alt innhold på SlettMeg, inkludert tekst, grafikk, logoer, og
                programvare, er beskyttet av opphavsrett og tilhører SlettMeg AS
                eller våre lisensgivere. Du får en begrenset, ikke-eksklusiv
                lisens til å bruke tjenesten for personlige formål.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">8. Ansvarsbegrensning</h2>
              <p className="mt-4 text-muted-foreground">
                SlettMeg er ikke ansvarlig for indirekte tap, følgeskader, tapt
                fortjeneste eller datatap som oppstår ved bruk av tjenesten.
                Vårt totale ansvar er begrenset til beløpet du har betalt for
                tjenesten de siste 12 månedene.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">9. Oppsigelse</h2>
              <p className="mt-4 text-muted-foreground">
                Vi kan suspendere eller avslutte din tilgang til tjenesten hvis
                du bryter disse vilkårene. Ved oppsigelse vil dine data bli
                slettet i henhold til vår personvernerklæring.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">10. Lovvalg og tvister</h2>
              <p className="mt-4 text-muted-foreground">
                Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal
                forsøkes løst ved forhandlinger. Dersom partene ikke kommer til
                enighet, skal tvisten avgjøres av norske domstoler med Oslo
                tingrett som verneting.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">11. Endringer i vilkårene</h2>
              <p className="mt-4 text-muted-foreground">
                Vi forbeholder oss retten til å endre disse vilkårene. Ved
                vesentlige endringer vil vi varsle deg via e-post eller gjennom
                tjenesten. Fortsatt bruk etter endringer utgjør aksept av de
                nye vilkårene.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">12. Kontakt</h2>
              <p className="mt-4 text-muted-foreground">
                For spørsmål om disse vilkårene, kontakt oss:
              </p>
              <div className="mt-4 rounded-lg bg-muted p-4">
                <p className="text-muted-foreground">
                  <strong>SlettMeg AS</strong><br />
                  E-post: juridisk@slettmeg.no<br />
                  Adresse: Oslo, Norge
                </p>
              </div>
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
