import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
  timestamp: string;
  language: string;
}

// Use frontend proxy instead of direct API calls
const CHATBOT_PROXY_URL = '/api/chatbot';

export const useChatbot = (language: string = 'en-US') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session_${Date.now()}`);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(CHATBOT_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'chat',
          data: {
            message,
            session_id: sessionId,
            language,
            history: messages.slice(-5) // Last 5 messages for context
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // Add bot response
      const botMessage: ChatMessage = {
        role: 'bot',
        content: data.response,
        timestamp: data.timestamp
      };
      setMessages(prev => [...prev, botMessage]);
      setSessionId(data.session_id);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'bot',
        content: language === 'hi-IN' 
          ? 'क्षमा करें, मुझे जवाब देने में परेशानी हो रही है। कृपया पुनः प्रयास करें।'
          : 'Sorry, I\'m having trouble responding. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [language, sessionId, messages]);

  const getQuickHelp = useCallback(async (category: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${CHATBOT_PROXY_URL}?endpoint=quick-help&category=${category}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Add quick help response
      const botMessage: ChatMessage = {
        role: 'bot',
        content: data.response,
        timestamp: data.timestamp
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Quick help error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetChat = useCallback(async () => {
    try {
      await fetch(`${CHATBOT_PROXY_URL}?endpoint=chat/reset&session_id=${sessionId}`, {
        method: 'POST',
      });
      
      setMessages([]);
      setSessionId(`session_${Date.now()}`);
    } catch (error) {
      console.error('Reset error:', error);
    }
  }, [sessionId]);

  return {
    messages,
    isLoading,
    sendMessage,
    getQuickHelp,
    resetChat
  };
};
