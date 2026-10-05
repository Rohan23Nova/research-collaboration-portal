// frontend/src/pages/projects/workspace/ChatTab.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardBody } from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';
import Skeleton from '../../../components/ui/Skeleton';
import { MessageSquare, Send } from 'lucide-react';

export default function ChatTab({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Track if user is explicitly scrolling up so we don't auto-scroll and annoy them
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/workspace/messages`);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    // Optimistic UI
    const optimisticMsg = {
      message_id: `temp-${Date.now()}`,
      sender_id: user.user_id,
      sender_name: user.name,
      profile_image: user.profile_image,
      message: newMessage,
      sent_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');
    setAutoScroll(true);
    setSending(true);

    try {
      await api.post(`/projects/${projectId}/workspace/messages`, { message: optimisticMsg.message });
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message');
      fetchMessages(); // revert optimistic
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-border-muted rounded-xl bg-surface-muted overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-background border-b border-border-muted dark:border-[#3D3934] p-4 shrink-0 flex items-center gap-3">
        <div className="p-2 bg-primary-soft dark:bg-[#6E4634]/40 text-primary rounded-lg">
          <MessageSquare size={20} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Project Chat</h3>
          <p className="text-xs text-foreground-muted">Communicate with your team in real-time.</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-4" 
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {initialLoading ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="h-16 w-3/4 rounded-xl ml-auto" />
            <Skeleton className="h-16 w-3/4 rounded-xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-3 bg-primary-soft dark:bg-[#6E4634]/40 text-primary rounded-full mb-3">
              <MessageSquare size={28} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-foreground">No messages yet</p>
            <p className="text-xs text-foreground-muted mt-1 max-w-xs">Start the conversation with your fellow researchers below.</p>
          </div>
        ) : (
          <>
            {messages.map(msg => {
              const isMine = msg.sender_id === user.user_id;
              return (
                <div key={msg.message_id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {!isMine && (
                      <div className="shrink-0 pt-1">
                        <Avatar name={msg.sender_name} src={msg.profile_image} size="sm" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && <span className="text-xs text-foreground-muted mb-1 ml-1">{msg.sender_name}</span>}
                      
                      <div 
                        className={`px-4 py-2 rounded-2xl ${
                          isMine 
                            ? 'bg-primary text-surface dark:text-[#F4EFE6] rounded-tr-none' 
                            : 'bg-surface dark:bg-[#292622] text-foreground dark:text-[#F4EFE6] border border-border-muted dark:border-[#3D3934] rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      
                      <span className="text-[10px] text-foreground-muted mt-1 mx-1">
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-background border-t border-border-muted dark:border-[#3D3934] p-3 sm:p-4 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1">
            <Input 
              placeholder="Type a message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-full"
              aria-label="Chat message input"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || sending} 
            className="rounded-full h-9 w-9 p-0 flex items-center justify-center shrink-0 shadow-sm"
            aria-label="Send message"
          >
            <Send size={15} className={newMessage.trim() ? "ml-0.5" : ""} aria-hidden="true" />
          </Button>
        </form>
      </div>

    </div>
  );
}
