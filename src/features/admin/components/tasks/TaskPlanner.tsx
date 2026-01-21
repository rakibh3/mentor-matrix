
import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { BackgroundGlow } from '@/components/ui/background-glow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskPlannerProps {
  module: string;
  onModuleChange: (val: string) => void;
  mission: string;
  onMissionChange: (val: string) => void;
  guideline: string;
  onGuidelineChange: (val: string) => void;
  onBroadcast: () => void;
  onClear: () => void;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  module,
  onModuleChange,
  mission,
  onMissionChange,
  guideline,
  onGuidelineChange,
  onBroadcast,
  onClear
}) => {
  return (
    <Card className="flex flex-col rounded-[2.5rem] border-card-border/50 bg-[#121d16] p-10 shadow-2xl relative group overflow-visible">
      <BackgroundGlow position="top-right" size="sm" blur="md" className="w-64 h-64 rounded-tr-[2.5rem]" />
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex gap-5 items-center">
          <IconAvatar variant="primary" size="lg" className="bg-[#16271e] shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Icon name="event_note" className="text-4xl" />
          </IconAvatar>
          <div className="flex flex-col">
            <p className="text-white text-2xl font-black leading-tight tracking-tight uppercase">Session Planner</p>
            <p className="text-text-secondary text-xs font-medium opacity-60">Push next day's mission to the student dashboard.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-30">
        <div className="space-y-3">
          <Label className="ml-1">Curriculum Module</Label>
          <Select value={module} onValueChange={onModuleChange}>
            <SelectTrigger icon="layers">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Module 1">Module 1</SelectItem>
              <SelectItem value="Module 2">Module 2</SelectItem>
              <SelectItem value="Module 3">Module 3</SelectItem>
              <SelectItem value="Module 4">Module 4</SelectItem>
              <SelectItem value="Module 5">Module 5</SelectItem>
              <SelectItem value="Module 6">Module 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label className="ml-1">Active Mission</Label>
          <Select value={mission} onValueChange={onMissionChange}>
            <SelectTrigger icon="rocket_launch">
              <SelectValue placeholder="Select mission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mission 1">Mission 1</SelectItem>
              <SelectItem value="Mission 2">Mission 2</SelectItem>
              <SelectItem value="Mission 3">Mission 3</SelectItem>
              <SelectItem value="Mission 4">Mission 4</SelectItem>
              <SelectItem value="Mission 5">Mission 5</SelectItem>
              <SelectItem value="Mission 6">Mission 6</SelectItem>
              <SelectItem value="Mission 7">Mission 7</SelectItem>
              <SelectItem value="Mission 8">Mission 8</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-3 mb-10 relative z-10">
        <Label className="ml-1">Learning Guideline</Label>
        <Textarea 
          variant="planner"
          value={guideline} 
          onChange={(e) => onGuidelineChange(e.target.value)} 
          className="h-40"
          placeholder="Describe the focus for tomorrow's session..."
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Button 
          onClick={onBroadcast}
          size="lg"
          className="flex-[3] tracking-[0.2em] group/btn"
        >
          <Icon name="send" className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          <span>Broadcast Task</span>
        </Button>
        <Button 
          onClick={onClear}
          variant="outline"
          size="lg"
          className="flex-1 tracking-[0.2em]"
        >
          <Icon name="refresh" className="text-xl" />
          <span>Clear</span>
        </Button>
      </div>
    </Card>
  );
};
