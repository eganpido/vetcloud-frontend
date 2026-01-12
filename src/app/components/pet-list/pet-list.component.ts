import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    FloatLabelModule
  ],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent implements OnInit {
  @Input() customerId: any;
  pets: any[] = [];
  loading: boolean = false;
  displayEditModal: boolean = false;
  selectedPet: any = null;

  constructor(
    private petService: PetService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    // Dili lang nato ni papason, pero ang main logic naa sa ngOnChanges
    if (this.customerId) {
      this.loadPets();
    }
  }

  // KINI ANG IMPORTANTE: Mo-trigger ni basta mausab ang value sa @Input
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] && changes['customerId'].currentValue) {
      console.log('Customer ID updated:', changes['customerId'].currentValue);
      this.loadPets();
    }
  }

  loadPets() {
    // Siguroha nga dili modagan kung walay ID
    if (!this.customerId) return;

    this.loading = true;
    this.petService.getPets(this.customerId).subscribe({
      next: (data) => {
        this.pets = data;
        this.loading = false;
        console.log('Pets fetched successfully:', this.pets);
      },
      error: (err) => {
        console.error('Error loading pets:', err);
        this.loading = false;
      }
    });
  }

  viewDetail(pet: any) {
    this.selectedPet = { ...pet };
    this.displayEditModal = true;
  }

  openCreate() {
    this.selectedPet = {
      petId: 0,
      petName: '',
      species: '',
      breed: '',
      birthDate: null,
      gender: '',
      customerId: this.customerId,
      isLocked: false
    };

    this.displayEditModal = true;

    console.log('Opening modal for new pet registration...');
  }

  // Save
  handleSave() {
    if (!this.selectedPet) return;

    const payload = {
      ...this.selectedPet,
      customerId: this.customerId // Siguroha nga naka-link sa husto nga customer
    };

    const isExisting = !!this.selectedPet.petId;

    if (isExisting) {
      this.petService.updatePet(payload.petId, payload).subscribe({
        next: (updatedRes: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successful' });
          const index = this.pets.findIndex(p => p.petId === updatedRes.petId);
          if (index !== -1) this.pets[index] = { ...updatedRes };
        },
        error: (err) => {
          const msg = err.error?.message || 'Update failed';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        }
      });
    } else {
      this.petService.savePet(payload).subscribe({
        next: (newPet: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save successful' });

          this.pets.push(newPet);
        },
        error: (err) => {
          const msg = err.error?.message || 'Save failed';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        }
      });
    }
  }

  handleLock(petData: any) {
    this.confirmationService.confirm({
      key: 'petDialog',
      message: `Are you sure you want to LOCK <b>${petData.petName}</b>?`,
      header: 'Lock Confirmation',
      icon: 'pi pi-lock',
      acceptLabel: 'Yes, Lock it',
      rejectLabel: 'No, Cancel it',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        const petId = petData.petId || 0;

        const payload = {
          ...petData,
          customerId: this.customerId,
          isLocked: true
        };

        this.petService.lockPet(petId, payload).subscribe({
          next: (res: any) => {
            Object.assign(petData, res);

            if (this.selectedPet && this.selectedPet.petId === res.petId) {
              this.selectedPet = { ...res };
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Locked',
              detail: 'Lock successful'
            });

            this.loadPets();
          },
          error: (err: any) => {
            console.error('Server Error:', err);
            const msg = err.error?.message || 'Lock failed';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
          }
        });
      }
    });
  }

  handleUnlock(petData: any) {
    this.confirmationService.confirm({
      key: 'petDialog',
      message: `Are you sure you want to UNLOCK <b>${petData.petName}</b>? This will allow users to edit the information again.`,
      header: 'Unlock Confirmation',
      icon: 'pi pi-lock-open',
      acceptLabel: 'Yes, Unlock it',
      rejectLabel: 'No, Cancel it',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        const id = petData.petId;

        this.petService.unlockPet(id).subscribe({
          next: (res: any) => {
            Object.assign(petData, res);

            if (this.selectedPet && this.selectedPet.petId === res.petId) {
              this.selectedPet = { ...res };
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Unlock successful',
              detail: `${petData.petName} is now editable.`
            });

            this.loadPets();
          },
          error: (err: any) => {
            console.error('Unlock Error:', err);
            const msg = err.error?.message || 'Unlock failed';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
          }
        });
      }
    });
  }

  // Delete
  handleDelete(pet: any) {
    this.confirmationService.confirm({
      key: 'petDialog',
      message: `Are you sure want to delete <b>${pet.petName}</b>?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",
      acceptLabel: 'Yes, Delete it',
      rejectLabel: 'No, Cancel it',
      rejectButtonStyleClass: "p-button-danger",
      acceptButtonStyleClass: "p-button-primary",
      accept: () => {
        this.loading = true;
        this.petService.deletePet(pet.petId).subscribe({
          next: () => {
            this.pets = this.pets.filter(p => p.petId !== pet.petId);
            this.loading = false;
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Delete successful' });
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
          }
        });
      }
    });
  }
}