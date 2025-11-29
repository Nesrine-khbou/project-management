import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css'
})
export class EditProject implements OnInit {
  @Input() project!: Project;
  @Output() projectUpdated = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  editedProject: Project = {
    name: '',
    description: '',
    status: 'En attente',
    tasks: []
  };

  ngOnInit() {
    // Initialize form with existing project data
    this.editedProject = {
      id: this.project.id,
      name: this.project.name,
      description: this.project.description,
      status: this.project.status,
      tasks: this.project.tasks // Preserve existing tasks
    };
  }

  onSubmit() {
    if (this.editedProject.name && this.editedProject.description && this.editedProject.status) {
      this.projectUpdated.emit(this.editedProject);
    }
  }
}

