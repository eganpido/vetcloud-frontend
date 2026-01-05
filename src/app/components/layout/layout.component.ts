import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Siguroha nga naay Router diri
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AvatarModule, ButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarVisible: boolean = false;
  username: string = localStorage.getItem('username') || 'Admin';

  // KANI ANG NAWALA: I-inject ang Router diri
  constructor(private router: Router) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); // Karon mugana na ni
  }
}