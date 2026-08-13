<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useState } from 'react';
>>>>>>> ai-integration
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
<<<<<<< HEAD
import { Droplets, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api, FertilizerRecommendation } from '../../lib/api';
=======
import { Droplets, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { api, FertilizerPlan } from '../../lib/api';
>>>>>>> ai-integration

export default function FertilizerPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('');
<<<<<<< HEAD
  const [recommendation, setRecommendation] = useState<any>(null);
  const [history, setHistory] = useState<FertilizerRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.fertilizerRecommendations(token).then(setHistory).catch(() => {});
  }, [token]);

  const crops = [
    { value: 'rice', label: 'Rice / à¦§à¦¾à¦¨' },
    { value: 'wheat', label: 'Wheat / à¦—à¦®' },
    { value: 'tomato', label: 'Tomato / à¦Ÿà¦®à§‡à¦Ÿà§‹' },
    { value: 'potato', label: 'Potato / à¦†à¦²à§' },
    { value: 'corn', label: 'Corn / à¦­à§à¦Ÿà§à¦Ÿà¦¾' },
=======
  const [recommendation, setRecommendation] = useState<FertilizerPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const crops = [
    { value: 'Rice (paddy)', label: 'Rice / ধান' }, { value: 'Wheat', label: 'Wheat / গম' },
    { value: 'Tomato', label: 'Tomato / টমেটো' }, { value: 'Potato', label: 'Potato / আলু' },
    { value: 'Maize', label: 'Maize / ভুট্টা' },
>>>>>>> ai-integration
  ];

  const handleGetRecommendation = async () => {
    if (!token || !selectedCrop) return;
<<<<<<< HEAD

    const generated = {
      crop: selectedCrop,
      fertilizers: [
        { name: 'Urea', amount: '150 kg/acre', timing: 'Apply in 3 splits: planting, tillering, flowering' },
        { name: 'TSP', amount: '100 kg/acre', timing: 'Apply at planting time' },
        { name: 'MOP', amount: '80 kg/acre', timing: 'Apply in 2 splits: planting and tillering' },
        { name: 'Gypsum', amount: '50 kg/acre', timing: 'Apply at planting time' },
      ],
      tips: [
        'Test soil pH before application',
        'Maintain proper soil moisture',
        'Split application helps reduce nutrient loss',
        'Apply fertilizer 2-3 inches away from plant stem',
      ],
    };

    setLoading(true);
    try {
      const suggestion = generated.fertilizers
        .map((fert) => `${fert.name}: ${fert.amount}. ${fert.timing}`)
        .join('\n');
      const saved = await api.createFertilizerRecommendation(token, {
        crop_name: selectedCrop,
        disease: 'General crop nutrition',
        suggestion,
      });
      setHistory((prev) => [saved, ...prev]);
      setRecommendation(generated);
      toast.success('Fertilizer recommendation saved to database.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('fertilizer')}</h1>
            <p className="text-gray-600">{t('fertilizerGuideDesc')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCrop')}</CardTitle>
                <CardDescription>Choose your crop to get AI recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('cropName')}</label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop..." />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGetRecommendation}
                  disabled={!selectedCrop || loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Droplets className="size-4 mr-2" />
                  {loading ? t('loading') : t('getFertilizerRecommendation')}
                </Button>

                <p className="text-sm text-gray-600">Saved recommendations: {history.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('recommendations')}</CardTitle>
                <CardDescription>AI-generated fertilizer guide</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendation ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Selected Crop:</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">{recommendation.crop}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('dosage')}:</h3>
                      <div className="space-y-2">
                        {recommendation.fertilizers.map((fert: any, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-gray-900">{fert.name}</p>
                            <p className="text-sm text-gray-700">{fert.amount}</p>
                            <p className="text-xs text-gray-600 mt-1">{fert.timing}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Application Tips:</h3>
                      <div className="space-y-2">
                        {recommendation.tips.map((tip: string, index: number) => (
                          <div key={index} className="flex gap-2 items-start">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Droplets className="size-16 mx-auto mb-4 opacity-20" />
                    <p>Select a crop and get recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
=======
    setLoading(true);
    try {
      const plan = await api.generateFertilizerPlan(token, selectedCrop);
      setRecommendation(plan);
      toast.success('SF AI fertilizer guide generated and saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI recommendation could not be completed.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout className="bg-gray-50"><div className="container mx-auto px-4 py-8"><div className="mx-auto max-w-4xl">
      <div className="mb-8"><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('fertilizer')}</h1><p className="text-gray-600">Dynamic SF AI guidance based on the selected crop. Confirm every dose with a soil test and local agriculture officer.</p></div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>{t('selectCrop')}</CardTitle><CardDescription>Choose a crop for a non-fixed AI-generated plan</CardDescription></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">{t('cropName')}</label><Select value={selectedCrop} onValueChange={setSelectedCrop}><SelectTrigger><SelectValue placeholder="Select crop..." /></SelectTrigger><SelectContent>{crops.map((crop) => <SelectItem key={crop.value} value={crop.value}>{crop.label}</SelectItem>)}</SelectContent></Select></div>
          <Button onClick={handleGetRecommendation} disabled={!selectedCrop || loading} className="w-full bg-green-600 hover:bg-green-700"><Droplets className="mr-2 size-4" />{loading ? t('loading') : 'Generate with SF AI'}</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>{t('recommendations')}</CardTitle><CardDescription>AI-generated guide; not a universal fertilizer prescription</CardDescription></CardHeader><CardContent>
          {recommendation ? <div className="space-y-4"><div className="rounded-lg border border-green-200 bg-green-50 p-4"><p className="mb-1 text-sm text-gray-600">Selected crop:</p><p className="text-lg font-bold text-gray-900">{recommendation.crop}</p></div><div><h3 className="mb-3 font-semibold text-gray-900">Suggested planning points:</h3><div className="space-y-2">{recommendation.fertilizers.map((fertilizer, index) => <div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-3"><p className="font-medium text-gray-900">{fertilizer.name}</p><p className="text-sm text-gray-700">{fertilizer.amount}</p><p className="mt-1 text-xs text-gray-600">{fertilizer.timing}</p></div>)}</div></div><div><h3 className="mb-3 font-semibold text-gray-900">Application tips:</h3><div className="space-y-2">{recommendation.tips.map((tip, index) => <div key={index} className="flex gap-2"><CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" /><p className="text-sm text-gray-700">{tip}</p></div>)}</div></div><div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="size-4 shrink-0" />{recommendation.disclaimer}</div></div> : <div className="py-12 text-center text-gray-500"><Droplets className="mx-auto mb-4 size-16 opacity-20" /><p>Select a crop and generate a dynamic SF AI guide.</p></div>}
        </CardContent></Card>
      </div>
    </div></div></PageLayout>
>>>>>>> ai-integration
  );
}
