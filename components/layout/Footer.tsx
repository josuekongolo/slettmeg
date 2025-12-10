import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "Funksjoner", href: "/#features" },
    { name: "Priser", href: "/pricing" },
    { name: "Plattformer", href: "/platforms" },
  ],
  legal: [
    { name: "Personvern", href: "/privacy" },
    { name: "Vilkår", href: "/terms" },
  ],
  support: [
    { name: "Hjelp", href: "/help" },
    { name: "Kontakt", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/delete.svg"
                alt="SlettMeg Logo"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="text-xl font-bold">SlettMeg</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-drevet tjeneste som hjelper deg med å slette personlig
              informasjon fra digitale plattformer.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold">Produkt</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Juridisk</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SlettMeg. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
}
