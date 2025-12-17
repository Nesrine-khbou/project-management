import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('mon-projet');
  isDarkMode = false;
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Check for saved dark mode preference (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'true') {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      }
    }
  }

  toggleDarkMode() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
