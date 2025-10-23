export interface Task {
  title: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  status: 'En attente' | 'En cours' | 'Terminé';
  description: string;
  assignee: string;
  deadline: string;  
  createdAt: string; 
  progress: string;  
}

export interface Project {
  name: string;
  description: string;
  status: 'En cours' | 'En attente' | 'Terminé';
  tasks: Task[];
}
