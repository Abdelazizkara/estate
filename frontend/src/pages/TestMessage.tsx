import { useEffect, useState, useRef } from "react";
import { socket } from "../services/socket";

interface GlobalMessage {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

const randomNickname = `Guest_${Math.floor(1000 + Math.random() * 9000)}`;

export default function GlobalChat({
  loggedInUsername,
}: {
  loggedInUsername?: string;
}) {
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myUsername = loggedInUsername || randomNickname;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleBroadcast = (msg: GlobalMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new-global-message", handleBroadcast);

    return () => {
      socket.off("new-global-message", handleBroadcast);
    };
  }, []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("send-global-message", {
      username: myUsername,
      content: text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-[650px] w-full max-w-lg mx-auto border border-purple-200 rounded-2xl shadow-xl bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-1"></div>
        ) : (
          messages.map((m) => {
            const isMe = m.username === myUsername;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-[11px] font-medium text-slate-500 mb-1 px-1">
                  {isMe ? "You" : m.username}
                </span>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${
                    isMe
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  <p className="break-words leading-relaxed">{m.content}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isMe ? "text-purple-200" : "text-slate-400"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={send}
        className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Broadcast a message to everyone..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-purple-100 active:scale-95 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}
