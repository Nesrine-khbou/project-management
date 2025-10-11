import { Component, signal } from '@angular/core';
import { ProjectList } from "./features/projects/components/project-list/project-list";

@Component({
  selector: 'app-root',
  imports: [ProjectList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mon-projet');
}
