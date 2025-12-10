import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { stripe, PLANS } from "@/lib/stripe";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's subscription
  const subscription = await db.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription) {
    // Create a FREE subscription if none exists
    await db.subscription.create({
      data: {
        userId: user.id,
        status: "ACTIVE",
        plan: "FREE",
      },
    });
  }

  const currentSubscription = subscription || {
    plan: "FREE",
    status: "ACTIVE",
    stripeCurrentPeriodEnd: null,
  };

  // Fetch invoices from Stripe if user has a subscription
  let invoices: any[] = [];
  if (subscription?.stripeCustomerId) {
    try {
      const stripeInvoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 10,
      });
      invoices = stripeInvoices.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  }

  // Prepare plans data
  const plansData = [
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
      current: currentSubscription.plan === "FREE",
      priceId: PLANS.FREE.priceId,
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
      current: currentSubscription.plan === "PRO",
      priceId: PLANS.PRO.priceId,
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
      current: currentSubscription.plan === "BUSINESS",
      priceId: PLANS.BUSINESS.priceId,
    },
  ];

  return (
    <BillingClient
      subscription={currentSubscription}
      plans={plansData}
      invoices={invoices}
    />
  );
}
