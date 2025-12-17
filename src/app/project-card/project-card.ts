import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskList } from '../features/projects/components/task-list/task-list';
import { AddTask } from '../add-task/add-task';
import { EditProject } from '../edit-project/edit-project';
import { Project, Task } from '../types';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass, TaskList, AddTask, EditProject],
  templateUrl: './project-card.html'
})
export class ProjectCard {
  @Input() project!: Project;
  @Output() taskAdded = new EventEmitter<{projectId: string, task: Task}>();
  @Output() taskUpdated = new EventEmitter<{projectId: string, task: Task}>();
  @Output() projectUpdated = new EventEmitter<Project>();
  
  showAddTaskForm = false;
  showEditTaskForm = false;
  showEditProjectForm = false;
  taskToEdit: Task | undefined;

  getProjectProgress(project: Project): number {
    const totalTasks = project.tasks.length;
    if (totalTasks === 0) return 0;

    const completed = project.tasks.filter(t => t.status === 'Terminé').length;
    return Math.round((completed / totalTasks) * 100);
  }

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
    this.showEditTaskForm = false;
    this.taskToEdit = undefined;
  }

  toggleEditProjectForm() {
    this.showEditProjectForm = !this.showEditProjectForm;
  }

  openEditTaskForm(task: Task) {
    this.taskToEdit = task;
    this.showEditTaskForm = true;
    this.showAddTaskForm = false;
  }

  closeTaskForm() {
    this.showAddTaskForm = false;
    this.showEditTaskForm = false;
    this.taskToEdit = undefined;
  }

  addTask(newTask: Task) {
    this.taskAdded.emit({
      projectId: this.project.id!,
      task: newTask
    });
    this.closeTaskForm();
  }

  updateTask(updatedTask: Task) {
    this.taskUpdated.emit({
      projectId: this.project.id!,
      task: updatedTask
    });
    this.closeTaskForm();
  }

  updateProject(updatedProject: Project) {
    this.projectUpdated.emit(updatedProject);
    this.showEditProjectForm = false;
  }
}