import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { api, MarketPrice } from '../../lib/api';

export default function MarketPriceUpdate() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [newPrice, setNewPrice] = useState({
    crop_name: '',
    price: '',
    unit: 'kg',
    region: '',
  });

  const regions = ['Khulna', 'Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'];

  useEffect(() => {
    if (!token) return;
    api.marketPrices(token).then(setMarketPrices).catch(() => {});
  }, [token]);

  const handleAddPrice = async () => {
    if (!token) return;
    if (!newPrice.crop_name.trim() || !newPrice.price || !newPrice.region) {
      toast.error(t('requiredFields'));
      return;
    }
    if (Number(newPrice.price) < 0) {
      toast.error(t('price'));
      return;
    }

    setSaving(true);
    try {
      const saved = await api.createMarketPrice(token, {
        crop_name: newPrice.crop_name.trim(),
        price: Number(newPrice.price).toFixed(2),
        unit: newPrice.unit,
        region: newPrice.region,
      });
      setMarketPrices((prev) => [saved, ...prev]);
      setNewPrice({ crop_name: '', price: '', unit: 'kg', region: '' });
      setIsAdding(false);
      toast.success(t('save'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('noData'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('marketPriceUpdate')}</h1>
            <p className="text-gray-600">{t('marketPriceUpdate')}</p>
          </div>

          {isAdding && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('price')}</CardTitle>
                <CardDescription>{t('marketPriceUpdate')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>{t('cropName')}</Label>
                    <Input
                      placeholder="e.g., Rice, Wheat"
                      value={newPrice.crop_name}
                      onChange={(e) => setNewPrice({ ...newPrice, crop_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('price')} (৳)</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="32"
                      value={newPrice.price}
                      onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('unit')}</Label>
                    <Select value={newPrice.unit} onValueChange={(value) => setNewPrice({ ...newPrice, unit: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                        <SelectItem value="piece">piece</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('region')}</Label>
                    <Select value={newPrice.region} onValueChange={(value) => setNewPrice({ ...newPrice, region: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="invisible">Actions</Label>
                    <div className="flex gap-2">
                      <Button onClick={handleAddPrice} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Save className="size-4 mr-1" />
                        {saving ? t('loading') : t('save')}
                      </Button>
                      <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1">
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>{t('marketPrices')}</CardTitle>
                  <CardDescription>{t('marketPriceUpdate')}</CardDescription>
                </div>
                {!isAdding && (
                  <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="size-4 mr-2" />
                    {t('price')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{t('cropName')}</TableHead>
                      <TableHead>{t('price')}</TableHead>
                      <TableHead>{t('unit')}</TableHead>
                      <TableHead>{t('region')}</TableHead>
                      <TableHead>{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketPrices.length > 0 ? marketPrices.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell className="font-medium">#{price.id.slice(0, 8)}</TableCell>
                        <TableCell className="font-medium">{price.crop_name}</TableCell>
                        <TableCell className="font-bold text-green-600">৳{Number(price.price).toFixed(2)}</TableCell>
                        <TableCell>{price.unit}</TableCell>
                        <TableCell>{price.region}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <Edit className="size-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" disabled>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {t('noData')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
