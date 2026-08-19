import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, Scan, Droplets, CheckCircle, AlertTriangle, Video } from 'lucide-react';
import { toast } from 'sonner';
import { api, DiseaseAnalysis, FertilizerPlan } from '../../lib/api';

export default function DiseaseDetectionPage() {
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [fertilizerPlan, setFertilizerPlan] = useState<FertilizerPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const confidenceScore = result ? Math.max(0, Math.min(100, Number.parseFloat(String(result.confidence).replace(/[^0-9.]/g, '')) || 0)) : 0;

  const localFallbackPlan = (crop: string): FertilizerPlan => language === 'bn' ? {
    id: 'local-fallback', crop, date: new Date().toISOString(),
    fertilizers: [
      { name: 'সুষম সার পরিকল্পনা', amount: 'মাটির পরীক্ষা ও পণ্যের লেবেল অনুযায়ী সুষম NPK সার ব্যবহার করুন।', timing: 'জমি প্রস্তুতি ও বৃদ্ধির ধাপে ভাগ করে প্রয়োগ করুন।' },
      { name: 'জৈব সার', amount: 'পচানো গোবর বা কম্পোস্ট ব্যবহার করুন।', timing: 'জমি প্রস্তুতির সময় মাটির সঙ্গে মিশিয়ে দিন।' },
    ],
    tips: ['একবারে অতিরিক্ত সার দেবেন না।', 'সার দেওয়ার পরে প্রয়োজনমতো সেচ দিন, তবে পানি জমতে দেবেন না।'],
    disclaimer: 'এটি সাধারণ নিরাপদ নির্দেশনা; সঠিক মাত্রার জন্য মাটি পরীক্ষা ও পণ্যের লেবেল অনুসরণ করুন।',
  } : {
    id: 'local-fallback', crop, date: new Date().toISOString(),
    fertilizers: [
      { name: 'Balanced fertilizer plan', amount: 'Use balanced NPK fertilizer according to a soil test and the product label.', timing: 'Apply in split doses during land preparation and crop growth.' },
      { name: 'Organic matter', amount: 'Use well-decomposed compost or manure.', timing: 'Incorporate it into the soil during land preparation.' },
    ],
    tips: ['Do not apply too much fertilizer at once.', 'Irrigate as needed after application without allowing standing water.'],
    disclaimer: 'This is general safe guidance; confirm the exact dose using a soil test and product label.',
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setSelectedImage(loadEvent.target?.result as string);
      setSelectedVideo(null);
      setResult(null);
      setFertilizerPlan(null);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/') || file.size > 1024 * 1024 * 1024) {
      toast.error('Please select a supported crop video that is 1 GB or smaller.');
      return;
    }
    setSelectedVideo(file);
    setSelectedImage(null);
    setResult(null);
    setFertilizerPlan(null);
  };

  const generateFertilizerGuide = async (crop: string, assessment: string, diseaseId?: string) => {
    if (!token || !crop) return;
    setGeneratingPlan(true);
    try {
      const plan = await api.generateFertilizerPlan(token, crop, `Visual crop assessment: ${assessment}`, language, diseaseId);
      setFertilizerPlan(plan);
    } catch (error) {
      setFertilizerPlan(localFallbackPlan(crop));
      toast.error(error instanceof Error ? error.message : 'Showing a safe fertilizer guide.');
    } finally {
      setGeneratingPlan(false);
    }
  };

  useEffect(() => {
    if (result?.is_crop && result.has_disease) {
      void generateFertilizerGuide(result.crop || (language === 'bn' ? 'আপলোডকৃত ফসল' : 'Crop shown in the uploaded image'), result.prediction, result.id);
    }
  }, [language]);

  const handleDetect = async () => {
    if (!token || (!selectedImage && !selectedVideo)) return;
    setDetecting(true);
    setAnalysisProgress(2);
    const startedAt = Date.now();
    const progressTimer = window.setInterval(() => setAnalysisProgress(Math.min(95, Math.max(2, Math.round(((Date.now() - startedAt) / 55000) * 95)))), 400);
    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 59000);
    setFertilizerPlan(null);
    try {
      const analysis = selectedVideo
        ? await api.analyzeDiseaseVideo(token, selectedVideo, '', controller.signal)
        : await api.analyzeDisease(token, selectedImage!, '', language, controller.signal);
      setResult(analysis);
      setAnalysisProgress(100);
      if (analysis.is_crop && analysis.has_disease) {
        void generateFertilizerGuide(analysis.crop || (language === 'bn' ? 'আপলোডকৃত ফসল' : 'Crop shown in the uploaded image'), analysis.prediction, analysis.id);
      }
      toast.success('SF AI visual assessment completed and saved.');
    } catch (error) {
      setResult(null);
      setFertilizerPlan(null);
      toast.error(error instanceof Error ? error.message : 'AI analysis could not be completed.');
    } finally {
      window.clearInterval(progressTimer);
      window.clearTimeout(requestTimeout);
      setDetecting(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8"><div className="mx-auto max-w-7xl">
        <div className="mb-8"><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('diseaseDetection')}</h1><p className="text-gray-600">{t('visualAssessment')}</p></div>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <Card><CardHeader><CardTitle>{t('uploadImage')}</CardTitle><CardDescription>Upload a crop image (PNG, JPG, WEBP; maximum 5 MB) or crop video (maximum 1 GB).</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-green-500">
              {selectedImage ? <div className="space-y-4"><img src={selectedImage} alt={t('selectImage')} className="mx-auto max-h-64 rounded-lg" /><label className="inline-block"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" /><Button variant="outline" size="sm" asChild><span className="cursor-pointer">{t('selectAnotherImage')}</span></Button></label></div> : selectedVideo ? <div className="space-y-3"><Video className="mx-auto size-12 text-green-600" /><p className="font-medium text-gray-700">{selectedVideo.name}</p><p className="text-sm text-gray-500">{(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB video selected</p><label className="inline-block"><input type="file" accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,video/x-ms-wmv,video/3gpp" onChange={handleVideoSelect} className="hidden" /><Button variant="outline" size="sm" asChild><span className="cursor-pointer">Choose another video</span></Button></label></div> : <div className="space-y-4"><label className="block cursor-pointer"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" /><Upload className="mx-auto mb-2 size-12 text-gray-400" /><p className="text-gray-600">{t('selectImage')}</p><p className="text-sm text-gray-500">PNG, JPG, or WEBP crop-leaf image, maximum 5 MB</p></label><label className="block cursor-pointer border-t pt-4"><input type="file" accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,video/x-ms-wmv,video/3gpp" onChange={handleVideoSelect} className="hidden" /><Video className="mx-auto mb-2 size-10 text-gray-400" /><p className="text-gray-600">Upload crop video</p><p className="text-sm text-gray-500">MP4, MOV, AVI, WEBM, MPEG, WMV, or 3GP; maximum 1 GB</p></label></div>}
            </div>
            <Button onClick={handleDetect} disabled={(!selectedImage && !selectedVideo) || detecting} className="w-full bg-green-600 hover:bg-green-700">{detecting ? `${t('loading')} ${analysisProgress}%` : <><Scan className="mr-2 size-4" />{t('analyzeWithAi')}</>}</Button>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>{t('diseaseResult')}</CardTitle></CardHeader><CardContent>
            {result ? <div className="space-y-4"><div className="rounded-lg border border-green-200 bg-green-50 p-4"><p className="mb-1 text-sm text-gray-600">{t('diseaseResult')}:</p><p className="text-xl font-bold text-gray-900">{result.prediction}</p></div><div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="mb-2 flex items-center justify-between"><p className="text-sm text-gray-600">{t('confidence')}</p><span className="text-lg font-bold text-gray-900">{confidenceScore.toFixed(0)}%</span></div><div className="h-3 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-label={t('confidence')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={confidenceScore}><div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${confidenceScore}%` }} /></div></div><div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4"><p className="mb-2 text-sm font-semibold text-gray-900">{t('treatment')}:</p><p className="whitespace-pre-wrap text-sm text-gray-700">{result.treatment}</p></div><p className="text-xs text-gray-500">{result.disclaimer}</p></div> : <div className="py-12 text-center text-gray-500"><Scan className="mx-auto mb-4 size-16 opacity-20" /><p>{t('uploadImage')}</p></div>}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Droplets className="size-5 text-green-600" />{t('fertilizer')}</CardTitle><CardDescription>{t('fertilizerNotice')}</CardDescription></CardHeader><CardContent className="space-y-4">
            {generatingPlan ? <div className="py-6 text-center text-sm text-gray-500">{t('loading')}</div> : fertilizerPlan ? <div className="space-y-4"><div className="rounded-lg border border-green-200 bg-green-50 p-3"><p className="text-sm text-gray-600">{t('selectedCrop')}</p><p className="font-bold text-gray-900">{fertilizerPlan.crop}</p></div><div className="space-y-2">{fertilizerPlan.fertilizers.map((fertilizer, index) => <div key={`${fertilizer.name}-${index}`} className="rounded-lg border border-blue-200 bg-blue-50 p-3"><p className="font-medium text-gray-900">{fertilizer.name}</p><p className="text-sm text-gray-700">{fertilizer.amount}</p><p className="mt-1 text-xs text-gray-600">{fertilizer.timing}</p></div>)}</div><div className="space-y-2">{fertilizerPlan.tips.map((tip, index) => <div key={index} className="flex gap-2"><CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" /><p className="text-sm text-gray-700">{tip}</p></div>)}</div><div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="size-4 shrink-0" />{fertilizerPlan.disclaimer}</div></div> : <div className="py-6 text-center text-sm text-gray-500">{t('noRecommendation')}</div>}
          </CardContent></Card>
        </div>
      </div></div>
    </PageLayout>
  );
}
