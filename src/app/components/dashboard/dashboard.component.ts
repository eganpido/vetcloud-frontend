import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  loading: boolean = true;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.customerService.getDashboardStats().subscribe({
      next: (data: any) => {
        // I-format ang data para sa nindot nga Cards
        this.stats = [
          {
            label: 'Total Customers',
            value: data.totalCustomers || 0,
            icon: 'pi pi-users text-primary',
            colorClass: 'blue-card',
            footer: 'Overall count'
          },
          {
            label: 'New Registrations',
            value: data.todayCount || 0,
            icon: 'pi pi-user-plus text-primary',
            colorClass: 'green-card',
            footer: 'Registered today'
          },
          {
            label: 'System Status',
            value: 'Online',
            icon: 'pi pi-bolt text-primary',
            colorClass: 'purple-card',
            footer: 'Operational'
          }
        ];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading dashboard stats:', err);
        this.loading = false;
        this.stats = [
          {
            label: 'System Error',
            value: '!',
            icon: 'pi pi-exclamation-triangle',
            colorClass: 'red-card',
            footer: 'Check Connection'
          }
        ];
      }
    });
  }
}