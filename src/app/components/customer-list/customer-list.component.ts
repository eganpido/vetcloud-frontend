import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

// Detail Component
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    RouterLink,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    SkeletonModule,
    CustomerDetailComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  loading: boolean = true;
  skeletonRows = Array(10).fill({});

  // View Control
  viewingDetail: boolean = false;
  isEdit: boolean = false;
  selectedCustomer: any = {};

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
        setTimeout(() => { this.loading = false; }, 500);
      },
      error: (err: any) => {
        console.error('Error loading data:', err);
        this.loading = false;
        this.showError('Failed to fetch customers');
      }
    });
  }

  // --- VIEW LOGIC ---

  openCreate() {
    this.selectedCustomer = { code: '', customerName: '', customerAdress: '', contactNumber: '', isLocked: false };
    this.isEdit = false;
    this.viewingDetail = true;
  }

  viewDetail(customer: any) {
    this.selectedCustomer = { ...customer };
    this.isEdit = true;
    this.viewingDetail = true;
  }

  // --- ACTIONS ---
  handleSave(customerData: any) {
    if (this.isEdit) {
      // UPDATE EXISTING RECORD
      this.customerService.updateCustomer(customerData._id, customerData).subscribe({
        next: (updatedRes: any) => {
          this.showSuccess('Customer updated successfully');

          // PABILIN SA PAGE: 
          // I-update lang nato ang local object aron sigurado nga fresh ang data sa UI
          this.selectedCustomer = { ...customerData };

          // (Optional) I-refresh ang listahan sa background para inig click sa "Back", 
          // updated na ang table.
          this.loadCustomers();
        },
        error: (err) => this.showError('Update failed')
      });
    } else {
      // CREATE NEW RECORD
      this.customerService.createCustomer(customerData).subscribe({
        next: (newCustomer: any) => {
          this.showSuccess('New customer saved');

          // PABILIN SA PAGE:
          // Importante: I-assign ang bag-ong ID gikan sa server ngadto sa selectedCustomer
          // aron ma-enable ang "Lock" button (kay [disabled]="!customer._id" man to)
          this.selectedCustomer = { ...newCustomer };
          this.isEdit = true; // Usba ang mode ngadto sa Edit mode

          this.loadCustomers(); // Refresh list background
        },
        error: (err) => this.showError('Save failed')
      });
    }
  }

  handleBack() {
    this.loadCustomers();
    this.viewingDetail = false;
  }

  handleLock(customerData: any) {
    console.log('Row Data:', customerData);

    this.confirmationService.confirm({
      message: 'Are you sure you want to LOCK this record?',
      header: 'Lock Confirmation',
      icon: 'pi pi-lock',
      acceptLabel: 'Yes, Lock it',
      rejectLabel: 'No, Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.lockCustomer(customerData.customerId).subscribe({
          next: (res: any) => {
            customerData.isLocked = true;
            if (this.selectedCustomer && this.selectedCustomer.customerId === customerData.customerId) {
              this.selectedCustomer.isLocked = true;
            }
            this.showSuccess('Record locked successfully');
            this.loadCustomers();
          },
          error: (err: any) => {
            console.error('Server Error:', err);
            this.showError('Locking failed');
          }
        });
      }
    });
  }

  handleUnlock(customerData: any) {
    this.customerService.unlockCustomer(customerData.customerId).subscribe({
      next: (res: any) => {
        this.selectedCustomer.isLocked = false;
        this.showSuccess('Record unlocked successfully');
        this.loadCustomers();
      },
      error: (err: any) => {
        console.error(err);
        this.showError('Unlocking failed');
      }
    });
  }

  handleDelete(customerData: any) {
    this.confirmationService.confirm({
      message: `Confirm delete for ${customerData.customerName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Pasa ang customerId (e.g., 1, 2, 3)
        this.customerService.deleteCustomer(customerData.customerId).subscribe({
          next: () => {
            // I-remove sa listahan gamit ang customerId
            this.customers = this.customers.filter(c => c.customerId !== customerData.customerId);
            this.showSuccess('Deleted successfully');
          },
          error: (err: any) => {
            console.error("Delete failed:", err);
            this.showError('Delete failed');
          }
        });
      }
    });
  }

  exportToExcel() {
    if (!this.customers || this.customers.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'No record(s) to export.' });
      return;
    }

    const exportData = this.customers.map(c => ({
      'Customer Code': c.code || '',
      'Customer Name': c.customerName || '',
      'Address': c.customerAdress || '',
      'Contact Number': c.contactNumber || '',
      'Status': c.isLocked ? 'Locked' : 'Unlocked'
    }));

    const header = Object.keys(exportData[0]);
    const csvRows = exportData.map(row =>
      header.map(fieldName => {
        const value = (row as any)[fieldName];
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    csvRows.unshift(header.join(','));
    const csvString = csvRows.join('\r\n');
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Customer_List_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showSuccess('Exported successfully');
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}