import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MessageCircle, Search } from "lucide-react";
import { socket } from "../sockets/socket";
import { useAuth } from "../context/AuthContext";
import { fetchChats } from "../services/chatService";
import { fetchMessages, sendMessage } from "../services/messageService";
import LogoutIcon from "../components/icons/LogoutIcon";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../utils/constants";

const Chat = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const messageContainerRef = useRef(null);
  const isInitialLoad = useRef(true);

  const loadOlderMessages = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const data = await fetchMessages(selectedChat._id, user.token, nextPage);
    setMessages((prev) => [...data.messages.reverse(), ...prev]);
    setPage(data.currentPage);
    setHasMore(data.hasMore);
    setLoadingMore(false);
  };

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;
    if (container.scrollTop <= 20) {
      loadOlderMessages();
    }
  };

  // Setup socket connection 1
  useEffect(() => {
    if (!user) return;
    socket.emit("setup", user);
    socket.on("connected", () => {
      // console.log("a user connected and status of the user is online.")
    });
    return () => {
      socket.off("connected");
    };
  }, [user]);

  // Load chats 2
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats(user.token);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    //scroll to bottom
    if (!messageContainerRef.current) return;

    if (isInitialLoad.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      isInitialLoad.current = false;
    }
  }, [messages]);

  // Load messages when chat selected
  useEffect(() => {
    if (!selectedChat) return;
    const loadMessages = async () => {
      try {
        const res = await fetchMessages(selectedChat._id, user.token, 1);
        setMessages(res.messages.reverse());
        isInitialLoad.current = true;
        setPage(res.currentPage);
        setHasMore(res.hasMore);

        socket.emit("join_chat", selectedChat._id);
      } catch (error) {
        console.log(error);
      }
    };
    loadMessages();
  }, [selectedChat, user]);

  // Listen for realtime messages
  useEffect(() => {
    socket.on("message_received", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("message_received");
    };
  }, []);

  //typing
  useEffect(() => {
    socket.on("typing", (username) => {
      setIsTyping(true);
      setTypingUser(username);
    });
    socket.on("stop_typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });
    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!selectedChat) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", {
        chatId: selectedChat._id,
        user: user.username,
      });
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();

      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop_typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!selectedChat) return;
    try {
      const message = await sendMessage(
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        user.token
      );

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // Online VS Offline vs last seen
  useEffect(() => {
    socket.on("user_online", (userId) => {
      setSelectedChat((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u._id === userId ? { ...u, isOnline: true } : u
          ),
        };
      });
    });
    socket.on("user_offline", (data) => {
      setSelectedChat((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u._id === data.userIdb
              ? { ...u, isOnline: false, lastSeen: data.lastSeen }
              : u
          ),
        };
      });
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

  const handleLogout = () => {
    // socket.disconnect();
    console.log("logout called ");
    logout();

    // navigate("/login");
  };

  const otherUser = selectedChat?.users?.find((u) => u._id !== user._id);

  return (
    <div className="h-screen flex" style={{ background: COLORS.bg, fontFamily: FONT_BODY }}>
      {/* Sidebar */}
      <div
        className="w-[30%] flex flex-col"
        style={{ background: COLORS.card, borderRight: `1px solid ${COLORS.line}` }}
      >
        {/* Brand + user */}
        <div className="p-5" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 32,
                height: 32,
                background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.coral})`,
              }}
            >
              <MessageCircle size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}
            >
              DevChat
            </span>
          </div>
          <p className="text-xs" style={{ color: COLORS.inkSoft }}>
            Welcome back,
          </p>
          <p className="text-sm font-semibold" style={{ color: COLORS.indigo }}>
            {user?.username || "unknown user"}
          </p>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-3">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2 px-1"
            style={{ color: COLORS.inkSoft }}
          >
            Chats
          </p>

          {chats.map((chat) => {
            const isActive = selectedChat?._id === chat._id;
            const label = !chat.isGroupChat
              ? chat.users.find((person) => person._id !== user._id)?.username
              : "unknown";

            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className="flex items-center gap-3 p-3 mb-1.5 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: isActive ? "#EEEBFB" : "transparent",
                  border: isActive ? `1px solid ${COLORS.indigo}33` : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#F7F5FC";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0 text-sm font-semibold"
                  style={{
                    width: 36,
                    height: 36,
                    background: isActive ? COLORS.indigo : "#E7E2F5",
                    color: isActive ? "#fff" : COLORS.inkSoft,
                  }}
                >
                  {label?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: COLORS.ink }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: `1px solid ${COLORS.line}` }}>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: "#FFEDE9", color: "#C23B2A" }}
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.line}` }}
        >
          {selectedChat ? (
            <>
              <h2
                className="font-bold text-lg"
                style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}
              >
                {selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.username}
              </h2>

              {!selectedChat.isGroupChat && (
                <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
                  {otherUser?.isOnline ? (
                    <span style={{ color: COLORS.mint }}>● Online</span>
                  ) : (
                    `Last seen ${
                      otherUser?.lastSeen
                        ? new Date(otherUser.lastSeen).toLocaleString()
                        : "Unknown"
                    }`
                  )}
                </p>
              )}

              {isTyping && (
                <p className="text-xs mt-1 font-medium" style={{ color: COLORS.indigo }}>
                  {typingUser} is typing...
                </p>
              )}
            </>
          ) : (
            <h2 className="font-bold" style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}>
              Select a chat
            </h2>
          )}
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          ref={messageContainerRef}
          onScroll={handleScroll}
        >
          {messages
            .filter((msg) => msg && msg._id)
            .map((message) => {
              const isMine = message?.sender?._id === user?._id;
              return (
                <div
                  key={message._id}
                  className={`mb-2.5 flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="px-4 py-2.5 rounded-2xl max-w-xs text-sm leading-relaxed"
                    style={{
                      background: isMine ? COLORS.indigo : "#FFFFFF",
                      color: isMine ? "#fff" : COLORS.ink,
                      border: isMine ? "none" : `1px solid ${COLORS.line}`,
                      borderBottomRightRadius: isMine ? 6 : undefined,
                      borderBottomLeftRadius: !isMine ? 6 : undefined,
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div
            className="px-6 py-4 flex gap-3"
            style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.line}` }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={typingHandler}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-colors"
              style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.indigo)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.line)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center gap-2 px-5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: COLORS.indigo, color: "#fff" }}
            >
              <Send size={15} />
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;