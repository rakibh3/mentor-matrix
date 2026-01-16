
import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon } from '@/constants';
import { FlaggedStudent } from '@/types';

interface OutreachEmailModalProps {
  student: FlaggedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

export const OutreachEmailModal: React.FC<OutreachEmailModalProps> = ({ student, isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState('Urgent: Bootcamp Progress Update');
  const [body, setBody] = useState('');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(subject, body);
    setBody(''); // Reset body after send
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-12 flex flex-col">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">COMPOSE OUTREACH</h3>
            <p className="text-text-secondary text-sm font-medium">To: {student.name}</p>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white">
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input 
            type="text" 
            required 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            className="w-full rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold text-white focus:border-primary outline-none" 
            placeholder="Subject" 
          />
          <textarea 
            required 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder={`Message to ${student.name}...`} 
            className="w-full rounded-2xl bg-background-dark/50 border border-card-border p-6 h-48 text-sm font-medium text-white focus:border-primary outline-none resize-none" 
          />
          <div className="flex gap-4">
            <button type="submit" className="flex-[2] h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl transition-all">
              SEND EMAIL
            </button>
            <button type="button" onClick={onClose} className="flex-1 h-16 rounded-2xl border border-card-border text-gray-400 text-sm font-black uppercase tracking-widest hover:text-white transition-all">
              DISCARD
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
