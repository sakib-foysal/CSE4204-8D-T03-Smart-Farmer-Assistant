import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Droplets, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api, FertilizerRecommendation } from '../../lib/api';

export default function FertilizerPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('');
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
  ];

  const handleGetRecommendation = async () => {
    if (!token || !selectedCrop) return;

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
  );
}
