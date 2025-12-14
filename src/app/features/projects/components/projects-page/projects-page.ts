import { Component } from '@angular/core';
import { ProjectList } from '../project-list/project-list';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectList],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <app-project-list></app-project-list>
    </div>
  `
})
export class ProjectsPage {}
