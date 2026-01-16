
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon, CustomSelect } from '@/constants';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (updatedStudent: any) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onSave }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (student) setEditData({ ...student });
  }, [student]);

  if (!editData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" zIndex="z-[150]">
      <div className="p-10 flex flex-col">
        <div className="flex items-center gap-6 mb-10">
          <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Icon name="person_edit" className="text-4xl" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Edit Student</h3>
            <p className="text-text-secondary text-base">Modifying profile for {editData.name}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
            <input 
              type="text" 
              value={editData.name} 
              onChange={e => setEditData({...editData, name: e.target.value})} 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
            <input 
              type="email" 
              value={editData.email} 
              disabled 
              className="w-full rounded-2xl bg-background-dark/30 border border-card-border/50 px-6 h-14 text-sm font-bold text-gray-500 outline-none cursor-not-allowed" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Cohort</label>
            <input 
              type="text" 
              value={editData.cohort} 
              onChange={e => setEditData({...editData, cohort: e.target.value})} 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none transition-all" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Status</label>
            <CustomSelect value={editData.status} options={["Active", "Probation", "Inactive"]} onChange={val => setEditData({...editData, status: val})} />
          </div>
          <div className="col-span-2 flex gap-4 mt-6">
            <button type="submit" className="flex-1 h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95">Save Changes</button>
            <button type="button" onClick={onClose} className="flex-1 h-16 rounded-2xl border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
