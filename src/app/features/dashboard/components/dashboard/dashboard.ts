import {
  Component,
  OnInit,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewChild,
  ElementRef,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProjectService } from '../../../../services/project';
import { Project } from '../../../../types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  projects: Project[] = [];
  private platformId = inject(PLATFORM_ID);
  isBrowser = false;

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  private themeObserver?: MutationObserver;
  @ViewChild('reportRoot') reportRoot!: ElementRef<HTMLElement>;

  // Statistics
  totalProjects = 0;
  completedProjects = 0;
  inProgressProjects = 0;
  totalTasks = 0;
  completedTasks = 0;

  // 🎨 Premium palette (matches your new UI)
  private palette = {
    indigo: { solid: 'rgba(99, 102, 241, 1)', soft: 'rgba(99, 102, 241, .18)' },   // indigo-500
    fuchsia:{ solid: 'rgba(217, 70, 239, 1)', soft: 'rgba(217, 70, 239, .18)' },  // fuchsia-500
    emerald:{ solid: 'rgba(16, 185, 129, 1)', soft: 'rgba(16, 185, 129, .18)' },  // emerald-500
    amber:  { solid: 'rgba(245, 158, 11, 1)', soft: 'rgba(245, 158, 11, .18)' },  // amber-500
    slate:  { solid: 'rgba(100, 116, 139, 1)', soft: 'rgba(100, 116, 139, .18)' } // slate-500
  };

  // Line Chart - Project Progress Over Time
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Projets terminés',
        borderColor: this.palette.indigo.solid,
        backgroundColor: this.palette.indigo.soft,
        pointBackgroundColor: this.palette.indigo.solid,
        pointBorderColor: 'transparent',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 3,
        tension: 0.35,
        fill: true
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = this.makeLineOptions();

  // Bar Chart - Projects by Status
  public barChartData: ChartData<'bar'> = {
    labels: ['En attente', 'En cours', 'Terminé'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Projets',
        backgroundColor: [
          this.palette.slate.soft,
          this.palette.amber.soft,
          this.palette.emerald.soft
        ],
        borderColor: [
          this.palette.slate.solid,
          this.palette.amber.solid,
          this.palette.emerald.solid
        ],
        borderWidth: 2,
        borderRadius: 12,
        maxBarThickness: 34
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = this.makeBarOptions();

  // Pie Chart - Task Status Distribution
  public pieChartData: ChartData<'pie'> = {
    labels: ['En attente', 'En cours', 'Terminé'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          this.palette.slate.soft,
          this.palette.indigo.soft,
          this.palette.emerald.soft
        ],
        borderColor: [
          this.palette.slate.solid,
          this.palette.indigo.solid,
          this.palette.emerald.solid
        ],
        borderWidth: 2
      }
    ]
  };

  public pieChartOptions: ChartOptions<'pie'> = this.makePieOptions();

  // Doughnut Chart - Task Priority Distribution
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Haute', 'Moyenne', 'Basse'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          this.palette.fuchsia.soft,
          this.palette.amber.soft,
          this.palette.emerald.soft
        ],
        borderColor: [
          this.palette.fuchsia.solid,
          this.palette.amber.solid,
          this.palette.emerald.solid
        ],
        borderWidth: 2
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = this.makeDoughnutOptions();

  constructor(private projectService: ProjectService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.setupThemeWatcher();     // ✅ auto-update when dark mode toggles
      this.applyThemeToCharts();    // ✅ initial styling
    }
    this.loadProjects();
  }

  ngOnDestroy() {
    this.themeObserver?.disconnect();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
      this.calculateStatistics();
      this.updateCharts();
      this.refreshCharts();
    });
  }

  calculateStatistics() {
    this.totalProjects = this.projects.length;
    this.completedProjects = this.projects.filter(p => p.status === 'Terminé').length;
    this.inProgressProjects = this.projects.filter(p => p.status === 'En cours').length;

    const allTasks = this.projects.flatMap(p => p.tasks);
    this.totalTasks = allTasks.length;
    this.completedTasks = allTasks.filter(t => t.status === 'Terminé').length;
  }

  updateCharts() {
    // Projects by Status
    const enAttente = this.projects.filter(p => p.status === 'En attente').length;
    const enCours   = this.projects.filter(p => p.status === 'En cours').length;
    const termine   = this.projects.filter(p => p.status === 'Terminé').length;
    this.barChartData.datasets[0].data = [enAttente, enCours, termine];

    // Tasks by Status
    const allTasks = this.projects.flatMap(p => p.tasks);
    const tasksEnAttente = allTasks.filter(t => t.status === 'En attente').length;
    const tasksEnCours   = allTasks.filter(t => t.status === 'En cours').length;
    const tasksTermine   = allTasks.filter(t => t.status === 'Terminé').length;
    this.pieChartData.datasets[0].data = [tasksEnAttente, tasksEnCours, tasksTermine];

    // Tasks by Priority
    const priorityHaute   = allTasks.filter(t => t.priority === 'Haute').length;
    const priorityMoyenne = allTasks.filter(t => t.priority === 'Moyenne').length;
    const priorityBasse   = allTasks.filter(t => t.priority === 'Basse').length;
    this.doughnutChartData.datasets[0].data = [priorityHaute, priorityMoyenne, priorityBasse];

    // Line Chart (last 7 days simulation)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    });

    const completedData = last7Days.map((_, index) =>
      Math.min(this.completedProjects, Math.floor((index + 1) * (this.completedProjects / 7)))
    );

    this.lineChartData.labels = last7Days;
    this.lineChartData.datasets[0].data = completedData;

    this.applyThemeToCharts(); // keep borders / text correct
  }

  getCompletionPercentage(): number {
    if (this.totalProjects === 0) return 0;
    return Math.round((this.completedProjects / this.totalProjects) * 100);
  }

  getTaskCompletionPercentage(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  // =========================
  // 🌙 Theme-aware Chart Styles
  // =========================

  private isDark(): boolean {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }

  private themeTokens() {
    const dark = this.isDark();
    return {
      text: dark ? 'rgba(226, 232, 240, .92)' : 'rgba(15, 23, 42, .86)',      // slate-200 / slate-900
      muted: dark ? 'rgba(148, 163, 184, .85)' : 'rgba(71, 85, 105, .85)',   // slate-400 / slate-600
      grid: dark ? 'rgba(148, 163, 184, .14)' : 'rgba(15, 23, 42, .08)',
      tooltipBg: dark ? 'rgba(2, 6, 23, .92)' : 'rgba(255, 255, 255, .96)',
      tooltipBorder: dark ? 'rgba(148, 163, 184, .25)' : 'rgba(15, 23, 42, .12)',
      surfaceBorder: dark ? 'rgba(15, 23, 42, 1)' : 'rgba(255, 255, 255, 1)' // used for pie/doughnut slice separation
    };
  }

  private makeTooltip() {
    const t = this.themeTokens();
    return {
      enabled: true,
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      borderWidth: 1,
      titleColor: t.text,
      bodyColor: t.muted,
      padding: 12,
      cornerRadius: 12,
      displayColors: true
    };
  }

  private makeLineOptions(): ChartOptions<'line'> {
    const t = this.themeTokens();
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: t.muted, usePointStyle: true, pointStyle: 'circle' }
        },
        tooltip: this.makeTooltip()
      },
      scales: {
        x: {
          ticks: { color: t.muted },
          grid: { color: t.grid }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: t.muted },
          grid: { color: t.grid }
        }
      }
    };
  }

  private makeBarOptions(): ChartOptions<'bar'> {
    const t = this.themeTokens();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: this.makeTooltip()
      },
      scales: {
        x: {
          ticks: { color: t.muted },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: t.muted },
          grid: { color: t.grid }
        }
      }
    };
  }

  private makePieOptions(): ChartOptions<'pie'> {
    const t = this.themeTokens();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, color: t.muted }
        },
        tooltip: this.makeTooltip()
      }
    };
  }

  private makeDoughnutOptions(): ChartOptions<'doughnut'> {
    const t = this.themeTokens();
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, color: t.muted }
        },
        tooltip: this.makeTooltip()
      }
    };
  }

  private applyThemeToCharts() {
    const t = this.themeTokens();

    // Update options so text/grid matches dark/light
    this.lineChartOptions = this.makeLineOptions();
    this.barChartOptions = this.makeBarOptions();
    this.pieChartOptions = this.makePieOptions();
    this.doughnutChartOptions = this.makeDoughnutOptions();

    // Better slice separation (looks MUCH nicer)
    const pieDs = this.pieChartData.datasets[0];
    pieDs.borderColor = [t.surfaceBorder, t.surfaceBorder, t.surfaceBorder];
    pieDs.borderWidth = 3;

    const doughDs = this.doughnutChartData.datasets[0];
    doughDs.borderColor = [t.surfaceBorder, t.surfaceBorder, t.surfaceBorder];
    doughDs.borderWidth = 3;
  }

  private refreshCharts() {
    queueMicrotask(() => {
      this.charts?.forEach((c) => c.update());
    });
  }

  private setupThemeWatcher() {
    this.themeObserver = new MutationObserver(() => {
      this.applyThemeToCharts();
      this.refreshCharts();
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }


  async exportDashboardPdf() {
    if (typeof window === 'undefined') return; // safety for SSR
  
    // dynamic imports (keeps bundle smaller)
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
  
    const el = this.reportRoot?.nativeElement;
    if (!el) return;
  
    // optional: ensure charts are fully drawn
    this.refreshCharts();
    await new Promise((r) => setTimeout(r, 80));
  
    // OPTIONAL: force light report (uncomment if you want)
    // const root = document.documentElement;
    // const hadDark = root.classList.contains('dark');
    // if (hadDark) root.classList.remove('dark');
  
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });
  
    // if (hadDark) root.classList.add('dark'); // restore if you forced light mode
  
    const imgData = canvas.toDataURL('image/png', 1.0);
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
  
  
    const imgProps = pdf.getImageProperties(imgData);
    const renderW = pageW - margin * 2;
    const renderH = (imgProps.height * renderW) / imgProps.width;
  
    let y = margin;
    pdf.addImage(imgData, 'PNG', margin, y, renderW, renderH, undefined, 'FAST');
  
    // multi-page if content is long
    let remaining = renderH - (pageH - margin * 2);
    while (remaining > 0) {
      pdf.addPage();
      const offsetY = margin - (renderH - remaining);
      pdf.addImage(imgData, 'PNG', margin, offsetY, renderW, renderH, undefined, 'FAST');
      remaining -= (pageH - margin * 2);
    }
  
    const fileName = `dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  }
  
}
