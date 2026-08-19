import { useState } from 'react';
import { useNavigate, Link } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const phoneCountries = [
  { code: '+880', shortName: 'BD', digits: 10, example: '1712345678' },
  { code: '+1', shortName: 'US/CA', digits: 10, example: '2025550123' },
  { code: '+91', shortName: 'IN', digits: 10, example: '9876543210' },
  { code: '+92', shortName: 'PK', digits: 10, example: '3012345678' },
  { code: '+44', shortName: 'UK', digits: 10, example: '7911123456' },
  { code: '+81', shortName: 'JP', digits: 10, example: '9012345678' },
  { code: '+61', shortName: 'AU', digits: 9, example: '412345678' },
  { code: '+971', shortName: 'UAE', digits: 9, example: '501234567' },
  { code: '+966', shortName: 'KSA', digits: 9, example: '501234567' },
  { code: '+65', shortName: 'SG', digits: 8, example: '81234567' },
];

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [countryCode, setCountryCode] = useState('+880');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCountry = phoneCountries.find((country) => country.code === countryCode) ?? phoneCountries[0];

  const handleCountryChange = (value: string) => {
    setCountryCode(value);
    handleChange('phone', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError(t('requiredFields'));
      return;
    }

    if (!emailPattern.test(formData.email)) {
      setError(t('validEmail'));
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== selectedCountry.digits) {
      setError(t('phoneDigitsError').replace('{count}', String(selectedCountry.digits)).replace('{code}', selectedCountry.code));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('passwordLength'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMatch'));
      return;
    }

    const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
    setSubmitting(true);
    setError('');

    try {
      const user = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: firstName,
        last_name: lastNameParts.join(' '),
        phone: `${countryCode}${phoneDigits}`,
        role: 'farmer',
      });
      toast.success(t('registrationSuccessful'));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registrationFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <Leaf className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('register')}</CardTitle>
            <CardDescription>{t('appTitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার পুরো নাম / Your Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="farmer_01"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <div className="flex gap-2">
                  <select
                    aria-label={t('countryCode')}
                    value={countryCode}
                    onChange={(event) => handleCountryChange(event.target.value)}
                    className="flex h-9 w-36 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm"
                  >
                    {phoneCountries.map((country) => (
                      <option key={country.code} value={country.code}>{country.shortName} ({country.code})</option>
                    ))}
                  </select>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={selectedCountry.digits}
                    placeholder={selectedCountry.example}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digits))}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">{t('phoneDigitsHint').replace('{code}', countryCode).replace('{count}', String(selectedCountry.digits))}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(value => !value)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
                {submitting ? t('loading') : t('signUp')}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  {t('signIn')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
