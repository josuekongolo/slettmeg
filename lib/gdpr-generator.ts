// GDPR Request Letter Generator

export interface GDPRRequestData {
  userName: string;
  userEmail: string;
  platformName: string;
  accountIdentifier?: string; // Username, email, or ID on the platform
  requestType: "deletion" | "export" | "access" | "correction";
  additionalInfo?: string;
}

export function generateGDPRRequest(data: GDPRRequestData): string {
  const currentDate = new Date().toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const templates: Record<string, string> = {
    deletion: `Til ${data.platformName},

Jeg skriver til dere i henhold til artikkel 17 i EUs personvernforordning (GDPR), som gir meg rett til å få slettet mine personopplysninger ("retten til å bli glemt").

FORESPØRSEL OM SLETTING AV PERSONOPPLYSNINGER

Personlig informasjon:
- Navn: ${data.userName}
- E-postadresse: ${data.userEmail}
${data.accountIdentifier ? `- Konto/brukernavn: ${data.accountIdentifier}` : ""}

Jeg ber herved om at alle personopplysninger dere har lagret om meg slettes permanent fra deres systemer. Dette inkluderer, men er ikke begrenset til:

• Kontoinformasjon og profildata
• Aktivitetslogger og brukshistorikk
• Bilder, videoer og annet innhold jeg har lastet opp
• Meldinger og kommunikasjon
• Betalingsinformasjon (med unntak av det som kreves av lovgivning)
• Alle sikkerhetskopier som inneholder mine data
• Data delt med tredjeparter på mine vegne

${data.additionalInfo ? `Tilleggsinformasjon:\n${data.additionalInfo}\n\n` : ""}I henhold til GDPR artikkel 12(3) ber jeg om at dere bekrefter slettingen innen 30 dager fra mottak av denne forespørselen.

Dersom dere ikke kan etterkomme denne forespørselen, ber jeg om en skriftlig begrunnelse med referanse til relevant lovhjemmel.

Jeg forbeholder meg retten til å klage til Datatilsynet dersom denne forespørselen ikke behandles i henhold til gjeldende lovgivning.

Med vennlig hilsen,

${data.userName}
${data.userEmail}
Dato: ${currentDate}

---
Denne forespørselen er sendt i henhold til:
- EU General Data Protection Regulation (GDPR) Artikkel 17
- Norsk personopplysningslov`,

    export: `Til ${data.platformName},

Jeg skriver til dere i henhold til artikkel 20 i EUs personvernforordning (GDPR), som gir meg rett til dataportabilitet.

FORESPØRSEL OM EKSPORT AV PERSONOPPLYSNINGER

Personlig informasjon:
- Navn: ${data.userName}
- E-postadresse: ${data.userEmail}
${data.accountIdentifier ? `- Konto/brukernavn: ${data.accountIdentifier}` : ""}

Jeg ber herved om en fullstendig kopi av alle personopplysninger dere har lagret om meg. Jeg ønsker at dataene leveres i et strukturert, alminnelig brukt og maskinlesbart format (f.eks. JSON, CSV eller XML).

Dette inkluderer, men er ikke begrenset til:

• Kontoinformasjon og profildata
• Aktivitetslogger og brukshistorikk
• Alt innhold jeg har lastet opp eller opprettet
• Meldinger og kommunikasjon
• Preferanser og innstillinger
• Data utledet fra min bruk av tjenesten

${data.additionalInfo ? `Tilleggsinformasjon:\n${data.additionalInfo}\n\n` : ""}I henhold til GDPR artikkel 12(3) ber jeg om at dere leverer disse dataene innen 30 dager fra mottak av denne forespørselen.

Med vennlig hilsen,

${data.userName}
${data.userEmail}
Dato: ${currentDate}

---
Denne forespørselen er sendt i henhold til:
- EU General Data Protection Regulation (GDPR) Artikkel 20
- Norsk personopplysningslov`,

    access: `Til ${data.platformName},

Jeg skriver til dere i henhold til artikkel 15 i EUs personvernforordning (GDPR), som gir meg rett til innsyn i mine personopplysninger.

FORESPØRSEL OM INNSYN I PERSONOPPLYSNINGER

Personlig informasjon:
- Navn: ${data.userName}
- E-postadresse: ${data.userEmail}
${data.accountIdentifier ? `- Konto/brukernavn: ${data.accountIdentifier}` : ""}

Jeg ber herved om følgende informasjon:

1. Bekreftelse på om dere behandler mine personopplysninger
2. En kopi av alle personopplysninger dere har om meg
3. Formålet med behandlingen
4. Kategoriene av personopplysninger som behandles
5. Mottakere eller kategorier av mottakere som dataene er eller vil bli utlevert til
6. Den planlagte lagringsperioden eller kriteriene for å fastsette denne
7. Informasjon om kilden til opplysningene dersom de ikke er samlet inn fra meg
8. Informasjon om automatisert beslutningstaking, inkludert profilering

${data.additionalInfo ? `Tilleggsinformasjon:\n${data.additionalInfo}\n\n` : ""}I henhold til GDPR artikkel 12(3) ber jeg om svar innen 30 dager fra mottak av denne forespørselen.

Med vennlig hilsen,

${data.userName}
${data.userEmail}
Dato: ${currentDate}

---
Denne forespørselen er sendt i henhold til:
- EU General Data Protection Regulation (GDPR) Artikkel 15
- Norsk personopplysningslov`,

    correction: `Til ${data.platformName},

Jeg skriver til dere i henhold til artikkel 16 i EUs personvernforordning (GDPR), som gir meg rett til å få rettet unøyaktige personopplysninger.

FORESPØRSEL OM RETTING AV PERSONOPPLYSNINGER

Personlig informasjon:
- Navn: ${data.userName}
- E-postadresse: ${data.userEmail}
${data.accountIdentifier ? `- Konto/brukernavn: ${data.accountIdentifier}` : ""}

Jeg ber herved om at følgende personopplysninger rettes:

${data.additionalInfo || "[Beskriv hvilke opplysninger som er feil og hva de skal endres til]"}

I henhold til GDPR artikkel 12(3) ber jeg om at dere bekrefter rettingen innen 30 dager fra mottak av denne forespørselen.

Med vennlig hilsen,

${data.userName}
${data.userEmail}
Dato: ${currentDate}

---
Denne forespørselen er sendt i henhold til:
- EU General Data Protection Regulation (GDPR) Artikkel 16
- Norsk personopplysningslov`,
  };

  return templates[data.requestType] || templates.deletion;
}

// Platform-specific GDPR contact information
export const platformGDPRContacts: Record<string, { email?: string; url?: string; notes?: string }> = {
  facebook: {
    url: "https://www.facebook.com/help/contact/784491318687824",
    email: "datarequest@support.facebook.com",
    notes: "Facebook anbefaler å bruke deres online skjema for GDPR-forespørsler.",
  },
  instagram: {
    url: "https://help.instagram.com/contact/1845713985721890",
    notes: "Instagram håndteres gjennom Meta/Facebook sitt kontosenter.",
  },
  google: {
    url: "https://support.google.com/accounts/troubleshooter/6357590",
    notes: "Google har et dedikert verktøy for GDPR-forespørsler i kontoinnstillingene.",
  },
  twitter: {
    email: "privacy@twitter.com",
    url: "https://help.twitter.com/forms/privacy",
    notes: "X/Twitter aksepterer både e-post og online skjema.",
  },
  linkedin: {
    url: "https://www.linkedin.com/help/linkedin/ask/TSO-DPO",
    notes: "LinkedIn har et online skjema for personvernforespørsler.",
  },
  tiktok: {
    url: "https://www.tiktok.com/legal/report/privacy",
    email: "privacy@tiktok.com",
  },
  spotify: {
    url: "https://support.spotify.com/contact-spotify-privacy/",
    notes: "Bruk Spotify sitt online skjema for personvernforespørsler.",
  },
  netflix: {
    url: "https://help.netflix.com/en/contactus",
    email: "privacy@netflix.com",
  },
  amazon: {
    url: "https://www.amazon.com/gp/help/customer/contact-us",
    notes: "Kontakt Amazon kundeservice og be om å bli videresendt til personvernavdelingen.",
  },
  snapchat: {
    url: "https://support.snapchat.com/en-US/i-need-help",
    email: "privacy@snap.com",
  },
  discord: {
    url: "https://support.discord.com/hc/en-us/requests/new",
    email: "privacy@discord.com",
  },
  reddit: {
    url: "https://www.reddit.com/settings/data-request",
    notes: "Reddit har innebygd funksjon for dataforespørsler i kontoinnstillingene.",
  },
  whatsapp: {
    url: "https://www.whatsapp.com/contact/",
    notes: "WhatsApp-kontoer kan slettes direkte i appen under Innstillinger.",
  },
  telegram: {
    url: "https://telegram.org/deactivate",
    notes: "Telegram-kontoer kan deaktiveres direkte via deres nettside.",
  },
  twitch: {
    url: "https://help.twitch.tv/s/contactsupport",
    email: "privacy@twitch.tv",
  },
  steam: {
    url: "https://help.steampowered.com/",
    notes: "Steam krever kontakt via deres support-system for kontosletting.",
  },
  tinder: {
    url: "https://www.help.tinder.com/hc/requests/new",
    email: "DPO@match.com",
    notes: "Tinder eies av Match Group. E-post går til deres personvernombud.",
  },
  bumble: {
    url: "https://bumble.com/contact",
    email: "DPO@team.bumble.com",
  },
};

// Get GDPR contact for a platform
export function getPlatformGDPRContact(platformId: string) {
  return platformGDPRContacts[platformId] || null;
}

// Generate email subject line
export function generateEmailSubject(platformName: string, requestType: string): string {
  const subjects: Record<string, string> = {
    deletion: `GDPR Artikkel 17 - Forespørsel om sletting av personopplysninger`,
    export: `GDPR Artikkel 20 - Forespørsel om dataportabilitet`,
    access: `GDPR Artikkel 15 - Forespørsel om innsyn i personopplysninger`,
    correction: `GDPR Artikkel 16 - Forespørsel om retting av personopplysninger`,
  };

  return subjects[requestType] || subjects.deletion;
}
