import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { FormModal } from '@/components/shared/FormModal';
import { FormField } from '@/components/shared/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task } from '@/types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState<Partial<Task>>({});

  // Reset form data when task changes to prevent stale data carrying over
  useEffect(() => {
    setFormData({});
  }, [task]);

  // Merge task data with local edits
  const currentData = task ? { ...task, ...formData } : null;

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  if (!currentData) return null;

  const handleFieldChange = (field: keyof Task, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentData);
    setFormData({});
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      icon="edit_document"
      title="Edit Assignment"
      subtitle={`Updating details for Mission ${currentData.mission}`}
      onSubmit={handleSubmit}
      submitText="Save Changes"
      formClassName="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2">
        <FormField label="Module #">
          <Select value={`Module ${currentData.moduleNumber}`} onValueChange={(val) => handleFieldChange('moduleNumber', parseInt(val.split(' ')[1]))}>
            <SelectTrigger>
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <SelectItem key={n} value={`Module ${n}`}>Module {n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        
        <FormField label="Mission #">
          <Select value={`Mission ${currentData.mission}`} onValueChange={(val) => handleFieldChange('mission', parseInt(val.split(' ')[1]))}>
            <SelectTrigger>
              <SelectValue placeholder="Select mission" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <SelectItem key={n} value={`Mission ${n}`}>Mission {n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      
      <FormField label="Guideline" className="md:col-span-2">
        <Textarea 
          variant="filled"
          value={currentData.guideline} 
          onChange={(e) => handleFieldChange('guideline', e.target.value)} 
          className="h-32 text-text-secondary"
        />
      </FormField>
      
      <FormField label="Due Date" className="md:col-span-2">
        <DatePicker 
          value={currentData.dueDate} 
          onChange={(val) => handleFieldChange('dueDate', val)} 
        />
      </FormField>
    </FormModal>
  );
};
