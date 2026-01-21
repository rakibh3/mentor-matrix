import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { SettingsPageLayout } from '@/features/admin/components/settings/SettingsPageLayout';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface AdminSettingsTeamProps {
  onLogout: () => void;
}

const AdminSettingsTeam: React.FC<AdminSettingsTeamProps> = ({ onLogout }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Admin User', email: 'admin@devcamp.io', role: 'Super Admin', status: 'Active' },
    { name: 'Sarah Connor', email: 'sarah@devcamp.io', role: 'Moderator', status: 'Active' },
    { name: 'James Doe', email: 'james@devcamp.io', role: 'Curriculum Dev', status: 'Inactive' },
  ]);

  const [newInvite, setNewInvite] = useState({ name: '', email: '', role: 'Moderator' });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setTeamMembers([...teamMembers, { ...newInvite, status: 'Active' }]);
    setIsInviteModalOpen(false);
    setNewInvite({ name: '', email: '', role: 'Moderator' });
  };

  return (
    <>
      <SettingsPageLayout onLogout={onLogout} showFooter={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Team Management</h3>
            <p className="text-sm text-text-secondary font-medium">Manage administrative access, roles, and permissions.</p>
          </div>
          <Button size="lg" onClick={() => setIsInviteModalOpen(true)}>
            <Icon name="person_add" className="text-xl" />
            Invite New Member
          </Button>
        </div>
        
        <div className="overflow-hidden rounded-3xl border border-card-border bg-background-dark/30 shadow-sm">
          <Table className="text-left text-sm text-text-secondary">
            <TableHeader className="bg-card-dark border-b border-card-border">
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-card-border/30 bg-card-dark/40">
              {teamMembers.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className={`size-10 rounded-xl border border-primary/20 ${u.status === 'Inactive' ? 'grayscale opacity-50' : ''}`}>
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black">
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-white font-black tracking-tight group-hover:text-primary transition-colors">{u.name}</span>
                        <span className="text-xs font-medium text-gray-500">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant={u.role === 'Super Admin' ? 'primary' : 'outline'}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant={u.status === 'Active' ? 'primary' : 'default'} className="gap-2">
                      <StatusDot variant={u.status === 'Active' ? 'primary' : 'inactive'} size="xs" />
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-right">
                    {u.email === 'admin@devcamp.io' ? (
                      <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Session Active</span>
                    ) : (
                      <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="p-2 size-10 rounded-xl border border-card-border hover:text-white hover:bg-white/5">
                          <Icon name="edit" className="text-xl" />
                        </Button>
                        <Button variant="outline" size="icon" className="p-2 size-10 rounded-xl border border-card-border hover:text-red-400 hover:bg-red-500/10">
                          <Icon name="delete" className="text-xl" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsPageLayout>

      {/* Invite Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent size="lg">
          <div className="p-10 flex flex-col">
            <div className="flex items-center gap-6 mb-8">
              <IconAvatar size="xl">
                <Icon name="send" className="text-4xl" />
              </IconAvatar>
              <div>
                <DialogTitle className="text-3xl font-black text-white uppercase tracking-tight">Invite Member</DialogTitle>
                <DialogDescription className="text-text-secondary text-base">Grant administrative access to a new user</DialogDescription>
              </div>
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-name">Full Name</Label>
                <Input 
                  id="invite-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={newInvite.name}
                  onChange={e => setNewInvite({...newInvite, name: e.target.value})}
                  placeholder="e.g. John Wick"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input 
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={newInvite.email}
                  onChange={e => setNewInvite({...newInvite, email: e.target.value})}
                  placeholder="admin@devcamp.io"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-role">Role & Permissions</Label>
                <Select name="role" value={newInvite.role} onValueChange={(val) => setNewInvite({...newInvite, role: val})}>
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Curriculum Dev">Curriculum Dev</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button type="submit" size="lg" className="flex-1">
                  Send Invitation
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setIsInviteModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSettingsTeam;
