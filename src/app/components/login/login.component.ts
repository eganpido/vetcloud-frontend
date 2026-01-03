import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- Importante para sa [(ngModel)]
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Service
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,      // <--- Ayaw kalimti ni
        RouterLink,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        PasswordModule,
        IconFieldModule,
        InputIconModule,
        ToastModule       // <--- Para sa pop-up messages
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [MessageService] // Kinahanglan ni para sa Toast
})
export class LoginComponent {
    // 1. Data model para sa form
    loginData = {
        username: '',
        password: ''
    };

    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    // 2. Login Function
    onLogin() {
        if (!this.loginData.username || !this.loginData.password) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter username and password' });
            return;
        }

        this.loading = true;
        this.authService.login(this.loginData).subscribe({
            next: (res: any) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful!' });

                // Pagkahuman og 1 second, i-redirect sa dashboard
                setTimeout(() => {
                    this.router.navigate(['/customers']);
                }, 1000);
            },
            error: (err: any) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Login Failed' });
            }
        });
    }
}