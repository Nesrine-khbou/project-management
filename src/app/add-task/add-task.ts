import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../types';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask implements OnInit {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['Moyenne', Validators.required],
      status: ['En attente', Validators.required],
      assignee: ['', [Validators.required, Validators.minLength(2)]],
      deadline: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.value;
    const taskToAdd: Task = {
      ...formValue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      progress: '0%'
    };

    this.taskAdded.emit(taskToAdd);
    this.resetForm();
  }

  private resetForm() {
    this.taskForm.reset({
      priority: 'Moyenne',
      status: 'En attente'
    });
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get assignee() {
    return this.taskForm.get('assignee');
  }

  get deadline() {
    return this.taskForm.get('deadline');
  }
}