import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskDetails } from '../task-details/task-details';
import { PriorityIndicatorPipe } from '../../../../priority-indicator-pipe';

@Component({
  selector: 'app-task-list',
  imports: [NgClass, FormsModule,TaskDetails, PriorityIndicatorPipe],
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


}
