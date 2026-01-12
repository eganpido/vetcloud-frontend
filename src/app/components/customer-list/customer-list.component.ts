import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

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
    private messageService: MessageService,
    private authService: AuthService,
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

  // Logic

  openCreate() {
    // Kuhaon ang ID gikan sa AuthService
    const loggedInUserId = this.authService.getCurrentUserId();

    this.selectedCustomer = {
      code: '',
      customerName: '',
      customerAdress: '',
      contactNumber: '',
      isLocked: false,
      createdById: loggedInUserId // I-set ang creator
    };

    this.isEdit = false;
    this.viewingDetail = true;
  }

  viewDetail(customer: any) {
    this.selectedCustomer = { ...customer };
    this.isEdit = true;
    this.viewingDetail = true;
  }

  // Actions
  handleSave(customerData: any) {
    const payload = {
      ...customerData,
      createdById: customerData.createdById?.userId || customerData.createdById,
      updatedById: customerData.updatedById?.userId || customerData.updatedById
    };

    if (this.isEdit) {
      this.customerService.updateCustomer(payload.customerId, payload).subscribe({
        next: (updatedRes: any) => {
          this.showSuccess('Update successful');

          this.selectedCustomer = { ...updatedRes };

          this.loadCustomers();
        },
        error: (err) => {
          const msg = err.error?.message || 'Update failed';
          this.showError(msg);
        }
      });
    } else {
      this.customerService.saveCustomer(payload).subscribe({
        next: (newCustomer: any) => {
          this.showSuccess('Save successful');

          this.selectedCustomer = { ...newCustomer };
          this.isEdit = true;

          this.loadCustomers();
        },
        error: (err) => {
          const msg = err.error?.message || 'Save failed';
          this.showError(msg);
        }
      });
    }
  }

  handleBack() {
    this.loadCustomers();
    this.viewingDetail = false;
  }

  handleLock(customerData: any) {
    this.confirmationService.confirm({
      key: 'customerDialog',
      message: 'Are you sure you want to LOCK this record?',
      header: 'Lock Confirmation',
      icon: 'pi pi-lock',
      acceptLabel: 'Yes, Lock it',
      rejectLabel: 'No, Cancel it',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        const customerId = customerData.customerId || 0;

        const payload = {
          ...customerData,
          createdById: customerData.createdById?.userId || customerData.createdById,
          updatedById: customerData.updatedById?.userId || customerData.updatedById
        };

        this.customerService.lockCustomer(customerId, payload).subscribe({
          next: (res: any) => {

            Object.assign(customerData, res);

            if (this.selectedCustomer && (this.selectedCustomer.customerId === res.customerId || !this.selectedCustomer.customerId)) {
              this.selectedCustomer = { ...res };
            }

            this.isEdit = true;
            this.showSuccess('Lock successful');
            this.loadCustomers();
          },
          error: (err: any) => {
            console.error('Server Error:', err);
            const msg = err.error?.message || 'Lock failed';
            this.showError(msg);
          }
        });
      }
    });
  }

  handleUnlock(customerData: any) {
    this.confirmationService.confirm({
      key: 'customerDialog',
      message: 'Are you sure you want to UNLOCK this record? This will allow users to edit the information again.',
      header: 'Unlock Confirmation',
      icon: 'pi pi-lock-open',
      acceptLabel: 'Yes, Unlock it',
      rejectLabel: 'No, Cancel it',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // I-siguro nga customerId ra ang i-pasa
        const id = customerData.customerId;

        this.customerService.unlockCustomer(id).subscribe({
          next: (res: any) => {
            // 1. I-update ang customerData sa table list
            // Ang 'res' duna na'y fullname tungod sa backend aggregation helper (getCustomerWithDetails)
            Object.assign(customerData, res);

            // 2. I-update ang selectedCustomer (ang naa sa Detail View)
            if (this.selectedCustomer && this.selectedCustomer.customerId === res.customerId) {
              this.selectedCustomer = { ...res };
            }

            this.showSuccess('Unlock successful');
            this.loadCustomers(); // Refresh ang listahan para sigurado
          },
          error: (err: any) => {
            console.error('Unlock Error:', err);
            const msg = err.error?.message || 'Unlock failed';
            this.showError(msg);
          }
        });
      }
    });
  }

  handleDelete(customerData: any) {
    this.confirmationService.confirm({
      key: 'customerDialog',
      message: `Confirm delete for ${customerData.customerName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptLabel: 'Yes, Delete it',
      rejectLabel: 'No, Cancel it',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.deleteCustomer(customerData.customerId).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.customerId !== customerData.customerId);
            this.showSuccess('Delete successful');
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

    this.showSuccess('Export successful');
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}