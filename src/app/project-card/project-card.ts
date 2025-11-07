import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskList } from '../features/projects/components/task-list/task-list';
import { Project } from '../types';


@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass, TaskList],
  templateUrl: './project-card.html'
})
export class ProjectCard {
  @Input() project!: Project;

  getProjectProgress(project: Project): number {
    const totalTasks = project.tasks.length;
    if (totalTasks === 0) return 0;

    const completed = project.tasks.filter(t => t.status === 'Terminé').length;
    return Math.round((completed / totalTasks) * 100);
  }
}
