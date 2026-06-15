import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Paperclip } from "lucide-react";

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: number;
  attachment?: {
    name: string;
    data: string;
    type: string;
  };
}

interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  gigImage: string;
  clientId: string;
  clientName: string;
  mistriId: string;
  mistriName: string;
  packageType: string;
  price: number;
  status: string;
}

interface Conversation {
  orderId: string;
  order: Order;
  lastMessage?: Message;
  unreadCount: number;
  otherUser: {
    name: string;
    role: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldScrollRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadConversations();
  }, [user, navigate]);

  useEffect(() => {
    if (orderId && conversations.length > 0) {
      const conversation = conversations.find(c => c.orderId === orderId);
      if (conversation) {
        selectConversation(conversation);
      }
    }
  }, [orderId, conversations]);

  useEffect(() => {
    if (shouldScrollRef.current && messagesContainerRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
      shouldScrollRef.current = false;
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const loadConversations = () => {
    const ordersData = localStorage.getItem("orders");
    const messagesData = localStorage.getItem("messages");
    
    if (!ordersData || !user) return;

    const orders: Order[] = JSON.parse(ordersData);
    const allMessages: Message[] = messagesData ? JSON.parse(messagesData) : [];

    // Filter orders where user is involved
    const userOrders = orders.filter(
      order => order.clientId === user.id || order.mistriId === user.id
    );

    const convos: Conversation[] = userOrders.map(order => {
      const orderMessages = allMessages.filter(m => m.orderId === order.id);
      const lastMessage = orderMessages.sort((a, b) => b.timestamp - a.timestamp)[0];
      
      // Count unread messages (messages from the other user)
      const unreadCount = orderMessages.filter(
        m => m.senderId !== user.id && m.timestamp > (order.lastReadTimestamp || 0)
      ).length;

      const otherUser = {
        name: user.id === order.clientId ? order.mistriName : order.clientName,
        role: user.id === order.clientId ? "Mistri" : "Client"
      };

      return {
        orderId: order.id,
        order,
        lastMessage,
        unreadCount,
        otherUser
      };
    });

    // Sort by last message timestamp
    convos.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || 0;
      const bTime = b.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });

    setConversations(convos);
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.orderId);
    markAsRead(conversation.orderId);
    // Enable auto-scroll when selecting a conversation
    shouldScrollRef.current = true;
  };

  const loadMessages = (orderId: string) => {
    const messagesData = localStorage.getItem("messages");
    if (!messagesData) {
      setMessages([]);
      return;
    }

    const allMessages: Message[] = JSON.parse(messagesData);
    const orderMessages = allMessages.filter(m => m.orderId === orderId);
    orderMessages.sort((a, b) => a.timestamp - b.timestamp);
    setMessages(orderMessages);
  };

  const markAsRead = (orderId: string) => {
    const ordersData = localStorage.getItem("orders");
    if (!ordersData) return;

    const orders: Order[] = JSON.parse(ordersData);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        lastReadTimestamp: Date.now()
      };
      localStorage.setItem("orders", JSON.stringify(orders));
      loadConversations();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setAttachmentFile(file);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !attachmentFile) || !selectedConversation || !user) return;

    let attachment;
    if (attachmentFile) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(attachmentFile);
      });
      const base64Data = await base64Promise;

      attachment = {
        name: attachmentFile.name,
        data: base64Data,
        type: attachmentFile.type
      };
    }

    const message: Message = {
      id: Date.now().toString(),
      orderId: selectedConversation.orderId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: newMessage.trim(),
      timestamp: Date.now(),
      ...(attachment && { attachment })
    };

    const messagesData = localStorage.getItem("messages");
    const allMessages: Message[] = messagesData ? JSON.parse(messagesData) : [];
    allMessages.push(message);
    localStorage.setItem("messages", JSON.stringify(allMessages));

    setMessages([...messages, message]);
    setNewMessage("");
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Enable auto-scroll when sending a new message
    shouldScrollRef.current = true;
    loadConversations();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    }
  };

  const downloadAttachment = (attachment: Message["attachment"]) => {
    if (!attachment) return;
    
    const link = document.createElement("a");
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 h-[calc(100vh-4rem)]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with your {user.role === "Client" ? "Mistris" : "Clients"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ height: 'calc(100% - 6rem)' }}>
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b flex-shrink-0 bg-white">
              <h2 className="font-semibold text-lg">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Messages will appear here when you place or receive orders</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.orderId}
                      onClick={() => selectConversation(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.orderId === conversation.orderId ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.order.gigImage} />
                          <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm truncate">{conversation.otherUser.name}</p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 truncate">{conversation.order.gigTitle}</p>
                          
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.senderId === user.id ? "You: " : ""}
                              {conversation.lastMessage.attachment ? "📎 Attachment" : conversation.lastMessage.content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{conversation.order.status}</Badge>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-400">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col h-full overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Avatar>
                      <AvatarImage src={selectedConversation.order.gigImage} />
                      <AvatarFallback>{selectedConversation.otherUser.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-semibold">{selectedConversation.otherUser.name}</p>
                      <p className="text-sm text-gray-500">{selectedConversation.order.gigTitle}</p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/orders?tab=active`)}
                    >
                      View Order
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 p-4 bg-gray-50" 
                  style={{ overflowY: 'auto', maxHeight: '100%' }}
                >
                  <div className="space-y-4 pb-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwnMessage = message.senderId === user.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isOwnMessage
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                {message.content && <p className="text-sm">{message.content}</p>}
                                
                                {message.attachment && (
                                  <div className="mt-2 pt-2 border-t border-gray-200/20">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => downloadAttachment(message.attachment)}
                                      className={`text-xs ${isOwnMessage ? "text-white hover:bg-blue-700" : ""}`}
                                    >
                                      <Paperclip className="h-3 w-3 mr-1" />
                                      {message.attachment.name}
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white flex-shrink-0">
                  {attachmentFile && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{attachmentFile.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAttachmentFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    />
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    
                    <Button onClick={sendMessage} disabled={!newMessage.trim() && !attachmentFile}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-semibold">Select a conversation</p>
                  <p className="text-sm mt-2">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
