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

  get filteredTasks() {
    return this.tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(this.taskSearch.toLowerCase());
      const matchStatus = this.taskStatusFilter === '' || task.status === this.taskStatusFilter;
      return matchSearch && matchStatus;
    });
  }
}
