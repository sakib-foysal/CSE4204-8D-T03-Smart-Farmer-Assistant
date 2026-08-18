import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Scan, MessageSquare, Trash2, Eye, Search, Video } from 'lucide-react';
import { api, ChatHistory, DiseaseHistory } from '../../lib/api';
import { useLocation, useNavigate } from '../../../router-shim';

function DiseaseImage({ item, className }: { item: DiseaseHistory; className: string }) {
  const incompleteImage = item.image_url.startsWith('data:image/') && item.image_url.length < 1000;
  const [failed, setFailed] = useState(incompleteImage);
  if (failed) return <div className={`${className} flex items-center justify-center bg-gray-100 p-2 text-center text-xs text-gray-500`}>Original image is unavailable for this older record.</div>;
  return <img src={item.image_url} alt={item.prediction} className={className} onError={() => setFailed(true)} />;
}

export default function HistoryPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { search } = useLocation();
  const navigate = useNavigate();
  const selectedTab = new URLSearchParams(search).get('tab') === 'chat' ? 'chat' : 'disease';
  const [diseaseHistory, setDiseaseHistory] = useState<DiseaseHistory[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseHistory | null>(null);
  const [diseaseSearch, setDiseaseSearch] = useState('');

  useEffect(() => {
    if (!token) return;

    Promise.all([api.diseaseHistory(token), api.chatHistory(token)])
      .then(([disease, chats]) => {
        setDiseaseHistory(disease);
        setChatHistory(chats);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filteredDiseaseHistory = useMemo(() => {
    const query = diseaseSearch.toLowerCase().trim();
    return query ? diseaseHistory.filter((item) => item.prediction.toLowerCase().includes(query)) : diseaseHistory;
  }, [diseaseHistory, diseaseSearch]);

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('history')}</h1>
            <p className="text-gray-600">{t('historyTrackingDesc')}</p>
          </div>

          <Tabs value={selectedTab} onValueChange={(tab) => navigate(`/history?tab=${tab}`)} className="space-y-6">
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
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle>{t('diseaseHistory')}</CardTitle><CardDescription>{t('diseaseHistoryDescription')}</CardDescription></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><Input value={diseaseSearch} onChange={(event) => setDiseaseSearch(event.target.value)} placeholder="Search disease name..." className="pl-10" /></div></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-gray-500">{t('loadingDiseaseHistory')}</p>
                    ) : filteredDiseaseHistory.length > 0 ? filteredDiseaseHistory.map((item) => (
                      <div key={item.id} className="flex flex-col gap-4 p-4 border rounded-lg hover:bg-gray-50 sm:flex-row">
                        {item.image_url.startsWith('video:') ? (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-100"><Video className="size-6 text-green-700" /></div>
                        ) : (
                          <DiseaseImage item={item} className="h-24 w-24 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.prediction}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {Number(item.confidence)}% {t('confidence')}
                            </Badge>
                            <span className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</span>
                          </div>
                          <div className="mt-3 rounded-md bg-yellow-50 p-3 text-sm text-gray-700"><p className="mb-1 font-medium text-gray-900">{t('treatment')}</p><p className="whitespace-pre-wrap">{item.treatment}</p></div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedDisease(item)} aria-label={t('viewDetails')}>
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
      <Dialog open={Boolean(selectedDisease)} onOpenChange={(open) => !open && setSelectedDisease(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedDisease && <><DialogHeader><DialogTitle>{t('diseaseResult')}: {selectedDisease.prediction}</DialogTitle><DialogDescription>{new Date(selectedDisease.date).toLocaleString()}</DialogDescription></DialogHeader>{selectedDisease.image_url.startsWith('video:') ? <div className="flex h-64 items-center justify-center rounded-lg bg-green-100"><Video className="size-16 text-green-700" /></div> : <DiseaseImage item={selectedDisease} className="max-h-[55vh] w-full rounded-lg object-contain" />}<div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-green-50 p-3"><p className="text-xs text-gray-600">{t('cropName')}</p><p className="font-semibold">{selectedDisease.crop_name || 'Not available for older records'}</p></div><div className="rounded-lg bg-blue-50 p-3"><p className="text-xs text-gray-600">{t('confidence')}</p><p className="font-semibold">{Number(selectedDisease.confidence)}%</p></div></div><div className="rounded-lg bg-yellow-50 p-4"><p className="mb-2 font-semibold">{t('treatment')}</p><p className="whitespace-pre-wrap text-sm text-gray-700">{selectedDisease.treatment}</p></div><div className="rounded-lg bg-gray-50 p-4"><p className="mb-2 font-semibold">AI analysis note</p><p className="text-sm text-gray-700">{selectedDisease.disclaimer || 'Not available for older records.'}</p></div><div className="rounded-lg bg-green-50 p-4"><p className="mb-2 font-semibold">{t('fertilizer')} {t('recommendations')}</p>{selectedDisease.fertilizer_recommendations.length ? selectedDisease.fertilizer_recommendations.map((recommendation, index) => <p key={index} className="mb-2 whitespace-pre-wrap text-sm text-gray-700">{recommendation}</p>) : <p className="text-sm text-gray-600">No linked fertilizer recommendation for this assessment.</p>}</div></>}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
