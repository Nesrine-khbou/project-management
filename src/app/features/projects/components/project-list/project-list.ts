import { Component } from '@angular/core';
import { TaskList } from "../task-list/task-list";
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  imports: [NgClass, TaskList, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {
  searchTerm: string = '';
  statusFilter: string = '';

  projects = [
    {
      name: 'Refonte du site e-commerce',
      description: 'Amélioration de l’interface et ajout de nouvelles fonctionnalités.',
      status: 'En cours',
      tasks: [
        { title: 'Conception UI', priority: 'Haute', status: 'Terminé' },
        { title: 'Frontend', priority: 'Haute', status: 'En cours' },
        { title: 'Paiement', priority: 'Moyenne', status: 'En attente' }
      ]
    },
    {
      name: 'Application mobile RH',
      description: 'Développement d’une application pour gérer les congés.',
      status: 'En cours',
      tasks: [
        { title: 'Base de données', priority: 'Haute', status: 'Terminé' },
        { title: 'Authentification', priority: 'Moyenne', status: 'En cours' },
        { title: 'Notifications', priority: 'Basse', status: 'En attente' }
      ]
    },
    {
      name: 'Migration Cloud',
      description: 'Déplacement des serveurs internes vers le cloud.',
      status: 'En attente',
      tasks: [
        { title: 'Audit', priority: 'Haute', status: 'En attente' },
        { title: 'Choix fournisseur', priority: 'Moyenne', status: 'En attente' }
      ]
    },
    {
      name: 'Tableau de bord',
      description: 'Création d’un dashboard pour suivre les indicateurs.',
      status: 'Terminé',
      tasks: [
        { title: 'Définition des KPIs', priority: 'Haute', status: 'Terminé' },
        { title: 'Visualisations', priority: 'Moyenne', status: 'Terminé' }
      ]
    }
  ];

  get filteredProjects() {
    return this.projects.filter(project => {
      const matchSearch =
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchStatus =
        this.statusFilter === '' || project.status === this.statusFilter;

      return matchSearch && matchStatus;
    });
  }
}
