import { Component, OnInit } from '@angular/core'; // Gidugang ang OnInit
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { Select } from 'primeng/select';

// Services
import { AuthService } from '../../services/auth.service';
import { BranchService } from '../../services/branch.service'; // <--- I-add kini

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        PasswordModule,
        IconFieldModule,
        InputIconModule,
        ToastModule,
        Select // <--- Ayaw kalimti sa imports array
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
    // Data models
    loginData = {
        username: '',
        password: ''
    };

    branches: any[] = []; // Listahan sa branches gikan sa DB
    selectedBranch: any = null; // Ang napili nga branch object
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private branchService: BranchService, // Inject ang BranchService
        private router: Router,
        private messageService: MessageService
    ) { }

    // Inig load sa page, kuhaon dayon ang mga branches
    ngOnInit() {
        this.loadBranches();
    }

    loadBranches() {
        this.branchService.getAllBranches().subscribe({
            next: (data: any) => {
                this.branches = data;

                if (this.branches && this.branches.length > 0) {
                    // I-set ang default value sa first record
                    this.selectedBranch = this.branches.find(b => b.isActive === true) || this.branches[0];
                }
            },
            error: (err: any) => {
                console.error('Error loading branches', err);
            }
        });
    }

    onLogin() {
        // 1. Validation: Siguroha nga naay username, password, ug branch
        if (!this.loginData.username || !this.loginData.password) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter credentials' });
            return;
        }

        if (!this.selectedBranch) {
            this.messageService.add({ severity: 'warn', summary: 'Required', detail: 'Please select a branch' });
            return;
        }

        this.loading = true;
        this.authService.login(this.loginData).subscribe({
            next: (res: any) => {
                // 2. I-save ang gipili nga BranchId sa session/localStorage
                // Ang res.user.branchId (optional) vs selectedBranch.branchId
                this.authService.setCurrentBranch(this.selectedBranch.branchId);

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful!' });

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