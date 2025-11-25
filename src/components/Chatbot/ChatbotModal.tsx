import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";

export const ChatbotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: any }[]>(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const toggleModal = () => setIsOpen(!isOpen);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("ttps://crimes-production.up.railway.app/api/violencias/mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, context: newMessages }),
      });

      const data = await res.json();

      const response =
        typeof data.response === "object"
          ? data.response
          : String(data.response ?? "");

      setMessages([...newMessages, { role: "assistant", content: response }]);

    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Erro ao conectar ao servidor tente novamente mais tarde." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: any) => {
    // SE FOR OBJETO → CHECAR SE É RELATÓRIO
    if (typeof content === "object" && content !== null) {
      if (content.tipo === "relatorio_pdf") {
        return (
          <div className="flex flex-col gap-2">
            <p>{content.mensagem}</p>
            <a
              href={`ttps://crimes-production.up.railway.app/api/violencias/relatorio/download`}
              download
              className="text-blue-600 underline font-semibold"
            >
              📄 Baixar Relatório PDF
            </a>
          </div>
        );
      }

      // OBJETO NORMAL → PRINTAR BONITO
      return (
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }

    // STRING NORMAL
    return <>{content}</>;
  };

  return (
    <>
      <Button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 bg-primary hover:bg-primary-hover flex items-center justify-center"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 z-50">
          <Card className="shadow-xl border-2 border-primary/20 bg-background backdrop-blur">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-lg font-bold text-primary">SOFON</CardTitle>
              <CardTitle className="text-xs text-muted-foreground font-medium">
                Sistema de observação Forense e Notificações
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground self-end max-w-[80%]"
                      : "bg-muted text-foreground self-start max-w-[80%]"
                  }`}
                >
                  {renderContent(m.content)}
                </div>
              ))}

              {loading && (
                <div className="text-muted-foreground text-sm italic">Pensando...</div>
              )}

              <div ref={chatEndRef} />
            </CardContent>

            <div className="flex p-2 border-t items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={sendMessage}
                className="ml-2 bg-primary text-white hover:bg-primary-hover"
                disabled={loading}
              >
                Enviar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
