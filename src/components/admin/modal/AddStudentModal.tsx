
import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon, CustomSelect } from '@/constants';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (studentData: any) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    discord: '',
    cohort: 'Cohort 12',
    completedAssignments: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(newStudent);
    setNewStudent({ name: '', email: '', phone: '', discord: '', cohort: 'Cohort 12', completedAssignments: [] });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" zIndex="z-[150]">
      <div className="p-10 flex flex-col">
        <div className="flex items-center gap-6 mb-10">
          <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Icon name="person_add" className="text-4xl" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Add New Student</h3>
            <p className="text-text-secondary text-base">Register a new student into the portal</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
            <input 
              type="text" 
              required 
              value={newStudent.name} 
              onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
              placeholder="e.g. John Doe" 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all placeholder:text-gray-700" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
            <input 
              type="email" 
              required 
              value={newStudent.email} 
              onChange={e => setNewStudent({...newStudent, email: e.target.value})} 
              placeholder="john@example.com" 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all placeholder:text-gray-700" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={newStudent.phone} 
              onChange={e => setNewStudent({...newStudent, phone: e.target.value})} 
              placeholder="+1 (555) 000-0000" 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all placeholder:text-gray-700" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Cohort</label>
            <CustomSelect value={newStudent.cohort} options={["Cohort 12", "Cohort 11", "Cohort 10"]} onChange={val => setNewStudent({...newStudent, cohort: val})} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Discord Username</label>
            <input 
              type="text" 
              required 
              value={newStudent.discord} 
              onChange={e => setNewStudent({...newStudent, discord: e.target.value})} 
              placeholder="e.g. user#1234" 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all placeholder:text-gray-700" 
            />
          </div>
          <div className="md:col-span-2 flex gap-4 mt-6">
            <button type="submit" className="flex-1 h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95">Confirm Registration</button>
            <button type="button" onClick={onClose} className="flex-1 h-16 rounded-2xl border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
