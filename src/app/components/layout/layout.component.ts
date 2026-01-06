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
  // Kuhaon nato ang fullname ug branchName gikan sa localStorage
  fullname: string = localStorage.getItem('fullname') || 'Userless';
  branchName: string = localStorage.getItem('branchName') || 'Branchless';

  // KANI ANG NAWALA: I-inject ang Router diri
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Optional: Re-check localStorage inig load sa component
    this.fullname = localStorage.getItem('fullname') || 'Userless';
    this.branchName = localStorage.getItem('branchName') || 'Branchless';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); // Karon mugana na ni
  }
}