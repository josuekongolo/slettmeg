import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.customer && session.subscription) {
          await db.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              status: "ACTIVE",
              plan: "PRO", // Default, will be updated by subscription.created
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              status: "ACTIVE",
            },
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSubscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (userSubscription) {
          // Determine plan from price ID
          let plan: "FREE" | "PRO" | "BUSINESS" = "FREE";
          const priceId = subscription.items.data[0]?.price.id;

          if (priceId === process.env.STRIPE_PRICE_PRO) {
            plan = "PRO";
          } else if (priceId === process.env.STRIPE_PRICE_BUSINESS) {
            plan = "BUSINESS";
          }

          await db.subscription.update({
            where: { id: userSubscription.id },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              status: subscription.status === "active" ? "ACTIVE" :
                      subscription.status === "past_due" ? "PAST_DUE" :
                      subscription.status === "canceled" ? "CANCELED" :
                      subscription.status === "unpaid" ? "UNPAID" : "INACTIVE",
              plan,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const userSubscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (userSubscription) {
          await db.subscription.update({
            where: { id: userSubscription.id },
            data: {
              status: "CANCELED",
              plan: "FREE",
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const customerId = invoice.customer as string;
          const userSubscription = await db.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (userSubscription) {
            await db.subscription.update({
              where: { id: userSubscription.id },
              data: { status: "ACTIVE" },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const customerId = invoice.customer as string;
          const userSubscription = await db.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (userSubscription) {
            await db.subscription.update({
              where: { id: userSubscription.id },
              data: { status: "PAST_DUE" },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
