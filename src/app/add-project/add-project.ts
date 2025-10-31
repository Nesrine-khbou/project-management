import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../types';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css'
})
export class AddProject {
  @Output() projectAdded = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  newProject: Project = {
    name: '',
    description: '',
    status: 'En attente',
    tasks: []
  };

  onSubmit() {
    if (this.newProject.name && this.newProject.description && this.newProject.status) {
      this.projectAdded.emit(this.newProject);
      this.newProject = { name: '', description: '', status: 'En attente', tasks: [] };
    }
  }
}
