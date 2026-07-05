import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { api } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const greeting: Message = {
  role: 'assistant',
  content: 'Hello! I am your Smart Farmer Assistant. Ask me anything about farming, crops, fertilizers, or pest control.',
};

export default function ChatbotPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!token) return;

    api.chatHistory(token)
      .then((history) => {
        if (!history.length) return;
        const loaded = history
          .slice()
          .reverse()
          .flatMap((item) => [
            { role: 'user' as const, content: item.question },
            { role: 'assistant' as const, content: item.response },
          ]);
        setMessages([greeting, ...loaded]);
      })
      .catch(() => {});
  }, [token]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const responses = [
      'For rice cultivation, apply urea fertilizer in three split doses: planting, tillering, and flowering stage.',
      'To control tomato blight, use copper-based fungicides and maintain proper plant spacing for air circulation.',
      'The best time to plant wheat in Bangladesh is November to December. Keep soil moisture balanced.',
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    try {
      if (token) {
        await api.createChatHistory(token, {
          question: userMessage.content,
          response: randomResponse,
        });
      }
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('aiChatbot')}</h1>
            <p className="text-gray-600">{t('smartChatbotDesc')}</p>
          </div>

          <Card className="h-[calc(100vh-20rem)] min-h-[32rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-6 text-green-600" />
                {t('smartChatbot')}
              </CardTitle>
              <CardDescription>Ask your farming questions in Bangla or English</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-8rem)]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {message.role === 'user' ? <User className="size-4 text-white" /> : <Bot className="size-4 text-white" />}
                    </div>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('askQuestion')}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isTyping} className="bg-green-600 hover:bg-green-700">
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
