import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskList } from '../features/projects/components/task-list/task-list';
import { AddTask } from '../add-task/add-task';
import { Project, Task } from '../types';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass, TaskList, AddTask],
  templateUrl: './project-card.html'
})
export class ProjectCard {
  @Input() project!: Project;
  @Output() taskAdded = new EventEmitter<{projectId: string, task: Task}>();
  
  showAddTaskForm = false;

  getProjectProgress(project: Project): number {
    const totalTasks = project.tasks.length;
    if (totalTasks === 0) return 0;

    const completed = project.tasks.filter(t => t.status === 'Terminé').length;
    return Math.round((completed / totalTasks) * 100);
  }

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  addTask(newTask: Task) {
    this.taskAdded.emit({
      projectId: this.project.id!,
      task: newTask
    });
    this.showAddTaskForm = false;
  }
}