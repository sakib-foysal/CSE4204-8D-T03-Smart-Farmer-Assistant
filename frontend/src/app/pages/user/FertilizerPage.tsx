import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Droplets, Search } from 'lucide-react';
import { api, FertilizerRecommendation } from '../../lib/api';

export default function FertilizerPage() {
  const { t } = useLanguage(); const { token } = useAuth();
  const [history, setHistory] = useState<FertilizerRecommendation[]>([]); const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => { if (token) api.fertilizerRecommendations(token).then(setHistory).catch(() => {}); }, [token]);
  const filteredHistory = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return history;
    return history.filter((item) => item.crop_name.toLowerCase().includes(query) || new Date(item.date).toLocaleDateString().toLowerCase().includes(query) || item.date.toLowerCase().includes(query));
  }, [history, searchTerm]);

  return <PageLayout className="bg-gray-50"><div className="container mx-auto px-4 py-8"><div className="mx-auto max-w-4xl"><div className="mb-8"><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('fertilizer')}</h1><p className="text-gray-600">{t('fertilizerIntro')}</p></div><Card><CardHeader><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle>Previous Fertilizer Recommendations</CardTitle><CardDescription>Recommendations generated from your crop disease assessments.</CardDescription></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search crop name or date..." className="pl-10" /></div></div></CardHeader><CardContent><div className="space-y-3">{filteredHistory.length ? filteredHistory.map((item) => <div key={item.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold text-gray-900">{item.crop_name}</p><p className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</p></div><p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{item.suggestion}</p></div>) : <div className="py-12 text-center text-gray-500"><Droplets className="mx-auto mb-3 size-12 opacity-20" /><p>{t('noRecommendation')}</p></div>}</div></CardContent></Card></div></div></PageLayout>;
}
