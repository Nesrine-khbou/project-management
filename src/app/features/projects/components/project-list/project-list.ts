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
        {
          title: 'Conception UI',
          priority: 'Haute',
          status: 'Terminé',
          description: 'Création de la maquette et des éléments graphiques du site.',
          assignee: 'Nesrine',
          deadline: '2025-10-20',
          createdAt: '2025-09-30',
          progress: '100%'
        },
        {
          title: 'Frontend',
          priority: 'Haute',
          status: 'En cours',
          description: 'Intégration de la maquette en HTML, CSS et Angular.',
          assignee: 'Amine',
          deadline: '2025-10-25',
          createdAt: '2025-10-01',
          progress: '70%'
        },
        {
          title: 'Paiement',
          priority: 'Moyenne',
          status: 'En attente',
          description: 'Mise en place du système de paiement sécurisé.',
          assignee: 'Sara',
          deadline: '2025-11-01',
          createdAt: '2025-10-05',
          progress: '0%'
        }
      ]
    },
    {
      name: 'Application mobile RH',
      description: 'Développement d’une application pour gérer les congés.',
      status: 'En cours',
      tasks: [
        {
          title: 'Base de données',
          priority: 'Haute',
          status: 'Terminé',
          description: 'Création du schéma de base de données pour gérer les employés et congés.',
          assignee: 'Youssef',
          deadline: '2025-10-15',
          createdAt: '2025-09-20',
          progress: '100%'
        },
        {
          title: 'Authentification',
          priority: 'Moyenne',
          status: 'En cours',
          description: 'Mise en place du système de connexion et inscription.',
          assignee: 'Amina',
          deadline: '2025-10-25',
          createdAt: '2025-10-02',
          progress: '60%'
        },
        {
          title: 'Notifications',
          priority: 'Basse',
          status: 'En attente',
          description: 'Envoi des notifications aux employés pour les demandes de congé.',
          assignee: 'Nour',
          deadline: '2025-11-01',
          createdAt: '2025-10-07',
          progress: '0%'
        }
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
