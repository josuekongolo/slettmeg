"use client";

import { RiRobot2Line } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineSparkles } from "react-icons/hi";

const suggestedQuestions = [
  "Hvordan sletter jeg min Facebook-konto?",
  "Hva er mine GDPR-rettigheter?",
  "Generer en slettingsforespørsel for Instagram",
  "Hvilke plattformer er vanskeligst å slette?",
];

export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistent</h1>
        <p className="text-muted-foreground">
          Få hjelp med å slette dine kontoer og beskytte ditt personvern
        </p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Chat Area */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <RiRobot2Line size={20} className="text-primary" />
              Personvernassistent
              <HiOutlineSparkles size={16} className="text-primary" />
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col items-center justify-center p-8">
            <RiRobot2Line className="mb-4 text-muted-foreground/30" size={64} />
            <h3 className="mb-2 text-lg font-semibold">AI-assistent kommer snart</h3>
            <p className="text-center text-sm text-muted-foreground max-w-md">
              Vi jobber med å integrere den nye AI SDK-versjonen. Funksjonaliteten vil være tilgjengelig i neste oppdatering.
            </p>
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        <Card className="w-80">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Foreslåtte spørsmål</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                disabled
                className="w-full rounded-lg border bg-muted/30 p-3 text-left text-sm opacity-50 cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
