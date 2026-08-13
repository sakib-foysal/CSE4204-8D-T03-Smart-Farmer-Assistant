<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Search, Eye, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { AdminUser, api } from '../../lib/api';

type UserForm = Pick<AdminUser, 'first_name' | 'last_name' | 'email' | 'phone' | 'role' | 'is_active'>;

const toForm = (user: AdminUser): UserForm => ({
  first_name: user.first_name || '',
  last_name: user.last_name || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || 'farmer',
  is_active: user.is_active,
});

const displayName = (user: AdminUser) =>
  `${user.first_name} ${user.last_name}`.trim() || user.username;

export default function UserManagement() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setUsers(await api.adminUsers(token));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, [token]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return users;
    return users.filter((user) =>
      [displayName(user), user.username, user.email, user.phone].some((value) => value.toLowerCase().includes(query)),
    );
  }, [searchTerm, users]);

  const openUser = (user: AdminUser, shouldEdit = false) => {
    setSelectedUser(user);
    setForm(toForm(user));
    setEditing(shouldEdit);
  };

  const closeUserDialog = () => {
    setSelectedUser(null);
    setForm(null);
    setEditing(false);
  };

  const saveUser = async () => {
    if (!token || !selectedUser || !form) return;
    setSaving(true);
    try {
      const updated = await api.updateAdminUser(token, selectedUser.id, form);
      setUsers((current) => current.map((user) => user.id === updated.id ? updated : user));
      toast.success('User details updated successfully.');
      closeUserDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update user.');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!token || !userToDelete) return;
    setSaving(true);
    try {
      await api.deleteAdminUser(token, userToDelete.id);
      setUsers((current) => current.filter((user) => user.id !== userToDelete.id));
      toast.success('User deleted successfully.');
      setUserToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete user.');
    } finally {
      setSaving(false);
    }
  };
>>>>>>> ai-integration

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userManagement')}</h1>
            <p className="text-gray-600">Manage registered farmers and their accounts</p>
=======
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('userManagement')}</h1>
            <p className="text-gray-600">View and manage every account from the main database.</p>
>>>>>>> ai-integration
          </div>

          <Card>
            <CardHeader>
<<<<<<< HEAD
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
=======
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{t('totalUsers')}: {users.length}</CardTitle>
                  <CardDescription>Live registered-user list</CardDescription>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search by name, username, email or phone..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-10" />
>>>>>>> ai-integration
                </div>
              </div>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
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
=======
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Username</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {loading ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Loading users...</TableCell></TableRow> : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">#{user.id.slice(0, 8)}</TableCell>
                        <TableCell>{displayName(user)}</TableCell><TableCell>{user.username}</TableCell><TableCell>{user.email || '—'}</TableCell><TableCell>{user.phone || '—'}</TableCell><TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell><Badge className={user.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}>{user.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                        <TableCell><div className="flex gap-2"><Button variant="outline" size="sm" title="View details" onClick={() => openUser(user)}><Eye className="size-4" /></Button><Button variant="outline" size="sm" title="Edit user" onClick={() => openUser(user, true)}><Edit className="size-4" /></Button><Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Delete user" onClick={() => setUserToDelete(user)}><Trash2 className="size-4" /></Button></div></TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">{t('noData')}</TableCell></TableRow>}
>>>>>>> ai-integration
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
<<<<<<< HEAD
=======

      <Dialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && closeUserDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit user' : 'User details'}</DialogTitle><DialogDescription>{selectedUser && `Account: ${selectedUser.username}`}</DialogDescription></DialogHeader>
          {selectedUser && form && <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2"><Label>First name</Label><Input disabled={!editing} value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} /></div>
            <div className="space-y-2"><Label>Last name</Label><Input disabled={!editing} value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Email</Label><Input type="email" disabled={!editing} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input disabled={!editing} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
            <div className="space-y-2"><Label>Role</Label><Input disabled={!editing} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></div>
            <div className="space-y-2"><Label>Status</Label>{editing ? <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={form.is_active ? 'active' : 'inactive'} onChange={(event) => setForm({ ...form, is_active: event.target.value === 'active' })}><option value="active">Active</option><option value="inactive">Inactive</option></select> : <p className="pt-2 text-sm">{form.is_active ? 'Active' : 'Inactive'}</p>}</div>
            <div className="space-y-2"><Label>Joined</Label><p className="pt-2 text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p></div>
          </div>}
          <DialogFooter>{editing ? <><Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button><Button className="bg-green-600 hover:bg-green-700" onClick={saveUser} disabled={saving}><Save className="mr-2 size-4" />{saving ? 'Saving...' : 'Save changes'}</Button></> : <Button onClick={() => setEditing(true)}>Edit user</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete user?</AlertDialogTitle><AlertDialogDescription>{userToDelete && `This permanently removes ${displayName(userToDelete)} and their account data. This action cannot be undone.`}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={deleteUser} disabled={saving}>{saving ? 'Deleting...' : 'Delete user'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
>>>>>>> ai-integration
    </PageLayout>
  );
}
