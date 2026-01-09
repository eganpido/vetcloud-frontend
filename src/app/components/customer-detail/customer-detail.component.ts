import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

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
    TagModule
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

  save() {
    // I-emit ang data sa parent para i-save sa database
    this.onSave.emit(this.customer);
  }

  lock() {
    // Inig click, i-emit padulong sa parent para sa Confirmation Dialog ug API call
    this.onLock.emit(this.customer);
  }

  unlock() {
    // Inig click, i-emit padulong sa parent para sa API call
    this.onUnlock.emit(this.customer);
  }

  back() {
    // Inig click sa back, pahibalo-on ang parent aron mo-refresh ang listahan
    this.onBack.emit();
  }
}