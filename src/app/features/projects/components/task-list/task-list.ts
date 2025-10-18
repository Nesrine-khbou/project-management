import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [NgClass, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  @Input() tasks: any[] = [];
  taskSearch: string = '';
  taskStatusFilter: string = '';

  showModal: boolean = false;
  selectedTask: any = null;

  get filteredTasks() {
    return this.tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(this.taskSearch.toLowerCase());
      const matchStatus = this.taskStatusFilter === '' || task.status === this.taskStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  openDetails(task: any) {
    this.selectedTask = task;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  getProgressColor(progress: string): string {
  const value = parseInt(progress.replace('%', ''), 10);
  if (value <= 30) {
    return 'bg-gray-50';
  } else if (value <= 70) {
    return 'bg-yellow-100';
  } else {
    return 'bg-green-100';
  }
}


}
