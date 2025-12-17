import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskDetails } from '../task-details/task-details';
import { PriorityIndicatorPipe } from '../../../../priority-indicator-pipe';
import { Task } from '../../../../types';

@Component({
  selector: 'app-task-list',
  imports: [NgClass, FormsModule,TaskDetails, PriorityIndicatorPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  @Input() tasks: Task[] = [];
  @Input() showAddTaskButton: boolean = true;
  @Output() addTaskClick = new EventEmitter<void>();
  @Output() editTaskClick = new EventEmitter<Task>();
  
  taskSearch: string = '';
  taskStatusFilter: string = '';

  showModal: boolean = false;
  selectedTask: Task | null = null;

  get filteredTasks() {
    return this.tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(this.taskSearch.toLowerCase());
      const matchStatus = this.taskStatusFilter === '' || task.status === this.taskStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  openDetails(task: Task) {
    this.selectedTask = task;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  editTask(task: Task) {
    this.editTaskClick.emit(task);
  }
}
