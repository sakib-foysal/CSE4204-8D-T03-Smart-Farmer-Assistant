import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AlertTriangle, Bot, Send, User } from 'lucide-react';
import { api } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const greeting: Message = { role: 'assistant', content: t('greeting') };
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    api.chatHistory(token)
      .then((history) => {
        if (!history.length) return;
        const loaded = history.slice().reverse().flatMap((item) => [
          { role: 'user' as const, content: item.question },
          { role: 'assistant' as const, content: item.response },
        ]);
        setMessages([greeting, ...loaded]);
      })
      .catch(() => {});
  }, [token, language]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const question = inputText.trim();
    if (!question || isTyping) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages((previous) => [...previous, userMessage]);
    setInputText('');
    setServiceError('');
    setIsTyping(true);

    try {
      if (!token) throw new Error(t('loginAgain'));
      const result = await api.askSFAI(token, question);
      const answer = result.response?.trim();
      if (!answer) throw new Error(t('aiEmpty'));
      setMessages((previous) => [...previous, { role: 'assistant', content: answer }]);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : t('aiUnavailable'));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('aiChatbot')}</h1>
            <p className="text-gray-600">{t('smartChatbotDesc')}</p>
          </div>

          <Card className="h-[calc(100dvh-14rem)] min-h-[30rem] max-h-[48rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="size-6 text-green-600" />{t('smartChatbot')}</CardTitle>
              <CardDescription>{t('chatbotLiveDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-8rem)] min-h-0 flex-col">
              {serviceError && (
                <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>{serviceError}</span>
                </div>
              )}
              <div className="mb-4 min-h-0 flex-1 space-y-4 overflow-y-auto scroll-smooth pr-1">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${message.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                      {message.role === 'user' ? <User className="size-4 text-white" /> : <Bot className="size-4 text-white" />}
                    </div>
                    <div className={`max-w-[70%] rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && <div className="flex gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-green-600"><Bot className="size-4 text-white" /></div><div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">{t('aiPreparing')}</div></div>}
                <div ref={messageEndRef} />
              </div>
              <div className="flex gap-2">
                <Input value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSend()} placeholder={t('askQuestion')} className="flex-1" maxLength={1200} />
                <Button onClick={handleSend} disabled={isTyping || !inputText.trim()} className="bg-green-600 hover:bg-green-700" aria-label={t('sendMessage')}><Send className="size-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
