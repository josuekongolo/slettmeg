"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { HiOutlinePaperAirplane, HiOutlineUser, HiOutlineSparkles, HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const suggestedQuestions = [
  "Hvordan sletter jeg min Facebook-konto?",
  "Hva er mine GDPR-rettigheter?",
  "Generer en slettingsforespørsel for Instagram",
  "Hvilke plattformer er vanskeligst å slette?",
];

export default function AssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hei! Jeg er din AI-assistent for personvern. Jeg kan hjelpe deg med å:\n\n• Finne ut hvordan du sletter kontoer på ulike plattformer\n• Generere GDPR-forespørsler\n• Svare på spørsmål om personvern og datasletting\n\nHvordan kan jeg hjelpe deg i dag?",
      },
    ],
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <RiRobot2Line size={16} />
                    ) : (
                      <HiOutlineUser size={16} />
                    )}
                  </div>
                  <div
                    className={`group relative max-w-[80%] rounded-lg p-3 ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>
                    {message.role === "assistant" && (
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="absolute -right-2 -top-2 rounded-full bg-background p-1.5 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                      >
                        {copiedIndex === index ? (
                          <HiCheck size={12} className="text-green-500" />
                        ) : (
                          <HiOutlineClipboardCopy size={12} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <RiRobot2Line size={16} />
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Skriv din melding..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <HiOutlinePaperAirplane size={16} />
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar with suggestions */}
        <div className="hidden w-80 space-y-4 lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Foreslåtte spørsmål</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Vær spesifikk om hvilken plattform du trenger hjelp med</li>
                <li>• Be om GDPR-maler for offisielle forespørsler</li>
                <li>• Spør om tidsfrister og forventede svar</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
