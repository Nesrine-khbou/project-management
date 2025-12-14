import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';
import { ProjectsPage } from './features/projects/components/projects-page/projects-page';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: ProjectsPage },
  { path: '**', redirectTo: '/dashboard' }
];
