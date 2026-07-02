import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { socket } from "../services/socket";

interface ConversationSummary {
  id: string;
  otherUser: { id: string; name: string; role: string } | null;
  property: { id: string; title: string } | null;
  lastMessage: { content: string; createdAt: string } | null;
}
interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export default function MessagesPage() {
  const { user } = useUserStore();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/conversations", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setConversations(data.conversations ?? []));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    socket.emit("join-conversation", activeId);
    fetch(`http://localhost:3001/conversations/${activeId}/messages`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []));
    return () => {
      socket.emit("leave-conversation", activeId);
    };
  }, [activeId]);

  useEffect(() => {
    const handleNew = (msg: Message & { conversationId: string }) => {
      if (msg.conversationId === activeId)
        setMessages((prev) => [...prev, msg]);
    };
    socket.on("new-message", handleNew);
    return () => {
      socket.off("new-message", handleNew);
    };
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    socket.emit("send-message", { conversationId: activeId, content: text });
    setText("");
  };

  if (!user) return null;
  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No conversations yet
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${activeId === c.id ? "bg-primary-50" : ""}`}
                >
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {c.otherUser?.name ?? "Unknown user"}
                  </p>
                  {c.property && (
                    <p className="text-xs text-primary-600 truncate">
                      {c.property.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 truncate">
                    {c.lastMessage?.content ?? "No messages yet"}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg flex flex-col">
            {!activeId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="h-12 w-12 mb-2" />
                <p>Select a conversation</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">
                    {active?.otherUser?.name}
                  </p>
                  {active?.property && (
                    <p className="text-xs text-gray-500">
                      {active.property.title}
                    </p>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => {
                    const isMe = m.sender.id === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? "bg-black text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"}`}
                        >
                          <p className="break-words">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>

                <form
                  onSubmit={send}
                  className="p-3 border-t border-gray-100 flex items-center gap-2"
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-xl transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
