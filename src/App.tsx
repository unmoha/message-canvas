import { useState, useEffect } from "react";
import { 
  Search, 
  Settings, 
  Plus, 
  MessageSquare, 
  Users, 
  Radio, 
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Menu,
  Phone,
  Video,
  Info,
  ArrowLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/use-store";
import { useSocket } from "@/hooks/use-socket";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function App() {
  const { user, setUser, chats, activeChat, setActiveChat, messages, onlineUsers, typingUsers } = useStore();
  const { sendMessage, sendTyping } = useSocket();
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock initial data if not logged in
  useEffect(() => {
    if (!user) {
      setUser({
        id: "1",
        username: "Alex",
        avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c775f874-01a5-4840-9d6c-01f037bbdea3/user-avatar-1-7f9e45e8-1776066812066.webp",
        status: "online",
        bio: "Senior Engineer"
      });
      
      const mockChats = [
        {
          id: "c1",
          type: "private",
          name: "Sarah Miller",
          avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c775f874-01a5-4840-9d6c-01f037bbdea3/user-avatar-2-8a20378a-1776066811807.webp",
          lastMessage: { content: "Hey, did you finish the architecture doc?", timestamp: new Date().toISOString() },
          unreadCount: 2
        },
        {
          id: "c2",
          type: "group",
          name: "Dev Team",
          avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c775f874-01a5-4840-9d6c-01f037bbdea3/group-avatar-1-eed32bf2-1776066812441.webp",
          lastMessage: { content: "John: Deploying to staging now...", timestamp: new Date().toISOString() },
          unreadCount: 0
        }
      ];
      // @ts-ignore
      useStore.getState().setChats(mockChats);
    }
  }, [user, setUser]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeChat) return;
    sendMessage(activeChat.id, inputValue);
    // Mock local update for UI
    const newMessage = {
      id: Math.random().toString(),
      senderId: user?.id || "1",
      content: inputValue,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };
    // @ts-ignore
    useStore.getState().addMessage(activeChat.id, newMessage);
    setInputValue("");
    sendTyping(activeChat.id, false);
  };

  const currentMessages = activeChat ? (messages[activeChat.id] || []) : [];
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? (window.innerWidth < 768 ? "100%" : "380px") : "0%" }}
        className={`relative border-r border-border flex flex-col bg-card/50 backdrop-blur-xl z-20 ${!isSidebarOpen && "hidden md:flex"}`}
      >
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 text-muted-foreground cursor-pointer md:hidden" onClick={() => setIsSidebarOpen(false)} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Telegram</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Group</DropdownMenuItem>
                <DropdownMenuItem>New Channel</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-10 bg-muted/50 border-none rounded-2xl h-11 focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 px-4 mb-2">
          <Button variant="ghost" size="sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">All</Button>
          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Personal</Button>
          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Groups</Button>
          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Unread</Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-muted/50 ${activeChat?.id === chat.id ? 'bg-primary/10' : ''}`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="text-lg">{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(chat.id) && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {chat.lastMessage ? format(new Date(chat.lastMessage.timestamp), "HH:mm") : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate leading-tight">
                      {typingUsers[chat.id]?.length ? (
                        <span className="text-primary italic animate-pulse">typing...</span>
                      ) : chat.lastMessage?.content}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </motion.aside>

      {/* Chat Area */}
      <main className={`flex-1 flex flex-col relative bg-[url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/c775f874-01a5-4840-9d6c-01f037bbdea3/app-bg-07537ee7-1776066811848.webp')] bg-cover bg-center ${!activeChat && "hidden md:flex"}`}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="relative z-10 p-4 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2 rounded-full" 
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="w-11 h-11 shadow-sm">
                    <AvatarImage src={activeChat.avatar} />
                    <AvatarFallback>{activeChat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <div>
                  <h2 className="font-bold text-base leading-tight">{activeChat.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {typingUsers[activeChat.id]?.length 
                      ? `${typingUsers[activeChat.id].join(", ")} is typing...`
                      : "online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Video className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Search className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Info className="w-5 h-5" /></Button>
              </div>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1 relative z-10 px-4">
              <div className="py-6 space-y-4 max-w-4xl mx-auto">
                {currentMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 opacity-40">
                    <MessageSquare className="w-12 h-12 mb-2" />
                    <p className="text-sm">No messages yet. Say hi!</p>
                  </div>
                )}
                {currentMessages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`group relative max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.senderId === user?.id 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-card text-foreground rounded-tl-none border border-border'
                    }`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span>{format(new Date(msg.timestamp), "HH:mm")}</span>
                        {msg.senderId === user?.id && (
                          msg.status === 'seen' ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />
                        )}
                      </div>
                      
                      {/* Reactions Menu (simplified) */}
                      <div className="absolute -bottom-3 left-0 right-0 hidden group-hover:flex justify-center transition-all">
                        <div className="bg-background/95 backdrop-blur border border-border rounded-full px-2 py-1 shadow-lg flex gap-2 scale-75">
                          <span className="cursor-pointer hover:scale-125 transition">❤️</span>
                          <span className="cursor-pointer hover:scale-125 transition">👍</span>
                          <span className="cursor-pointer hover:scale-125 transition">🔥</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <footer className="relative z-10 p-4 pt-2">
              <div className="max-w-4xl mx-auto flex items-end gap-2 bg-card/60 backdrop-blur-md p-2 rounded-[28px] border border-border shadow-lg">
                <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 shrink-0 text-muted-foreground hover:text-primary">
                  <Paperclip className="w-6 h-6" />
                </Button>
                <div className="flex-1 relative">
                  <Input 
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      sendTyping(activeChat.id, e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Message" 
                    className="border-none bg-transparent focus-visible:ring-0 text-[15px] h-11 px-0"
                  />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 shrink-0 text-muted-foreground hover:text-primary">
                  <Smile className="w-6 h-6" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </footer>
          </>
        ) : (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Select a chat to start messaging</h2>
            <p className="text-muted-foreground max-w-[280px]">Choose from your existing conversations or start a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
}