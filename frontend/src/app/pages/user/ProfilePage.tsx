import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, token, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setProfileData({
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username,
      email: user.email ?? '',
      phone: user.phone ?? '',
    });
  }, [user]);

  const handleSave = async () => {
    if (!token) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!emailPattern.test(profileData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const [firstName, ...lastNameParts] = profileData.name.trim().split(' ');
    setSaving(true);
    setError('');

    try {
      const response = await api.updateProfile(token, {
        first_name: firstName,
        last_name: lastNameParts.join(' '),
        email: profileData.email.trim(),
        phone: profileData.phone.replace(/[\s-]/g, ''),
      });
      setUser(response.user);
      setIsEditing(false);
      toast.success(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile')}</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="size-24 mx-auto mb-4">
                    <AvatarFallback className="bg-green-600 text-white text-2xl">
                      {(profileData.name || user?.username || 'SF').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-xl text-gray-900">{profileData.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{profileData.email}</p>
                  <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-200">
                    Farmer Account
                  </Badge>
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member since</span>
                        <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Detections</span>
                        <span className="font-medium">Live</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chat Messages</span>
                        <span className="font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile')} Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 flex-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700">
                          {saving ? t('loading') : t('save')}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                          {t('cancel')}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="w-full bg-green-600 hover:bg-green-700">
                        {t('edit')} {t('profile')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change {t('password')}</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current {t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type="password" placeholder="••••••••" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>New {t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type="password" placeholder="••••••••" className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type="password" placeholder="••••••••" className="pl-10" />
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Update {t('password')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
