import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Task } from '../../../../types';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './task-details.html'
})
export class TaskDetails {
  @Input() task: Task | null = null;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  getProgressColor(progress: string) {
    const value = parseInt(progress, 10) || 0;
  
    if (value < 40) return 'bg-gradient-to-r from-rose-500 to-fuchsia-500';
    if (value < 80) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-emerald-500 to-cyan-500';
  }
  

  closeModal() {
    this.close.emit();
  }
}
