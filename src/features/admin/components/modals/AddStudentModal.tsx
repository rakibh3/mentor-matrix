import React, { useState } from 'react';
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
import type { AdminStudent } from '@/types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentData: Partial<AdminStudent>) => void;
}

const initialStudent: Partial<AdminStudent> = {
  name: '',
  email: '',
  phone: '',
  discord: '',
  cohort: '12',
  completedAssignments: []
};

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [newStudent, setNewStudent] = useState<Partial<AdminStudent>>(initialStudent);

  const handleClose = () => {
    setNewStudent(initialStudent);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(newStudent);
    setNewStudent(initialStudent);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      icon="person_add"
      title="Add New Student"
      subtitle="Register a new student into the portal"
      onSubmit={handleSubmit}
      submitText="Confirm Registration"
    >
      <FormField label="Full Name" className="md:col-span-2">
        <Input 
          type="text" 
          required 
          value={newStudent.name} 
          onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
          placeholder="e.g. John Doe" 
        />
      </FormField>
      
      <FormField label="Email Address">
        <Input 
          type="email" 
          required 
          value={newStudent.email} 
          onChange={e => setNewStudent({...newStudent, email: e.target.value})} 
          placeholder="john@example.com" 
        />
      </FormField>
      
      <FormField label="Phone Number">
        <Input 
          type="tel" 
          required 
          value={newStudent.phone} 
          onChange={e => setNewStudent({...newStudent, phone: e.target.value})} 
          placeholder="+1 (555) 000-0000" 
        />
      </FormField>
      
      <FormField label="Cohort">
        <Select value={newStudent.cohort} onValueChange={val => setNewStudent({...newStudent, cohort: val})}>
          <SelectTrigger>
            <SelectValue placeholder="Select cohort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Cohort 12</SelectItem>
            <SelectItem value="11">Cohort 11</SelectItem>
            <SelectItem value="10">Cohort 10</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      
      <FormField label="Discord Username">
        <Input 
          type="text" 
          required 
          value={newStudent.discord} 
          onChange={e => setNewStudent({...newStudent, discord: e.target.value})} 
          placeholder="e.g. user#1234" 
        />
      </FormField>
    </FormModal>
  );
};
