import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Gratis",
    price: 0,
    priceId: process.env.STRIPE_PRICE_FREE || "price_free",
    features: [
      "Opptil 5 plattformer",
      "Grunnleggende veiledning",
      "GDPR-maler",
    ],
  },
  PRO: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO || "price_pro",
    features: [
      "Ubegrenset plattformer",
      "AI-assistert veiledning",
      "Automatiske GDPR-forespørsler",
      "Prioritert support",
    ],
  },
  BUSINESS: {
    name: "Business",
    price: 199,
    priceId: process.env.STRIPE_PRICE_BUSINESS || "price_business",
    features: [
      "Alt i Pro",
      "Flerbr ukerstøtte",
      "API-tilgang",
      "Dedikert account manager",
      "Custom integrasjoner",
    ],
  },
};
