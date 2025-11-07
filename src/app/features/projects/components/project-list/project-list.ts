import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ both here
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, Task } from '../../../../types';
import { TaskList } from "../task-list/task-list";
import { AddProject } from "../../../../add-project/add-project";

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NgClass, TaskList, FormsModule, AddProject, HttpClientModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectList implements OnInit {
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  projects: Project[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<Project[]>('http://localhost:5000/projects')
      .subscribe((data) => this.projects = data);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProject(newProject: Project) {
    this.http.post<Project>('http://localhost:5000/projects', { ...newProject, tasks: [] })
      .subscribe((createdProject) => {
        this.projects.push(createdProject);
        this.showAddForm = false;
      });
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(project => {
      const matchSearch =
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus =
        this.statusFilter === '' || project.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  getProjectProgress(project: Project): number {
    const totalTasks = project.tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task: Task) => task.status === 'Terminé'
    ).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }
}
