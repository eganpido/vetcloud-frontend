import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { PetListComponent } from '../pet-list/pet-list.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TextareaModule,
    TagModule,
    SkeletonModule,
    PetListComponent,
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent {
  @Input() customer: any = { isLocked: false };
  @Input() isEditMode: boolean = false;

  @Output() onSave = new EventEmitter<any>();
  @Output() onLock = new EventEmitter<any>();
  @Output() onUnlock = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<void>();

  loading: boolean = true;

  constructor() { }

  ngOnInit() {
    this.loading = true;

    // I-log nato aron makita nato ang tinuod nga sulod sa customer object
    console.log('Customer Input Data:', this.customer);

    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
  save() {
    this.onSave.emit(this.customer);
  }

  lock() {
    this.onLock.emit(this.customer);
  }

  unlock() {
    this.onUnlock.emit(this.customer);
  }

  back() {
    this.onBack.emit();
  }
}