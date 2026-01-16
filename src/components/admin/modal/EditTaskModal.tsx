
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon, CustomSelect, CustomDatePicker } from '@/constants';
import { Task } from '@/types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState<Task | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (task) setFormData({ ...task });
  }, [task]);

  if (!formData) return null;

  const handleFieldChange = (field: keyof Task, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" zIndex="z-[150]">
      <div className="p-10 flex flex-col">
        <div className="flex items-center gap-5 mb-10">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Icon name="edit_document" className="text-3xl" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Edit Assignment</h3>
            <p className="text-text-secondary text-sm font-medium">Updating details for Mission {formData.mission}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Module #</label>
              <CustomSelect 
                value={`Module ${formData.moduleNumber}`} 
                options={["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"]} 
                onChange={(val) => handleFieldChange('moduleNumber', parseInt(val.split(' ')[1]))} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Mission #</label>
              <CustomSelect 
                value={`Mission ${formData.mission}`} 
                options={["Mission 1", "Mission 2", "Mission 3", "Mission 4", "Mission 5", "Mission 6", "Mission 7", "Mission 8"]} 
                onChange={(val) => handleFieldChange('mission', parseInt(val.split(' ')[1]))} 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Guideline</label>
            <textarea 
              value={formData.guideline} 
              onChange={(e) => handleFieldChange('guideline', e.target.value)} 
              className="w-full rounded-2xl bg-background-dark/50 border border-card-border p-6 h-32 text-sm font-medium text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-all" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Due Date</label>
            <CustomDatePicker 
              value={formData.dueDate} 
              onChange={(val) => handleFieldChange('dueDate', val)} 
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="flex-1 h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="flex-1 h-16 rounded-2xl border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
