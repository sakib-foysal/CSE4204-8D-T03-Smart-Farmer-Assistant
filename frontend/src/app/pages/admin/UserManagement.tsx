import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, UserX, Eye, Mail } from 'lucide-react';

export default function UserManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Md. Karim Ahmed', email: 'karim@example.com', phone: '+880 1700-111111', role: 'farmer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Fatema Begum', email: 'fatema@example.com', phone: '+880 1700-222222', role: 'farmer', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Abdul Rahman', email: 'abdul@example.com', phone: '+880 1700-333333', role: 'farmer', status: 'active', joined: '2024-03-10' },
    { id: 4, name: 'Hasina Khatun', email: 'hasina@example.com', phone: '+880 1700-444444', role: 'farmer', status: 'inactive', joined: '2024-04-05' },
    { id: 5, name: 'Rahim Miah', email: 'rahim@example.com', phone: '+880 1700-555555', role: 'farmer', status: 'active', joined: '2024-05-12' },
    { id: 6, name: 'Ayesha Siddika', email: 'ayesha@example.com', phone: '+880 1700-666666', role: 'farmer', status: 'active', joined: '2024-06-01' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userManagement')}</h1>
            <p className="text-gray-600">Manage registered farmers and their accounts</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>{t('totalUsers')}: {users.length}</CardTitle>
                  <CardDescription>All registered farmer accounts</CardDescription>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">#{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            {user.status === 'active' ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" title="View Details">
                                <Eye className="size-4" />
                              </Button>
                              <Button variant="outline" size="sm" title="Send Email">
                                <Mail className="size-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Deactivate">
                                <UserX className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
