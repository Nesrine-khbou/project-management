import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../types';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  newTask: Task = {
    title: '',
    description: '',
    priority: 'Moyenne',
    status: 'En attente',
    assignee: '',
    deadline: '',
    createdAt: new Date().toISOString().split('T')[0],
    progress: '0%'
  };

  onSubmit() {
    if (this.newTask.title && this.newTask.description && this.newTask.assignee && this.newTask.deadline) {
      this.taskAdded.emit(this.newTask);
      this.resetForm();
    }
  }

  private resetForm() {
    this.newTask = {
      title: '',
      description: '',
      priority: 'Moyenne',
      status: 'En attente',
      assignee: '',
      deadline: '',
      createdAt: new Date().toISOString().split('T')[0],
      progress: '0%'
    };
  }
}