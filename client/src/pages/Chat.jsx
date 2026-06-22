import { useEffect, useState,useRef } from "react";
import { socket } from "../sockets/socket";
import { useAuth } from "../context/AuthContext";
import { fetchChats } from "../services/chatService";
import { fetchMessages, sendMessage } from "../services/messageService";
const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false)
  const [typing, setTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("");
  const [page,setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore,setLoadingMore] = useState(false);
  const messageContainerRef = useRef(null);



  const loadOlderMessages = async () => {
          if (!hasMore || loadingMore) return;
          setLoadingMore(true);
          const nextPage = page + 1;
          const data = await fetchMessages(
            selectedChat._id,
            user.token,
            nextPage
          );
          setMessages(prev => [
            ...data.messages.reverse(),
            ...prev,
          ]);
          setPage(data.currentPage);
          setHasMore(data.hasMore);
          setLoadingMore(false);
        };

        const handleScroll =()=>{
          const container = messageContainerRef.current;
          if(!container)return;
          if(container.scrollTop <=20){
            loadOlderMessages()
          }
        }
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

    
  // Load messages when chat selected
  useEffect(() => {
    if (!selectedChat) return;
    const loadMessages = async () => {
      try {
        const res = await fetchMessages(selectedChat._id, user.token,1);
        setMessages(res.messages.reverse());
        setPage(res.currentPage)
        setHasMore(res.hasMore)


       
        //scroll to bottom
        setTimeout(()=>{
          const container = messageContainerRef.current;
             container.scrollTop = container.scrollHeight;
        },0)

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
        setMessages(prev => [...prev, message]);
      });
      return () => {
        socket.off("message_received");
      };
    }, []);


//typing 
  useEffect(() => {
    socket.on('typing', (username) => {
      setIsTyping(true)
      setTypingUser(username)
    })
    socket.on('stop_typing', () => {
      setIsTyping(false)
      setTypingUser("")
    })
    return () => {
      socket.off('typing')
      socket.off('stop_typing')
    }
  }, [])

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!selectedChat) return;
    if (!typing) { 
      setTyping(true)
      socket.emit('typing',{ 
        chatId:selectedChat._id,
        user:user.username
      })
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
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!selectedChat) return;
    try {
      const message = await sendMessage({
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
          u._id === userId
            ? { ...u, isOnline: true }
            : u
        )
      };
    });

  });
  socket.on("user_offline", (data) => {
    setSelectedChat((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        users: prev.users.map((u) => u._id === data.userIdb ? { 
                 ...u,
                isOnline: false,
                lastSeen: data.lastSeen
              }
            : u
        )
      };
    });

  });

  return () => {
    socket.off("user_online");
    socket.off("user_offline");
  };

}, []);


const otherUser = selectedChat?.users?.find( (u) => u._id !== user._id );

  
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className ="w-[30%] border-r p-4 overflow-y-auto">
        <p className ="text-green-800">welcome {user?.username}</p>
        <h2 className="text-xl font-bold mb-4">
          Chats
        </h2>

        {chats.map((chat) => (
          
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`border p-3 mb-2 rounded cursor-pointer ${selectedChat?._id === chat._id ? "bg-gray-200" : "" }`}
          >
            {!chat.isGroupChat ? chat.users.find(person=>person._id !== user._id)?.username : "unknown"}
          </div>
        ))}
      </div>

      

      {/* Chat Window */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Header */}
       <div className="border-b pb-3 mb-3">

        {
          selectedChat ? (
            <>
              <h2 className="font-bold text-lg">
                { selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.username }
              </h2>

              {
                !selectedChat.isGroupChat && (
                  <p className="text-sm text-gray-500">
                    {
                      otherUser?.isOnline ? "🟢 Online" : `last seen ${ otherUser?.lastSeen ? new Date(otherUser.lastSeen).toLocaleString(): "Unknown" }`
                    }
                  </p>
                )
              }

              {
                isTyping && (
                  <p className="text-sm text-blue-500 mt-1">
                    {typingUser} is typing...
                  </p>
                )
              }
            </>
          ) : (
            <h2 className="font-bold">
              Select a Chat
            </h2>
          )
        }

</div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" ref={messageContainerRef} onScroll={handleScroll}>
          {messages.filter((msg) => msg && msg._id)
            .map((message) => (
              <div
                key={message._id}
                className={`mb-2 flex ${message?.sender?._id ===
                  user?._id
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`p-2 rounded max-w-xs ${message?.sender?._id ===
                    user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                    }`}
                >

                  {message.content}
                </div>
              </div>
            ))}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={typingHandler}
              placeholder="Type a message..."
              className="border flex-1 p-2 rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />

            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;