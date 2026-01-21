import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminStudent } from '@/types';

interface OutreachEmailModalProps {
  student: AdminStudent | null;
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Compose Outreach Email to {student.name}</DialogTitle>
          <DialogDescription>Send an outreach email to the student</DialogDescription>
        </VisuallyHidden>
        <div className="p-12 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">COMPOSE OUTREACH</h3>
              <p className="text-text-secondary text-sm font-medium">To: {student.name}</p>
            </div>
            <Button variant="icon" size="icon" onClick={onClose}>
              <Icon name="close" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <Input 
              id="outreach-subject"
              name="subject"
              type="text" 
              required 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="Subject" 
            />
            <Textarea 
              id="outreach-body"
              name="body"
              variant="filled"
              required 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              placeholder={`Message to ${student.name}...`} 
              className="h-48"
            />
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-[2]">
                SEND EMAIL
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
                DISCARD
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
