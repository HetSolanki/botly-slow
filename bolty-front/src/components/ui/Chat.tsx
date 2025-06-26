import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { vscode } from "@/vscode";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any>([]);

  const handleClick = () => {
    setMessages((prev: any) => [...prev, { type: "user", content: prompt }]);
    vscode.postMessage({ type: "user", text: prompt });
  };

  const addAgentMessage = (msg: any) => {
    console.log(msg);
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
    <div className="">
      <div className="min-h-screen text-left">
        {messages.map((msg: any, i: any) => (
          <div key={i} className="">
            <p>
              <b>{msg.type === "user" ? "User" : "Agent"}</b>{" "}
              <Markdown>{msg.content}</Markdown>
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center fixed left-2 bottom-2 right-2 items-baseline bg-[#77707080] rounded-sm  ">
        <div className="flex w-full justify-between items-center gap-4 p-4 rounded-none">
          <Input
            type="text"
            placeholder="Edit files in your workspace with botly"
            className="w-full border-black text-black"
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
