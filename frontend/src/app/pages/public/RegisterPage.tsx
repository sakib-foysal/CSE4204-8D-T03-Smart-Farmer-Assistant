import { useState } from 'react';
import { useNavigate, Link } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

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
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        phone: formData.phone.replace(/[\s-]/g, ''),
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
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1700-000000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
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
