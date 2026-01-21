import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FormModal } from '@/components/shared/FormModal';
import { FormField } from '@/components/shared/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Base type for editable student fields
interface EditableStudent {
  name: string;
  email: string;
  status: 'Active' | 'Probation' | 'Inactive';
  cohort?: string;
}

interface EditStudentModalProps<T extends EditableStudent> {
  isOpen: boolean;
  onClose: () => void;
  student: T | null;
  onSave: (updatedStudent: T) => void;
}

export const EditStudentModal = <T extends EditableStudent>({ 
  isOpen, 
  onClose, 
  student, 
  onSave 
}: EditStudentModalProps<T>) => {
  const [editData, setEditData] = useState<Partial<T>>({});

  // Reset edit data when student changes to prevent stale data carrying over
  useEffect(() => {
    setEditData({});
  }, [student]);

  // Merge student data with local edits
  const currentData = student ? { ...student, ...editData } : null;

  const handleClose = () => {
    setEditData({});
    onClose();
  };

  if (!currentData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentData as T);
    setEditData({});
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      icon="person_edit"
      title="Edit Student"
      subtitle={`Modifying profile for ${currentData.name}`}
      onSubmit={handleSubmit}
      submitText="Save Changes"
    >
      <FormField label="Full Name">
        <Input 
          type="text" 
          value={currentData.name} 
          onChange={e => setEditData(prev => ({...prev, name: e.target.value}))} 
        />
      </FormField>
      
      <FormField label="Email Address">
        <Input 
          type="email" 
          value={currentData.email} 
          disabled 
          className="bg-background-dark/30 border-card-border/50 text-gray-500 cursor-not-allowed" 
        />
      </FormField>
      
      <FormField label="Cohort">
        <Input 
          type="text" 
          value={currentData.cohort ?? ''} 
          onChange={e => setEditData(prev => ({...prev, cohort: e.target.value}))} 
        />
      </FormField>
      
      <FormField label="Status">
        <Select value={currentData.status} onValueChange={val => setEditData(prev => ({...prev, status: val as EditableStudent['status']}))}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Probation">Probation</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </FormModal>
  );
};
