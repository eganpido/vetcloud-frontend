import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

// PrimeNG Modules
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield'; // Para sa icons sulod sa input
import { InputIconModule } from 'primeng/inputicon'; // Para sa icons sulod sa input

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    TagModule,
    SkeletonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  loading: boolean = true;
  selectedDate: Date = new Date();

  // Para sa Dialog/Pop-up
  displayTaskDialog: boolean = false;

  // Default structure para sa bag-ong task
  newTask = {
    title: '',
    pet: '',
    time: '',
    type: 'Medical'
  };

  upcomingSchedules = [
    {
      date: new Date(),
      title: 'Deworming Session',
      pet: 'Heineken',
      type: 'Medical',
      time: '09:00 AM',
      color: 'blue'
    },
    {
      date: new Date(2026, 0, 10),
      title: 'Full Grooming',
      pet: 'Bruno (Shih Tzu)',
      type: 'Grooming',
      time: '01:30 PM',
      color: 'pink'
    },
    {
      date: new Date(2026, 0, 10),
      title: 'Vaccination',
      pet: 'Cadburry',
      type: 'Medical',
      time: '10:30 AM',
      color: 'blue'
    },
    {
      date: new Date(2026, 0, 10),
      title: 'Medical Checkup',
      pet: 'Cloud9',
      type: 'Medical',
      time: '02:30 PM',
      color: 'white'
    }
  ];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Simulate delay para makita ang skeleton loader
    setTimeout(() => {
      this.customerService.getDashboardStats().subscribe({
        next: (data: any) => {
          this.stats = [
            { label: 'Total Customers', value: data.totalCustomers || 0, icon: 'pi pi-users', color: 'blue', footer: 'Overall Count' },
            { label: 'New Registrations', value: data.todayCount || 0, icon: 'pi pi-user-plus', color: 'green', footer: 'Registered Today' },
            { label: 'System Status', value: 'Online', icon: 'pi pi-bolt', color: 'purple', footer: 'Operational' },
            { label: 'Active Appointments', value: '12', icon: 'pi pi-calendar-clock', color: 'orange', footer: 'For this week' }
          ];
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading dashboard stats:', err);
          this.loading = false;
          this.stats = [{ label: 'Error', value: '!', icon: 'pi pi-exclamation-triangle', color: 'red', footer: 'Check Connection' }];
        }
      });
    }, 1500);
  }

  showAddTaskDialog() {
    this.displayTaskDialog = true;
  }

  saveTask() {
    // Basic Validation: Dili i-save kon walay title o pet name
    if (!this.newTask.title || !this.newTask.pet) {
      alert('Palihug kompletoha ang impormasyon.');
      return;
    }

    const taskToAdd = {
      ...this.newTask,
      date: new Date(this.selectedDate), // Sigurohon nga fresh date object
      color: this.newTask.type === 'Medical' ? 'blue' : 'pink'
    };

    // I-add sa listahan (Pinaka-una)
    this.upcomingSchedules = [taskToAdd, ...this.upcomingSchedules];

    // I-close ang dialog ug i-reset ang form
    this.displayTaskDialog = false;
    this.resetNewTask();
  }

  private resetNewTask() {
    this.newTask = {
      title: '',
      pet: '',
      time: '',
      type: 'Medical'
    };
  }
}