import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { vscode } from "@/vscode";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setMessages((prev: any) => [...prev, { type: "user", content: prompt }]);
    vscode.postMessage({ type: "user", text: prompt });
  };

  const addAgentMessage = (msg: any) => {
    setLoading(false);
    setMessages((prev: any) => [
      ...prev,
      { type: "model_response", content: msg.content },
    ]);
  };

  const handleMsg = (e: MessageEvent) => {
    const msg = e.data;
    if (msg.type !== "model_response") return;
    addAgentMessage(msg);
  };

  useEffect(() => {
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Part */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg: any, i: any) => (
          <div key={i} className="my-3">
            <p
              className={cn(
                msg.type === "user" ? "text-right" : "text-left",
                "text-base"
              )}
            >
              <b className="font-semibold">
                {msg.type === "user" ? "" : "Botly-Agent"}
              </b>{" "}
              <Markdown>{msg.content}</Markdown>
            </p>
          </div>
        ))}
        {loading && (
          <div className="animate-spin inline-block size-5 border-2 border-current border-t-transparent text-white rounded-full"></div>
        )}
      </div>

      {/* Input part */}
      <div className="p-1.5 bg-stone-800 flex items-center gap-2">
        <div className="flex w-full justify-between items-center gap-4 p-4 rounded-none">
          <Input
            type="text"
            placeholder="Edit files in your workspace with botly"
            className="w-full border-white text-white"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline"
            onClick={() => handleClick()}
            className="border-black font-semibold"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
