// frontend/src/pages/projects/workspace/ChatTab.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardBody } from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';
import { Send } from 'lucide-react';

export default function ChatTab({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
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
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [projectId]);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // If we are within 50px of the bottom, enable auto-scroll
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const optimisticMsg = {
      message_id: Date.now(),
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
    <Card className="flex flex-col h-[600px]">
      <CardBody className="flex-1 flex flex-col p-0 overflow-hidden">
        
        {/* Messages List */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No messages yet. Say hello to the team!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender_id === user.user_id;
              
              // Group messages by time/date logic can be added here if needed
              // For now we just render bubbles
              
              return (
                <div key={msg.message_id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[75%] ${isMine ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
                    
                    {!isMine && (
                      <div className="flex-shrink-0">
                        {msg.profile_image ? (
                          <img src={`/api/users/${msg.sender_id}/image`} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Avatar fallback={msg.sender_name} size="sm" className="w-8 h-8 text-[10px]" />
                        )}
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && <span className="text-xs text-slate-500 mb-1 ml-1">{msg.sender_name}</span>}
                      
                      <div className={`
                        px-4 py-2 rounded-2xl text-sm 
                        ${isMine 
                          ? 'bg-indigo-600 text-white rounded-br-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'}
                      `}>
                        {msg.message}
                      </div>
                      
                      <span className="text-[10px] text-slate-400 mt-1">
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full"
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="rounded-full px-4 shrink-0">
              <Send size={18} />
            </Button>
          </form>
        </div>

      </CardBody>
    </Card>
  );
}
