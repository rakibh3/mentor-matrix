import { useState } from 'react';
import { Icon } from '@/constants';
import { PrimaryButton, SecondaryButton, IconButton } from '@/components/shared/Button';
import { Avatar, AvatarFallback, Badge, Dialog, DialogContent, DialogDescription, DialogTitle, IconAvatar, StatusDot, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { SettingsPageLayout } from '@/pages/admin/components/settings/SettingsPageLayout';
import { Form, FormInput, FormSelect, useZodForm } from '@/components/shared/Form';
import { inviteTeamMemberSchema, TEAM_ROLES, type InviteTeamMemberInput } from '@/lib/validations';

interface AdminSettingsTeamProps {}

const AdminSettingsTeam: React.FC<AdminSettingsTeamProps> = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Admin User', email: 'admin@devcamp.io', role: 'Super Admin', status: 'Active' },
    { name: 'Sarah Connor', email: 'sarah@devcamp.io', role: 'Moderator', status: 'Active' },
    { name: 'James Doe', email: 'james@devcamp.io', role: 'Curriculum Dev', status: 'Inactive' },
  ]);

  const form = useZodForm<InviteTeamMemberInput>({
    schema: inviteTeamMemberSchema,
    defaultValues: { name: '', email: '', role: 'Moderator' },
  });

  const { register, control, formState: { errors, isSubmitting } } = form;

  const handleInvite = (data: InviteTeamMemberInput) => {
    setTeamMembers([...teamMembers, { ...data, status: 'Active' }]);
    setIsInviteModalOpen(false);
    form.reset();
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
    form.reset();
  };

  const roleOptions = TEAM_ROLES.map(role => ({ value: role, label: role }));

  return (
    <>
      <SettingsPageLayout showFooter={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Team Management</h3>
            <p className="text-sm text-text-secondary font-medium">Manage administrative access, roles, and permissions.</p>
          </div>
          <PrimaryButton size="lg" onClick={() => setIsInviteModalOpen(true)}>
            <Icon name="person_add" className="text-xl" />
            Invite New Member
          </PrimaryButton>
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
                        <IconButton
                          icon="edit"
                          variant="outline"
                          size="icon"
                          className="p-2 size-10 rounded-xl border border-card-border hover:text-white hover:bg-white/5"
                        />
                        <IconButton
                          icon="delete"
                          variant="outline"
                          size="icon"
                          className="p-2 size-10 rounded-xl border border-card-border hover:text-red-400 hover:bg-red-500/10"
                        />
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
      <Dialog open={isInviteModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
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

            <Form form={form} onSubmit={handleInvite} className="flex flex-col gap-6">
              <FormInput
                label="Full Name"
                placeholder="e.g. John Wick"
                autoComplete="name"
                error={errors.name?.message}
                required
                {...register('name')}
              />
              <FormInput
                label="Email Address"
                placeholder="admin@devcamp.io"
                autoComplete="email"
                type="email"
                error={errors.email?.message}
                required
                {...register('email')}
              />
              <FormSelect
                name="role"
                control={control}
                label="Role & Permissions"
                options={roleOptions}
                error={errors.role?.message}
                required
              />
              
              <div className="flex gap-4 mt-6">
                <PrimaryButton 
                  type="submit" 
                  size="lg" 
                  loading={isSubmitting}
                  className="flex-1"
                >
                  Send Invitation
                </PrimaryButton>
                <SecondaryButton 
                  type="button" 
                  size="lg" 
                  onClick={handleCloseModal} 
                  className="flex-1"
                >
                  Cancel
                </SecondaryButton>
              </div>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSettingsTeam;
