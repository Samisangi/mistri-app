import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { io, Socket } from "socket.io-client";
import api from "@/lib/api";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    // Connect socket
    socketRef.current = io('http://localhost:5000');

    loadConversations();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (orderId && conversations.length > 0) {
      const conversation = conversations.find(c => c.orderId === orderId);
      if (conversation) selectConversation(conversation);
    }
  }, [orderId, conversations]);

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/orders/my');
      const convos = data.map((order: any) => ({
        orderId: order._id,
        order,
        otherUser: {
          name: user?.role === 'client' ? order.mistriId?.name : order.clientId?.name,
          role: user?.role === 'client' ? 'Mistri' : 'Client'
        }
      }));
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // const selectConversation = (conversation: any) => {
  //   setSelectedConversation(conversation);
  //   loadMessages(conversation.orderId);

  //   // Join socket room
  //   socketRef.current?.emit('join_room', conversation.orderId);

  //   // Listen for new messages
  //   socketRef.current?.off('receive_message');
  //   socketRef.current?.on('receive_message', (data: any) => {
  //     setMessages(prev => [...prev, data]);
  //   });
  // };
const selectConversation = (conversation: any) => {
  setSelectedConversation(conversation);
  loadMessages(conversation.orderId);

  socketRef.current?.emit('join_room', conversation.orderId);

  socketRef.current?.off('receive_message');
  socketRef.current?.on('receive_message', (data: any) => {
    // Only add if message is from someone else
    const senderId = data.senderId?._id || data.senderId;
    if (senderId !== user?.id) {
      setMessages(prev => [...prev, data]);
    }
  });
};
  const loadMessages = async (orderId: string) => {
    try {
      const { data } = await api.get(`/messages/${orderId}`);
      setMessages(data);
    } catch (error) {
      setMessages([]);
    }
  };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation || !user) return;

//     try {
//       const { data } = await api.post('/messages', {
//         orderId: selectedConversation.orderId,
//         receiverId: user.role === 'client'
//           ? selectedConversation.order.mistriId?._id
//           : selectedConversation.order.clientId?._id,
//         content: newMessage.trim()
//       });
// setMessages(prev => [...prev, data]);
//     setNewMessage('');
//       // Emit via socket for real-time
//       socketRef.current?.emit('send_message', {
//         ...data,
//         roomId: selectedConversation.orderId
//       });

//       setMessages(prev => [...prev, data]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };
const sendMessage = async () => {
  if (!newMessage.trim() || !selectedConversation || !user) return;

  try {
    const { data } = await api.post('/messages', {
      orderId: selectedConversation.orderId,
      receiverId: user.role === 'client'
        ? selectedConversation.order.mistriId?._id
        : selectedConversation.order.clientId?._id,
      content: newMessage.trim()
    });

    // Add message locally ONCE - don't rely on socket for own messages
    setMessages(prev => [...prev, data]);
    setNewMessage('');

    // Emit via socket ONLY for the other person to receive
    socketRef.current?.emit('send_message', {
      ...data,
      roomId: selectedConversation.orderId
    });

  } catch (error) {
    console.error('Error sending message:', error);
  }
};
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ height: '70vh' }}>
          {/* Conversations */}
          <Card className="overflow-hidden flex flex-col">
            <div className="p-4 border-b font-semibold">Conversations</div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.orderId}
                    onClick={() => selectConversation(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${selectedConversation?.orderId === conv.orderId ? 'bg-primary/10' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{conv.otherUser.name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{conv.otherUser.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{conv.order.gigId?.title || 'Service'}</p>
                        <Badge variant="outline" className="text-xs mt-1">{conv.order.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Chat */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedConversation.otherUser.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedConversation.otherUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedConversation.order.gigId?.title || 'Service'}</p>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
                  <div className="space-y-4">
                    {messages.map((msg, i) => {
                      const isOwn = msg.senderId === user?.id || msg.senderId?._id === user?.id;
                      return (
                        <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 border-t flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-semibold">Select a conversation</p>
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