import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class AddTask implements OnInit, OnChanges {
  @Input() taskToEdit?: Task;
  @Input() isEditMode: boolean = false;
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskToEdit'] && this.taskToEdit && this.taskForm) {
      this.populateForm();
    }
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

    if (this.taskToEdit) {
      this.populateForm();
    }
  }

  private populateForm() {
    if (this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        priority: this.taskToEdit.priority,
        status: this.taskToEdit.status,
        assignee: this.taskToEdit.assignee,
        deadline: this.taskToEdit.deadline
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.value;
    
    if (this.isEditMode && this.taskToEdit) {
      // Edit mode - update existing task
      const updatedTask: Task = {
        ...this.taskToEdit,
        ...formValue
      };
      this.taskUpdated.emit(updatedTask);
    } else {
      // Add mode - create new task
      const newTask: Task = {
        ...formValue,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        progress: '0%'
      };
      this.taskAdded.emit(newTask);
    }
    
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