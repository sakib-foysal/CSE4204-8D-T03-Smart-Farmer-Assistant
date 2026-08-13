import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Scan, MessageSquare, Cloud, TrendingUp, Droplets, Clock, Activity } from 'lucide-react';
import { api, ChatHistory, DiseaseHistory, FertilizerRecommendation } from '../../lib/api';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [diseaseHistory, setDiseaseHistory] = useState<DiseaseHistory[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [fertilizerHistory, setFertilizerHistory] = useState<FertilizerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      api.diseaseHistory(token),
      api.chatHistory(token),
      api.fertilizerRecommendations(token),
    ])
      .then(([disease, chats, fertilizers]) => {
        setDiseaseHistory(disease);
        setChatHistory(chats);
        setFertilizerHistory(fertilizers);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const stats = [
    { label: t('diseaseDetection'), value: loading ? '...' : String(diseaseHistory.length), icon: <Scan className="size-5" />, color: 'text-blue-600' },
    { label: t('aiChatbot'), value: loading ? '...' : String(chatHistory.length), icon: <MessageSquare className="size-5" />, color: 'text-green-600' },
    { label: t('fertilizer'), value: loading ? '...' : String(fertilizerHistory.length), icon: <Droplets className="size-5" />, color: 'text-purple-600' },
  ];

  const quickActions = [
    {
      title: t('diseaseDetection'),
      description: t('aiDiseaseDesc'),
      icon: <Scan className="size-8 text-green-600" />,
      path: '/disease-detection',
    },
    {
      title: t('aiChatbot'),
      description: t('smartChatbotDesc'),
      icon: <MessageSquare className="size-8 text-green-600" />,
      path: '/chatbot',
    },
    {
      title: t('weather'),
      description: t('weatherAlertsDesc'),
      icon: <Cloud className="size-8 text-green-600" />,
      path: '/weather',
    },
    {
      title: t('marketPrices'),
      description: t('livePricesDesc'),
      icon: <TrendingUp className="size-8 text-green-600" />,
      path: '/market-prices',
    },
    {
      title: t('fertilizer'),
      description: t('fertilizerGuideDesc'),
      icon: <Droplets className="size-8 text-green-600" />,
      path: '/fertilizer',
    },
    {
      title: t('history'),
      description: t('historyTrackingDesc'),
      icon: <Clock className="size-8 text-green-600" />,
      path: '/history',
    },
  ];

  const recentActivity = useMemo(() => {
    const activities = [
      ...diseaseHistory.map((item) => ({
        text: `${t('diseaseDetection')}: ${item.prediction}`,
        time: new Date(item.date).toLocaleString(),
        date: item.date,
      })),
      ...chatHistory.map((item) => ({
        text: `${t('aiChatbot')}: ${item.question}`,
        time: new Date(item.date).toLocaleString(),
        date: item.date,
      })),
      ...fertilizerHistory.map((item) => ({
        text: `${t('recommendations')}: ${item.crop_name}`,
        time: new Date(item.date).toLocaleString(),
        date: item.date,
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [chatHistory, diseaseHistory, fertilizerHistory, t]);

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome')}, {user?.first_name || user?.username || t('farmer')}!
          </h1>
          <p className="text-gray-600">{t('dashboard')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions')}</CardTitle>
                <CardDescription>{t('accessFeatures')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
                    >
                      <div>{action.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  {t('recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">{t('noActivity')}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate('/history')}
                >
                  {t('viewDetails')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
