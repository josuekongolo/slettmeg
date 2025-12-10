"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCreditCard, HiCheck, HiExternalLink } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
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

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  current: boolean;
  priceId?: string;
}

interface BillingClientProps {
  subscription: {
    plan: string;
    status: string;
    stripeCurrentPeriodEnd?: Date | null;
  };
  plans: Plan[];
  invoices: any[];
}

export function BillingClient({ subscription, plans, invoices }: BillingClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId?: string) => {
    if (!priceId) return;

    setIsLoading(priceId);

    try {
      // Call checkout API
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading("portal");

    try {
      // Call portal API
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      setIsLoading(null);
    }
  };

  const currentPlan = plans.find(p => p.current);

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
      <Card className={currentPlan?.current ? "border-primary" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HiOutlineCreditCard size={20} />
                Gjeldende plan
              </CardTitle>
              <CardDescription>
                Du er på {currentPlan?.name}-planen
              </CardDescription>
            </div>
            <Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>
              {subscription.status === "ACTIVE" ? "Aktiv" : subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{currentPlan?.price || "0"}</span>
            <span className="text-muted-foreground">kr/mnd</span>
          </div>
          {subscription.stripeCurrentPeriodEnd && (
            <p className="mt-2 text-sm text-muted-foreground">
              Neste fakturering: {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          {subscription.plan !== "FREE" && (
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isLoading === "portal"}
            >
              {isLoading === "portal" ? (
                <>
                  <CgSpinner className="mr-2 animate-spin" size={16} />
                  Laster...
                </>
              ) : (
                "Administrer abonnement"
              )}
            </Button>
          )}
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
                  disabled={plan.current || isLoading === plan.priceId}
                  onClick={() => handleUpgrade(plan.priceId)}
                >
                  {isLoading === plan.priceId ? (
                    <>
                      <CgSpinner className="mr-2 animate-spin" size={16} />
                      Laster...
                    </>
                  ) : plan.current ? (
                    "Gjeldende plan"
                  ) : (
                    "Bytt til denne planen"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Invoices */}
      {invoices.length > 0 && (
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
                    <p className="font-medium">{invoice.number || invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.created * 1000).toLocaleDateString("nb-NO")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {(invoice.amount_paid / 100).toFixed(0)} kr
                    </span>
                    <Badge variant={invoice.status === "paid" ? "success" : "secondary"}>
                      {invoice.status === "paid" ? "Betalt" : invoice.status}
                    </Badge>
                    {invoice.invoice_pdf && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={invoice.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <HiExternalLink size={16} />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
