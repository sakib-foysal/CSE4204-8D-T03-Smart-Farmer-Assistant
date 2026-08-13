import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, Scan, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
<<<<<<< HEAD
import { api } from '../../lib/api';
=======
import { api, DiseaseAnalysis } from '../../lib/api';
>>>>>>> ai-integration

export default function DiseaseDetectionPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
<<<<<<< HEAD
  const [result, setResult] = useState<any>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
=======
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setSelectedImage(loadEvent.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
>>>>>>> ai-integration
  };

  const handleDetect = async () => {
    if (!token || !selectedImage) return;
<<<<<<< HEAD

    const detected = {
      disease: 'Tomato Late Blight',
      confidence: 92.5,
      treatment: 'Apply copper-based fungicides. Remove affected leaves. Ensure proper air circulation and avoid overhead watering.',
    };

    setDetecting(true);
    try {
      await api.createDiseaseHistory(token, {
        image_url: selectedImage.slice(0, 500),
        prediction: detected.disease,
        confidence: String(detected.confidence),
        treatment: detected.treatment,
      });
      setResult(detected);
      toast.success('Disease detection saved to database.');
    } catch (err) {
      setResult(detected);
      toast.error(err instanceof Error ? err.message : 'Could not save detection result.');
=======
    setDetecting(true);
    try {
      const analysis = await api.analyzeDisease(token, selectedImage);
      setResult(analysis);
      toast.success('SF AI visual assessment completed and saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI analysis could not be completed.');
>>>>>>> ai-integration
    } finally {
      setDetecting(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
<<<<<<< HEAD
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('diseaseDetection')}</h1>
            <p className="text-gray-600">{t('aiDiseaseDesc')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('uploadImage')}</CardTitle>
                <CardDescription>Upload a clear image of your crop leaf</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img src={selectedImage} alt="Selected crop" className="max-h-64 mx-auto rounded-lg" />
                      <label className="inline-block">
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">{t('selectImage')}</span>
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">{t('selectImage')}</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </label>
                  )}
                </div>

                <Button onClick={handleDetect} disabled={!selectedImage || detecting} className="w-full bg-green-600 hover:bg-green-700">
                  {detecting ? <>{t('loading')}</> : <><Scan className="size-4 mr-2" />{t('detectDisease')}</>}
                </Button>

                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-sm">
                    For best results, ensure the image is well-lit and the leaf is clearly visible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('diseaseResult')}</CardTitle>
                <CardDescription>AI analysis results will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Detected Disease:</p>
                      <p className="text-xl font-bold text-gray-900">{result.disease}</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{t('confidence')}:</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{ width: `${result.confidence}%` }} />
                        </div>
                        <span className="font-bold text-gray-900">{result.confidence}%</span>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{t('treatment')}:</p>
                      <p className="text-sm text-gray-700">{result.treatment}</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Fertilizer Recommendations
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Scan className="size-16 mx-auto mb-4 opacity-20" />
                    <p>Upload an image and click detect to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
=======
      <div className="container mx-auto px-4 py-8"><div className="mx-auto max-w-4xl">
        <div className="mb-8"><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('diseaseDetection')}</h1><p className="text-gray-600">SF AI visually assesses your uploaded crop-leaf image; it is not a laboratory-confirmed diagnosis.</p></div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card><CardHeader><CardTitle>{t('uploadImage')}</CardTitle><CardDescription>PNG, JPG, or WEBP crop-leaf image, maximum 2 MB</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-green-500">
              {selectedImage ? <div className="space-y-4"><img src={selectedImage} alt="Selected crop leaf" className="mx-auto max-h-64 rounded-lg" /><label className="inline-block"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" /><Button variant="outline" size="sm" asChild><span className="cursor-pointer">Select another image</span></Button></label></div> : <label className="block cursor-pointer"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" /><Upload className="mx-auto mb-4 size-12 text-gray-400" /><p className="mb-2 text-gray-600">{t('selectImage')}</p><p className="text-sm text-gray-500">PNG, JPG, WEBP up to 2 MB</p></label>}
            </div>
            <Button onClick={handleDetect} disabled={!selectedImage || detecting} className="w-full bg-green-600 hover:bg-green-700">{detecting ? t('loading') : <><Scan className="mr-2 size-4" />Analyze with SF AI</>}</Button>
            <Alert><AlertCircle className="size-4" /><AlertDescription className="text-sm">Use a bright, close leaf photo. AI output is a visual assessment; confirm treatment with an agricultural officer.</AlertDescription></Alert>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>{t('diseaseResult')}</CardTitle><CardDescription>Dynamic SF AI visual assessment</CardDescription></CardHeader><CardContent>
            {result ? <div className="space-y-4"><div className="rounded-lg border border-green-200 bg-green-50 p-4"><p className="mb-1 text-sm text-gray-600">Visual assessment:</p><p className="text-xl font-bold text-gray-900">{result.prediction}</p></div><div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><p className="mb-1 text-sm text-gray-600">AI visual confidence (not a lab result):</p><div className="flex items-center gap-2"><div className="h-3 flex-1 rounded-full bg-gray-200"><div className="h-3 rounded-full bg-green-600" style={{ width: `${result.confidence}%` }} /></div><span className="font-bold text-gray-900">{result.confidence}%</span></div></div><div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4"><p className="mb-2 text-sm font-semibold text-gray-900">Recommended next steps:</p><p className="whitespace-pre-wrap text-sm text-gray-700">{result.treatment}</p></div><p className="text-xs text-gray-500">{result.disclaimer}</p></div> : <div className="py-12 text-center text-gray-500"><Scan className="mx-auto mb-4 size-16 opacity-20" /><p>Upload an image and click Analyze with SF AI.</p></div>}
          </CardContent></Card>
        </div>
      </div></div>
>>>>>>> ai-integration
    </PageLayout>
  );
}
