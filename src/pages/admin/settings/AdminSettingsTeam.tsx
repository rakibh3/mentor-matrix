import React, { useState } from 'react';
import { AdminLayout, SettingsNav } from '@/layout/AdminLayout';
import { Icon, CustomSelect } from '@/constants';

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
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-8 animate-fade-in-up">
        <div className="flex flex-col gap-2 border-b border-card-border pb-8">
          <h2 className="text-white text-4xl font-black leading-tight tracking-tighter uppercase">System Settings</h2>
          <p className="text-text-secondary text-base font-medium">Manage global configuration for attendance tracking and portal access.</p>
        </div>
        <div className="flex flex-col">
          <SettingsNav />
          <div className="grid gap-10 bg-card-dark border border-card-border rounded-3xl p-10 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Team Management</h3>
                <p className="text-sm text-text-secondary font-medium">Manage administrative access, roles, and permissions.</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center justify-center gap-3 h-14 px-8 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 whitespace-nowrap"
              >
                <Icon name="person_add" className="text-xl" />
                Invite New Member
              </button>
            </div>
            
            <div className="overflow-hidden rounded-3xl border border-card-border bg-background-dark/30 shadow-sm">
              <table className="w-full text-left text-sm text-text-secondary">
                <thead className="bg-card-dark text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-b border-card-border">
                  <tr>
                    <th className="px-8 py-6">User</th>
                    <th className="px-8 py-6">Role</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/30 bg-card-dark/40">
                  {teamMembers.map((u, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black ${u.status === 'Inactive' ? 'grayscale opacity-50' : ''}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-black tracking-tight group-hover:text-primary transition-colors">{u.name}</span>
                            <span className="text-xs font-medium text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${u.role === 'Super Admin' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                           <div className={`size-1.5 rounded-full ${u.status === 'Active' ? 'bg-primary' : 'bg-gray-700'}`}></div>
                           <span className={`text-xs font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-primary' : 'text-gray-500'}`}>{u.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {u.email === 'admin@devcamp.io' ? (
                          <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Session Active</span>
                        ) : (
                          <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-xl border border-card-border hover:text-white hover:bg-white/5 transition-all">
                              <Icon name="edit" className="text-xl" />
                            </button>
                            <button className="p-2 rounded-xl border border-card-border hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Icon name="delete" className="text-xl" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-background-dark/95 backdrop-blur-md">
          <div className="w-full max-w-lg bg-card-dark border border-card-border rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-6 mb-10">
              <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Icon name="send" className="text-4xl" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Invite Member</h3>
                <p className="text-text-secondary text-base">Grant administrative access to a new user</p>
              </div>
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                <input 
                  type="text"
                  required
                  value={newInvite.name}
                  onChange={e => setNewInvite({...newInvite, name: e.target.value})}
                  className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-700"
                  placeholder="e.g. John Wick"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                <input 
                  type="email"
                  required
                  value={newInvite.email}
                  onChange={e => setNewInvite({...newInvite, email: e.target.value})}
                  className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-700"
                  placeholder="admin@devcamp.io"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Role & Permissions</label>
                <CustomSelect 
                  value={newInvite.role}
                  options={["Moderator", "Curriculum Dev", "Admin"]}
                  onChange={val => setNewInvite({...newInvite, role: val})}
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button type="submit" className="flex-1 h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95">
                  Send Invitation
                </button>
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 h-16 rounded-2xl border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettingsTeam;