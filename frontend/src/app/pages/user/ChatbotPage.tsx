import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
<<<<<<< HEAD
import { Send, Bot, User } from 'lucide-react';
=======
import { AlertTriangle, Bot, Send, User } from 'lucide-react';
>>>>>>> ai-integration
import { api } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const greeting: Message = {
  role: 'assistant',
<<<<<<< HEAD
  content: 'Hello! I am your Smart Farmer Assistant. Ask me anything about farming, crops, fertilizers, or pest control.',
};

function buildAssistantResponse(question: string) {
  const normalized = question.toLowerCase();

  if (/ধান|rice|paddy/.test(normalized)) {
    return 'ধানের জন্য জমির পানি, সার, আর পোকা নিয়ন্ত্রণ একসাথে দেখুন। ইউরিয়া ৩ কিস্তিতে দিন, আর পাতা হলুদ হলে মাটি ও সারের ভারসাম্য পরীক্ষা করুন।';
  }

  if (/tomato|blight|leaf|পাতা|টমেটো/.test(normalized)) {
    return 'টমেটো ব্লাইট হলে আক্রান্ত পাতা সরিয়ে ফেলুন, গাছের মাঝে যথেষ্ট ফাঁকা রাখুন, এবং ভোরে বা সন্ধ্যায় কপার-ভিত্তিক ফাঙ্গিসাইড ব্যবহার করুন।';
  }

  if (/fertilizer|fertiliser|সার|urea|tsp|mop|npk/.test(normalized)) {
    return 'সারের আগে মাটি পরীক্ষা করুন। সাধারণভাবে ইউরিয়া ৩ ভাগে, TSP বপনের সময়, আর MOP দুই ভাগে দিলে পুষ্টির ক্ষয় কমে।';
  }

  if (/weather|rain|flood|storm|বৃষ্টি|বন্যা|আবহাওয়া/.test(normalized)) {
    return 'আবহাওয়া বা বন্যার ঝুঁকি থাকলে সেচ কমান, নালা পরিষ্কার রাখুন, এবং খোলা মাঠের কাজ পরিকল্পনা করার আগে weather page দেখুন।';
  }

  if (/pest|insect|bug|aphid|mites|পোকা/.test(normalized)) {
    return 'পোকা দমনে প্রথমে আক্রান্ত অংশ কমান, আগাছা পরিষ্কার রাখুন, আর সম্ভব হলে জৈব নিয়ন্ত্রণ বা নিম-ভিত্তিক স্প্রে ব্যবহার করুন।';
  }

  if (/hello|hi|hey|হ্যালো|হাই|সালাম|assalam/.test(normalized)) {
    return 'Hello! Tell me the crop name, symptom, fertilizer need, or weather concern, and I will suggest the next step.';
  }

  return 'I can help with crop disease symptoms, fertilizer guidance, weather risk, and pest control. Mention the crop and the problem you are seeing.';
}

=======
  content: 'Hello! I am your Smart Farmer Assistant. Ask in Bangla or English about crops, pests, fertilizer, irrigation, or weather preparation.',
};

>>>>>>> ai-integration
export default function ChatbotPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
<<<<<<< HEAD

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
=======
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    if (!token) return;
    api.chatHistory(token)
      .then((history) => {
        if (!history.length) return;
        const loaded = history.slice().reverse().flatMap((item) => [
          { role: 'user' as const, content: item.question },
          { role: 'assistant' as const, content: item.response },
        ]);
>>>>>>> ai-integration
        setMessages([greeting, ...loaded]);
      })
      .catch(() => {});
  }, [token]);

  const handleSend = async () => {
<<<<<<< HEAD
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', content: inputText };
    const assistantResponse = buildAssistantResponse(inputText.trim());

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      if (token) {
        await api.createChatHistory(token, {
          question: userMessage.content,
          response: assistantResponse,
        });
      }
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
=======
    const question = inputText.trim();
    if (!question || isTyping) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages((previous) => [...previous, userMessage]);
    setInputText('');
    setServiceError('');
    setIsTyping(true);

    try {
      if (!token) throw new Error('Please log in again to use the AI assistant.');
      const result = await api.askSFAI(token, question);
      const answer = result.response?.trim();
      if (!answer) throw new Error('The AI returned an empty response. Please try again.');
      setMessages((previous) => [...previous, { role: 'assistant', content: answer }]);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'AI service is temporarily unavailable. Please try again.');
>>>>>>> ai-integration
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('aiChatbot')}</h1>
=======
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('aiChatbot')}</h1>
>>>>>>> ai-integration
            <p className="text-gray-600">{t('smartChatbotDesc')}</p>
          </div>

          <Card className="h-[calc(100vh-20rem)] min-h-[32rem]">
            <CardHeader>
<<<<<<< HEAD
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
=======
              <CardTitle className="flex items-center gap-2"><Bot className="size-6 text-green-600" />{t('smartChatbot')}</CardTitle>
              <CardDescription>Live SF AI farming guidance in Bangla or English</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-8rem)] flex-col">
              {serviceError && (
                <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>{serviceError}</span>
                </div>
              )}
              <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
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
                {isTyping && <div className="flex gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-green-600"><Bot className="size-4 text-white" /></div><div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">SF AI is preparing advice...</div></div>}
              </div>
              <div className="flex gap-2">
                <Input value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSend()} placeholder={t('askQuestion')} className="flex-1" maxLength={1200} />
                <Button onClick={handleSend} disabled={isTyping || !inputText.trim()} className="bg-green-600 hover:bg-green-700" aria-label="Send question"><Send className="size-4" /></Button>
>>>>>>> ai-integration
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
