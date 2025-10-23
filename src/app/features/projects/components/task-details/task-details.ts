import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './task-details.html'
})
export class TaskDetails {
  @Input() task: any = null;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  getProgressColor(progress: string): string {
    const value = parseInt(progress.replace('%', ''), 10);
    if (value <= 10) return 'bg-gray-50';
    if (value <= 30) return 'bg-red-300';
    if (value <= 80) return 'bg-yellow-200';
    return 'bg-green-100';
  }

  closeModal() {
    this.close.emit();
  }
}
