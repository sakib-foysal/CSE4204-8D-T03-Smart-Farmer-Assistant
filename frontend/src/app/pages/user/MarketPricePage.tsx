import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { api, MarketPrice } from '../../lib/api';

export default function MarketPricePage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    api.marketPrices(token)
      .then(setMarketPrices)
      .catch((err) => setError(err instanceof Error ? err.message : t('couldNotLoadPrices')))
      .finally(() => setLoading(false));
  }, [token, t]);

  const filteredPrices = marketPrices.filter(item =>
    item.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('marketPrices')}</h1>
            <p className="text-gray-600">{t('livePricesDesc')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('viewPrices')}</CardTitle>
              <CardDescription>
                {t('lastUpdated')}: {marketPrices[0] ? new Date(marketPrices[0].date).toLocaleString() : t('noDataYet')}
              </CardDescription>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder={t('searchCropRegion')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </p>
              )}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('cropName')}</TableHead>
                      <TableHead>{t('price')}</TableHead>
                      <TableHead>{t('unit')}</TableHead>
                      <TableHead>{t('region')}</TableHead>
                      <TableHead>{t('trend')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {t('loadingPrices')}
                        </TableCell>
                      </TableRow>
                    ) : filteredPrices.length > 0 ? (
                      filteredPrices.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{item.crop_name}</p>
                              <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">৳{Number(item.price).toFixed(2)}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.region}</TableCell>
                          <TableCell>
                            {index % 2 === 0 ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                                <TrendingUp className="size-3 mr-1" />
                                {t('live')}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                                <TrendingDown className="size-3 mr-1" />
                                {t('live')}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
