import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project, Task } from '../../../../types';
import { AddProject } from "../../../../add-project/add-project";
import { ProjectCard } from "../../../../project-card/project-card";
import { ProjectService } from '../../../../services/project';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [FormsModule, AddProject, ProjectCard],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectList implements OnInit {
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {} // Use ProjectService instead of HttpClient

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects() // Use service method
      .subscribe((data) => this.projects = data);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProject(newProject: Project) {
    this.projectService.addProject(newProject) // Use service method
      .subscribe((createdProject) => {
        this.projects.push(createdProject);
        this.showAddForm = false;
      });
  }

  addTaskToProject(event: {projectId: string, task: Task}) {
    const project = this.projects.find(p => p.id === event.projectId);
    if (project && project.id) {
      const newTask = {
        ...event.task,
        id: project.tasks.length + 1
      };
      
      const updatedProject = {
        ...project,
        tasks: [...project.tasks, newTask]
      };

      this.projectService.updateProject(project.id, updatedProject)
        .subscribe(() => {
          const index = this.projects.findIndex(p => p.id === event.projectId);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
        });
    }
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