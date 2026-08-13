import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Scan, MessageSquare, Trash2, Eye } from 'lucide-react';
import { api, ChatHistory, DiseaseHistory } from '../../lib/api';

export default function HistoryPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [diseaseHistory, setDiseaseHistory] = useState<DiseaseHistory[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    Promise.all([api.diseaseHistory(token), api.chatHistory(token)])
      .then(([disease, chats]) => {
        setDiseaseHistory(disease);
        setChatHistory(chats);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('history')}</h1>
            <p className="text-gray-600">{t('historyTrackingDesc')}</p>
          </div>

          <Tabs defaultValue="disease" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="disease" className="flex items-center gap-2">
                <Scan className="size-4" />
                {t('diseaseHistory')}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                {t('chatHistoryTitle')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disease">
              <Card>
                <CardHeader>
                  <CardTitle>{t('diseaseHistory')}</CardTitle>
                  <CardDescription>{t('diseaseHistoryDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-gray-500">{t('loadingDiseaseHistory')}</p>
                    ) : diseaseHistory.length > 0 ? diseaseHistory.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=100&h=100&fit=crop'}
                          alt={item.prediction}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.prediction}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {Number(item.confidence)}% {t('confidence')}
                            </Badge>
                            <span className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" disabled>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500">{t('noDiseaseHistory')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>{t('chatHistoryTitle')}</CardTitle>
                  <CardDescription>{t('chatHistoryDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <p className="text-gray-500">{t('loadingChatHistory')}</p>
                    ) : chatHistory.length > 0 ? chatHistory.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="bg-green-100 p-2 rounded-full">
                          <MessageSquare className="size-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.question}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.response}</p>
                          <p className="text-sm text-gray-500 mt-1">{new Date(item.date).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" disabled>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500">{t('noChatHistory')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
