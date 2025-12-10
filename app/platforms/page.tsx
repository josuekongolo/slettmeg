"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HiSearch, HiExternalLink, HiArrowRight, HiAdjustments } from "react-icons/hi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  platforms,
  categories,
  type Platform,
} from "@/lib/platforms-data";
import { PlatformIcon } from "@/components/platform-icon";

const difficultyConfig = {
  easy: { label: "Enkelt", variant: "success" as const },
  medium: { label: "Middels", variant: "warning" as const },
  hard: { label: "Vanskelig", variant: "destructive" as const },
};

export default function PlatformsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");

  const filteredPlatforms = useMemo(() => {
    return platforms.filter((platform) => {
      const matchesSearch = platform.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Alle" || platform.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { Alle: platforms.length };
    platforms.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              {platforms.length}+ plattformer
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Støttede plattformer
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Vi hjelper deg med å slette dine data fra {platforms.length}+ plattformer.
              Finn din plattform og få veiledning for å slette dine personlige data.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Kom i gang gratis
                <HiArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="sticky top-16 z-30 border-b bg-background/95 py-4 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative max-w-md flex-1">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Søk etter plattform..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                    {categoryCount[category] && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({categoryCount[category]})
                      </span>
                    )}
                  </Button>
                ))}
                {categories.length > 8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <HiAdjustments className="mr-1" size={12} />
                    Flere
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills for Mobile */}
        <section className="border-b py-3 lg:hidden">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="shrink-0 text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Viser {filteredPlatforms.length} av {platforms.length} plattformer
              </p>
              {selectedCategory !== "Alle" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("Alle")}
                >
                  Vis alle
                </Button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPlatforms.map((platform) => (
                <Card
                  key={platform.id}
                  className="group transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/50">
                          <PlatformIcon platformId={platform.id} size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-base leading-tight">
                            {platform.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {platform.category}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={difficultyConfig[platform.difficulty].variant}
                          className="text-xs"
                        >
                          {difficultyConfig[platform.difficulty].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {platform.estimatedTime}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        asChild
                      >
                        <Link href="/auth/register">
                          Start
                          <HiExternalLink className="ml-1" size={12} />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlatforms.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <HiSearch size={32} className="text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Ingen plattformer funnet</h3>
                <p className="text-muted-foreground">
                  Prøv å endre søket eller velg en annen kategori.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Alle");
                  }}
                >
                  Nullstill filter
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-primary">{platforms.length}+</div>
                <div className="mt-1 text-sm text-muted-foreground">Plattformer støttet</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{categories.length - 1}</div>
                <div className="mt-1 text-sm text-muted-foreground">Kategorier</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">GDPR</div>
                <div className="mt-1 text-sm text-muted-foreground">Kompatibel</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Finner du ikke plattformen din?
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
              Vi legger kontinuerlig til nye plattformer. Kontakt oss så hjelper
              vi deg med å slette data fra andre tjenester også.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/auth/register">Kom i gang</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Kontakt oss</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
