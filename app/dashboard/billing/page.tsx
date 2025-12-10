"use client";

import Link from "next/link";
import { HiOutlineCreditCard, HiCheck, HiExternalLink } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    current: false,
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
    current: true,
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
    current: false,
  },
];

const invoices = [
  { id: "INV-001", date: "2024-01-01", amount: "79 kr", status: "Betalt" },
  { id: "INV-002", date: "2023-12-01", amount: "79 kr", status: "Betalt" },
  { id: "INV-003", date: "2023-11-01", amount: "79 kr", status: "Betalt" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fakturering</h1>
        <p className="text-muted-foreground">
          Administrer ditt abonnement og betalinger
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HiOutlineCreditCard size={20} />
                Gjeldende plan
              </CardTitle>
              <CardDescription>Du er på Pro-planen</CardDescription>
            </div>
            <Badge>Aktiv</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">79</span>
            <span className="text-muted-foreground">kr/mnd</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Neste fakturering: 1. februar 2024
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline">Administrer abonnement</Button>
          <Button variant="outline">Oppdater betalingsmetode</Button>
        </CardFooter>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Tilgjengelige planer</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.current ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.current && <Badge variant="secondary">Gjeldende</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> kr/mnd</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <HiCheck size={16} className="text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Gjeldende plan" : "Bytt til denne planen"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Fakturahistorikk</CardTitle>
          <CardDescription>Se og last ned tidligere fakturaer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Badge variant="secondary">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <HiExternalLink size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
