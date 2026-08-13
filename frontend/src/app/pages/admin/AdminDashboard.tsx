<<<<<<< HEAD
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Scan, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { t } = useLanguage();

  const stats = [
    { label: t('totalUsers'), value: '1,234', icon: <Users className="size-6" />, color: 'bg-blue-500', change: '+12%' },
    { label: t('totalDetections'), value: '5,678', icon: <Scan className="size-6" />, color: 'bg-green-500', change: '+8%' },
    { label: t('totalChats'), value: '12,345', icon: <MessageSquare className="size-6" />, color: 'bg-purple-500', change: '+15%' },
    { label: 'Active Today', value: '342', icon: <Activity className="size-6" />, color: 'bg-orange-500', change: '+5%' },
  ];

  const activityData = [
    { name: 'Mon', users: 65, detections: 45, chats: 120 },
    { name: 'Tue', users: 59, detections: 52, chats: 135 },
    { name: 'Wed', users: 80, detections: 61, chats: 150 },
    { name: 'Thu', users: 81, detections: 58, chats: 142 },
    { name: 'Fri', users: 56, detections: 48, chats: 128 },
    { name: 'Sat', users: 55, detections: 42, chats: 115 },
    { name: 'Sun', users: 40, detections: 35, chats: 98 },
  ];

  const recentUsers = [
    { name: 'Md. Karim', email: 'karim@example.com', joined: '2 hours ago', status: 'active' },
    { name: 'Fatema Begum', email: 'fatema@example.com', joined: '5 hours ago', status: 'active' },
    { name: 'Abdul Rahman', email: 'abdul@example.com', joined: '1 day ago', status: 'active' },
    { name: 'Hasina Khatun', email: 'hasina@example.com', joined: '2 days ago', status: 'inactive' },
  ];
=======
import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Scan, MessageSquare, Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../components/ui/button';
import { AdminDashboardData, api } from '../../lib/api';
import { toast } from 'sonner';

const displayName = (user: AdminDashboardData['recent_users'][number]) =>
  `${user.first_name} ${user.last_name}`.trim() || user.username;

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (showError = true) => {
    if (!token) return;
    try {
      setData(await api.adminDashboard(token));
    } catch (error) {
      if (showError) toast.error(error instanceof Error ? error.message : 'Could not load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
    const refreshTimer = window.setInterval(() => void loadDashboard(false), 15000);
    return () => window.clearInterval(refreshTimer);
  }, [token]);

  const stats = data ? [
    { label: t('totalUsers'), value: data.stats.total_users, icon: <Users className="size-6" />, color: 'bg-blue-500' },
    { label: t('totalDetections'), value: data.stats.total_detections, icon: <Scan className="size-6" />, color: 'bg-green-500' },
    { label: t('totalChats'), value: data.stats.total_chats, icon: <MessageSquare className="size-6" />, color: 'bg-purple-500' },
    { label: 'Active Today', value: data.stats.active_today, icon: <Activity className="size-6" />, color: 'bg-orange-500' },
  ] : [];
>>>>>>> ai-integration

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('adminPanel')}</h1>
          <p className="text-gray-600">{t('systemActivity')} Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User engagement metrics for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="detections" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="chats" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Users className="size-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{user.joined}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
=======
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('adminPanel')}</h1><p className="text-gray-600">Live database activity and registered-user overview</p></div>
          <Button variant="outline" onClick={() => { setRefreshing(true); void loadDashboard(); }} disabled={refreshing}><RefreshCw className={`mr-2 size-4 ${refreshing ? 'animate-spin' : ''}`} />Refresh</Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, index) => <Card key={index}><CardContent className="h-36 animate-pulse p-6"><div className="h-10 w-10 rounded-lg bg-gray-200" /><div className="mt-5 h-6 w-24 rounded bg-gray-200" /></CardContent></Card>) : stats.map((stat) => <Card key={stat.label}><CardContent className="p-6"><div className={`${stat.color} mb-4 w-fit rounded-lg p-3 text-white`}>{stat.icon}</div><p className="mb-1 text-sm text-gray-600">{stat.label}</p><p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p></CardContent></Card>)}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardHeader><CardTitle>Weekly Activity</CardTitle><CardDescription>Live registrations, disease analyses, and chats from the last 7 days</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={data?.activity ?? []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="detections" name="Detections" stroke="#10b981" strokeWidth={2} /><Line type="monotone" dataKey="chats" name="Chats" stroke="#8b5cf6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle>Recent Users</CardTitle><CardDescription>Latest accounts from the database</CardDescription></CardHeader><CardContent><div className="space-y-4">{data?.recent_users.length ? data.recent_users.map((user) => <div key={user.id} className="flex items-start gap-3"><div className="rounded-full bg-green-100 p-2"><Users className="size-4 text-green-600" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900">{displayName(user)}</p><p className="truncate text-xs text-gray-500">{user.email || user.username}</p><p className="mt-1 text-xs text-gray-400">{new Date(user.created_at).toLocaleString()}</p></div><span className={`rounded-full px-2 py-1 text-xs ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{user.is_active ? 'active' : 'inactive'}</span></div>) : <p className="py-8 text-center text-sm text-gray-500">No users found.</p>}</div></CardContent></Card>
>>>>>>> ai-integration
        </div>
      </div>
    </PageLayout>
  );
}
